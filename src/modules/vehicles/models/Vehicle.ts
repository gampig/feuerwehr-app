export interface Vehicle {
  name: string;
  inServiceSince?: number;
  outOfServiceSince?: number;
  maxCrewNumber?: number;
  pictureUrl?: string;
  isUgOeel?: boolean;
}

export interface VehicleInCallout extends Vehicle {
  crewNumber?: number;
}
