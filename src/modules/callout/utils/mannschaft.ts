import { Crew } from "@/modules/callout/models/Callout";
import { Person } from "@/modules/people/models/Person";
import { Vehicle } from "@/modules/vehicles/models/Vehicle";

export function isPersonInMannschaft(
  person: Person,
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
  fahrzeuge: Vehicle[]
): string | undefined {
  if (mannschaft.standby && mannschaft.standby[personId]) {
    return "Bereitschaft";
  } else if (mannschaft.vehicles) {
    for (const fahrzeugId in mannschaft.vehicles) {
      if (mannschaft.vehicles[fahrzeugId][personId]) {
        return (
          fahrzeuge.find((fahrzeug) => fahrzeug.id == fahrzeugId)?.name ||
          fahrzeugId
        );
      }
    }
  }
  return undefined;
}
