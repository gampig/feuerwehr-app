export interface Participant {
  name: string;
  group?: string;
}

export interface Training {
  id: string;
  creationTime: number;
  startTime?: number;
  endTime?: number;
  groups: string[];
  title: string;
  location?: string;
  participants: Participant[];
}
