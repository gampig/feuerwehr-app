export interface Order {
  id: string;
  person: string;
  clothType: string;

  size?: string | number;
  count?: number;
  paid?: number;

  submittedOn: number;
  orderedOn?: number;
  doneOn?: number;
}
