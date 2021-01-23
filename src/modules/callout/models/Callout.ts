type CalloutType = "THL" | "Brand" | "UG-ÖEL";

export interface CalloutVehicle {
  endTime: number | string;
}

export interface Callout {
  id: string;
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

export type CalloutRole = typeof ALL_CALLOUT_ROLES[number];

interface PeopleArray {
  [id: string]: CalloutRole | boolean;
}

export interface Crew {
  id: string;
  standby?: PeopleArray;
  vehicles?: {
    [id: string]: PeopleArray;
  };
}
