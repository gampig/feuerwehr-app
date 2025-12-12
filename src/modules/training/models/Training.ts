export interface Participant {
  name: string;
  group?: string;
}

export interface Training {
  creationTime: number;
  startTime?: number;
  endTime?: number;
  responsiblePeople?: string[];
  groups?: string[];
  title: string;
  participants?: { [id: string]: Participant };
}
