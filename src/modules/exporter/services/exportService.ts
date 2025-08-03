import storage from "../utils/storage";
import { Crew } from "@/modules/callout/models/Callout";
import { CalloutFormatter } from "../utils/CalloutFormatter";
import {
  isPersonInMannschaft,
  getGroupOfPerson,
} from "@/modules/callout/utils/mannschaft";

/**
 *
 * @param str
 * @returns str wrapped with quotation marks
 */
function wrapString(str?: string): string {
  return str ? '"' + str + '"' : "";
}

export async function exportPeopleWithStatus(): Promise<string[][]> {
  const personen = await storage.getPersonen();
  return [
    ["Name", "Status"],
    ...personen.map((person) => [person.id, person.status]),
  ];
}

export async function exportMannschaftsbuch(): Promise<string[][]> {
  return Promise.all([
    storage.getFahrzeuge(),
    storage.getEinsaetze(),
    storage.getPersonen(),
    storage.fetchMannschaften(),
  ]).then(([fahrzeuge, einsaetze, allePersonen, mannschaftenMap]) => {
    const personen = allePersonen.filter(
      (person) =>
        person.status == "Aktiv" ||
        Object.values(mannschaftenMap).some(
          (mannschaft) => mannschaft && isPersonInMannschaft(person, mannschaft)
        )
    );

    const dataRows: string[][] = einsaetze.map((einsatz) => {
      const einsatzFormatter = new CalloutFormatter(einsatz);
      const mannschaft: Crew = mannschaftenMap[einsatz.id] || {};
      return [
        einsatzFormatter.getDatum(),
        wrapString(einsatz.keyword),
        wrapString(einsatz.catchphrase),
        wrapString(einsatz.address),
        einsatz.type?.Brand ? "x" : "",
        einsatz.type?.THL ? "x" : "",
        einsatz.type?.["UG-ÖEL"] ? "x" : "",
      ]
        .concat(
          personen.map(
            (person) => getGroupOfPerson(person.id, mannschaft, fahrzeuge) || ""
          )
        )
        .concat([einsatzFormatter.getBeginn(), einsatzFormatter.getEnde()])
        .concat(
          fahrzeuge.map((fahrzeug) =>
            einsatzFormatter.getEndeOfFahrzeug(fahrzeug)
          )
        );
    });

    const headerRow = [
      "Datum",
      "Stichwort",
      "Schlagwort",
      "Adresse",
      "Brand",
      "THL",
      "UG-ÖEL",
    ]
      .concat(personen.map((person) => person.id.replace(", ", " ")))
      .concat(["Einsatzbeginn", "Einsatzende"])
      .concat(fahrzeuge.map((fahrzeug) => "Einsatzende " + fahrzeug.name));

    return [headerRow].concat(dataRows);
  });
}
