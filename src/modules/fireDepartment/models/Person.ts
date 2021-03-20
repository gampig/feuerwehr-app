type PersonStatus = "Aktiv" | "Jugend" | "Passiv" | "Ausgetreten" | "Unbekannt";

export interface Person {
  id: string;
  status: PersonStatus;
  recentCalloutsCount?: number;
}
