type PersonStatus = "Aktiv" | "Jugend" | "Passiv" | "Ausgetreten" | "Unbekannt";

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  status: PersonStatus;
  recentCalloutsCount?: number;
}
