export interface Vehicle {
  id: string;
  name: string;
  inServiceSince?: number;
  outOfServiceSince?: number;
  maxCrewNumber?: number;
  pictureUrl?: string;
}
