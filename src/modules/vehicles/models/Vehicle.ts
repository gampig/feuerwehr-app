export interface Vehicle {
  id: string;
  name: string;
  inServiceSince?: number;
  outOfServiceSince?: number;
  maxCrewNumber?: number;
  pictureUrl?: string;
  isUgOeel?: boolean;
}

export type FahrzeugeMap = { [fahrzeugId: string]: Vehicle | undefined };
