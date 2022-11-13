import store from "@/store";
import firebase from "firebase/app";
import { Callout, Crew } from "@/modules/callout/models/Callout";
import { Person } from "@/modules/people/models/Person";
import { Vehicle } from "@/modules/vehicles/models/Vehicle";
import { formatDate, formatDateTime } from "@/utils/dates";

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
  const personen = getPersonen();
  const fahrzeuge = getFahrzeuge();
  const fahrzeugeMap: { [id: string]: Vehicle | undefined } = fahrzeuge.reduce(
    (map, fahrzeug) => ({ ...map, [fahrzeug.id]: fahrzeug }),
    {}
  );
  return Promise.all([fetchEinsaetze(), fetchMannschaften()]).then(
    ([einsaetze, mannschaftenMap]) => {
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

      const dataRows: string[][] = einsaetze.map((einsatz) => {
        const mannschaft: Crew = mannschaftenMap[einsatz.id] || { id: "" };
        return [
          formatDate(einsatz.alarmTime),
          wrapString(einsatz.keyword),
          wrapString(einsatz.catchphrase),
          wrapString(einsatz.address),
          einsatz.type?.Brand ? "x" : "",
          einsatz.type?.THL ? "x" : "",
          einsatz.type?.["UG-ÖEL"] ? "x" : "",
        ]
          .concat(
            personen.map((person) => {
              if (mannschaft.standby && mannschaft.standby[person.id]) {
                return "Bereitschaft";
              } else if (mannschaft.vehicles) {
                for (const fahrzeugId in mannschaft.vehicles) {
                  if (mannschaft.vehicles[fahrzeugId][person.id]) {
                    return fahrzeugeMap[fahrzeugId]?.name || fahrzeugId;
                  }
                }
              }
              return "";
            })
          )
          .concat([
            formatDateTime(einsatz.alarmTime),
            einsatz.vehicles
              ? formatDateTime(
                  Math.max(
                    ...Object.values(einsatz.vehicles).map(
                      (fahrzeugImEinsatz) => Number(fahrzeugImEinsatz.endTime)
                    )
                  )
                )
              : "",
          ])
          .concat(
            fahrzeuge.map((fahrzeug) =>
              einsatz.vehicles && einsatz.vehicles[fahrzeug.id]
                ? formatDateTime(Number(einsatz.vehicles[fahrzeug.id].endTime))
                : ""
            )
          );
      });

      return [headerRow].concat(dataRows);
    }
  );
}
