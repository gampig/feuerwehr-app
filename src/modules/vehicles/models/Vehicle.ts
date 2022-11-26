export interface Vehicle {
  id: string;
  name: string;
  inServiceSince?: number;
  outOfServiceSince?: number;
  maxCrewNumber?: number;
  pictureUrl?: string;
}

export type FahrzeugeMap = { [fahrzeugId: string]: Vehicle | undefined };
