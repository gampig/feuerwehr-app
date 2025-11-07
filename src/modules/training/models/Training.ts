export interface Participant {
  name: string;
  group?: string;
}

export interface Training {
  id: string;
  creationTime: number;
  startTime?: number;
  endTime?: number;
  responsiblePeople?: string[];
  groups: string[];
  title: string;
  participants: Participant[];
}
