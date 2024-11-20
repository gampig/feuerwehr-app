export interface Participant {
  name: string;
  group?: string;
}

export interface Training {
  id: string;
  startTime: string;
  endTime: string;
  groups: string[];
  title: string;
  location?: string;
  participants: Participant[];
}
