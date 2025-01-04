export interface Participant {
  name: string;
}

export interface Appointment {
  name?: string;
  startTime: number;
  endTime?: number;
  participants: Participant[];
}

export interface Event {
  name: string;
  location?: string;
  appointments: Appointment[];
}
