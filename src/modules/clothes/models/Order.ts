export interface Order {
  id: string;
  person: string;
  clothType: string;

  size?: string | number;
  count?: number;
  paid?: number;

  submittedOn: Date;
  orderedOn?: Date;
  doneOn?: Date;
}
