import { Crew } from "@/modules/callout/models/Callout";
import { Person } from "@/modules/masterData/models/Person";
import { Vehicle } from "@/modules/vehicles/models/Vehicle";
import { VueDatabaseDocumentData, VueDatabaseQueryData } from "vuefire";

export function isPersonInMannschaft(
  person: NonNullable<VueDatabaseDocumentData<Person>>,
  mannschaft: Crew
): boolean {
  const isInBereitschaft: boolean =
    mannschaft.standby != undefined && mannschaft.standby[person.id] != null;

  const isInAnyFahrzeug: boolean =
    mannschaft.vehicles != undefined &&
    Object.values(mannschaft.vehicles).some(
      (personen) => personen[person.id] != null
    );

  return isInBereitschaft || isInAnyFahrzeug;
}

export function getGroupOfPerson(
  personId: string,
  mannschaft: Crew,
  fahrzeuge: VueDatabaseQueryData<Vehicle>
): string | undefined {
  if (mannschaft.standby && mannschaft.standby[personId]) {
    return "Bereitschaft";
  } else if (mannschaft.vehicles) {
    for (const fahrzeugId in mannschaft.vehicles) {
      if (mannschaft.vehicles[fahrzeugId][personId]) {
        const fahrzeugMatch = fahrzeuge.find(
          (fahrzeug) => fahrzeug.id == fahrzeugId
        );
        return fahrzeugMatch?.name || fahrzeugId;
      }
    }
  }
  return undefined;
}
