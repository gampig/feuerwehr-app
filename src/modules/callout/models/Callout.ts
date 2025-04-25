import { Vehicle } from "@/modules/vehicles/models/Vehicle";

type CalloutType = "THL" | "Brand" | "UG-ÖEL";

export interface CalloutVehicle {
  endTime: number | string;
}

export interface Callout {
  alarmTime: number;
  alarmTimeFormatted?: string;
  endTime?: number; // deprecated
  endTimeFormatted?: string; // deprecated
  keyword?: string;
  catchphrase?: string;
  address?: string;
  type?: { [type in CalloutType]?: boolean };
  vehicles?: {
    [id: string]: CalloutVehicle;
  };
}

export const ALL_CALLOUT_ROLES = [
  "Einsatzleiter",
  "Zugführer",
  "Gruppenführer",
  "Maschinist",
  "Atemschutz",
  "Melder",
  "Atemschutzüberwachung",
] as const;

export type CalloutRole = (typeof ALL_CALLOUT_ROLES)[number];

interface PeopleArray {
  [id: string]: CalloutRole | boolean;
}

export interface Crew {
  standby?: PeopleArray;
  vehicles?: {
    [id: string]: PeopleArray;
  };
}

export interface CalloutVehicleWithCrew {
  vehicle: Vehicle;
  calloutDetails?: CalloutVehicle;
  crewMembers: PeopleArray;
}

export type MannschaftenMap = { [calloutId: string]: Crew | undefined };
