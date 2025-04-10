export const ALL_PERSON_STATUS_VALUES = [
  "Aktiv",
  "Jugend",
  "Passiv",
  "Ausgetreten",
] as const;

export type PersonStatus = (typeof ALL_PERSON_STATUS_VALUES)[number];

export interface Person {
  status: PersonStatus;
  recentCalloutsCount?: number;
}
