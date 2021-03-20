export interface Order {
  id: string;
  person: string;
  clothingType: string;

  size?: string | number;
  count?: number;
  paid?: number;

  submittedOn: number;
  orderedOn?: number;
  doneOn?: number;
}
