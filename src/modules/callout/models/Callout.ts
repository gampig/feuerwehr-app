type Type = "THL" | "Brand" | "UG-ÖEL";

export interface Callout {
  id: string;
  alarmTime: Date;
  endTime?: Date /** @deprecated */;
  keyword?: string;
  catchphrase?: string;
  address?: string;
  types?: Type[];
}

export const ROLES = [
  "Einsatzleiter",
  "Zugführer",
  "Gruppenführer",
  "Maschinist",
  "Atemschutz",
  "Melder",
  "Atemschutzüberwachung",
] as const;

export type Role = typeof ROLES[number];

export interface Person {
  name: string;
  role?: Role;
}

export interface Group {
  id: string;
  people?: string[];
}

export interface StandbyGroup extends Group {}

export interface VehicleCrew extends Group {
  endTime?: Date;
}
