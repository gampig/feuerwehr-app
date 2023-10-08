import storage from "../utils/storage";
import { Crew } from "@/modules/callout/models/Callout";
import { FahrzeugeMap } from "@/modules/vehicles/models/Vehicle";
import { CalloutFormatter } from "../utils/CalloutFormatter";
import { isPersonInMannschaft, getGroupOfPerson } from "../utils/mannschaft";

/**
 *
 * @param str
 * @returns str wrapped with quotation marks
 */
function wrapString(str?: string): string {
  return str ? '"' + str + '"' : "";
}

export function exportPeopleWithStatus(): string[][] {
  return [
    ["Name", "Status"],
    ...storage.getPersonen().map((person) => [person.id, person.status]),
  ];
}

export async function exportMannschaftsbuch(): Promise<string[][]> {
  const fahrzeuge = storage.getFahrzeuge();
  const fahrzeugeMap: FahrzeugeMap = fahrzeuge.reduce(
    (map, fahrzeug) => ({ ...map, [fahrzeug.id]: fahrzeug }),
    {}
  );
  return Promise.all([
    storage.fetchEinsaetze(),
    storage.fetchMannschaften(),
  ]).then(([einsaetze, mannschaftenMap]) => {
    const personen = storage
      .getPersonen()
      .filter(
        (person) =>
          person.status == "Aktiv" ||
          Object.values(mannschaftenMap).some(
            (mannschaft) =>
              mannschaft && isPersonInMannschaft(person, mannschaft)
          )
      );

    const dataRows: string[][] = einsaetze.map((einsatz) => {
      const einsatzFormatter = new CalloutFormatter(einsatz);
      const mannschaft: Crew = mannschaftenMap[einsatz.id] || { id: "" };
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
          personen.map((person) =>
            getGroupOfPerson(person, mannschaft, fahrzeugeMap)
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
