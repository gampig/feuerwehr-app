import store from "@/store";
import firebase from "firebase/app";
import { Callout, Crew } from "@/modules/callout/models/Callout";
import { Person } from "@/modules/people/models/Person";
import { Vehicle } from "@/modules/vehicles/models/Vehicle";
import { formatDateTime, formatDateWithoutYear } from "@/utils/dates";

type FahrzeugeMap = { [fahrzeugId: string]: Vehicle | undefined };
type MannschaftenMap = { [calloutId: string]: Crew | undefined };

function getPersonen(): Person[] {
  return store.state.people.people as Person[];
}

function getFahrzeuge(): Vehicle[] {
  return store.state.vehicles.vehicles as Vehicle[];
}

async function fetchEinsaetze(): Promise<Callout[]> {
  if (!store.state.callouts.allCalloutsLoaded) {
    await store.dispatch("callouts/bind", { loadAllCallouts: true });
  }
  return store.state.callouts.callouts as Callout[];
}

async function fetchMannschaften() {
  const snapshot = await firebase.database().ref("crew").once("value");
  return snapshot.val() as MannschaftenMap;
}

function isPersonInMannschaft(person: Person, mannschaft: Crew): boolean {
  const isInBereitschaft: boolean =
    mannschaft.standby != undefined && mannschaft.standby[person.id] != null;

  const isInAnyFahrzeug: boolean =
    mannschaft.vehicles != undefined &&
    Object.values(mannschaft.vehicles).some(
      (personen) => personen[person.id] != null
    );

  return isInBereitschaft || isInAnyFahrzeug;
}

function getGroupOfPerson(
  person: Person,
  mannschaft: Crew,
  fahrzeuge: FahrzeugeMap
): string {
  if (mannschaft.standby && mannschaft.standby[person.id]) {
    return "Bereitschaft";
  } else if (mannschaft.vehicles) {
    for (const fahrzeugId in mannschaft.vehicles) {
      if (mannschaft.vehicles[fahrzeugId][person.id]) {
        return fahrzeuge[fahrzeugId]?.name || fahrzeugId;
      }
    }
  }
  return "";
}

class CalloutFormatter {
  private einsatz: Callout;

  constructor(einsatz: Callout) {
    this.einsatz = einsatz;
  }

  getDatum(): string {
    return formatDateWithoutYear(this.einsatz.alarmTime);
  }

  getBeginn(): string {
    return formatDateTime(this.einsatz.alarmTime);
  }

  getEnde(): string {
    return this.einsatz.vehicles
      ? formatDateTime(
          Math.max(
            ...Object.values(this.einsatz.vehicles).map((fahrzeugImEinsatz) =>
              Number(fahrzeugImEinsatz.endTime)
            )
          )
        )
      : "";
  }

  getEndeOfFahrzeug(fahrzeug: Vehicle): string {
    return this.einsatz.vehicles && this.einsatz.vehicles[fahrzeug.id]
      ? formatDateTime(Number(this.einsatz.vehicles[fahrzeug.id].endTime))
      : "";
  }
}

/**
 *
 * @param str
 * @returns str wrapped with quotation marks
 */
function wrapString(str?: string): string {
  return str ? '"' + str + '"' : "";
}

export function exportPeopleWithStatus(people: Person[]): string[][] {
  return [
    ["Name", "Status"],
    ...people.map((person) => [person.id, person.status]),
  ];
}

export async function exportMannschaftsbuch(): Promise<string[][]> {
  const fahrzeuge = getFahrzeuge();
  const fahrzeugeMap: FahrzeugeMap = fahrzeuge.reduce(
    (map, fahrzeug) => ({ ...map, [fahrzeug.id]: fahrzeug }),
    {}
  );
  return Promise.all([fetchEinsaetze(), fetchMannschaften()]).then(
    ([einsaetze, mannschaftenMap]) => {
      const personen = getPersonen().filter(
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
    }
  );
}
