interface OrderBase {
  person: string;
  clothingType: string;

  size?: string | number;
  count?: number;
  paid?: number;
}

/**
 * Order model used for database
 */
export interface OrderEntity extends OrderBase {
  submittedOn: number;
  orderedOn?: number;
  doneOn?: number;
}

/**
 * Order model used for UI
 */
export interface OrderView extends OrderBase {
  id: string;

  totalPrice?: number;

  submittedOn: string;
  orderedOn?: string;
  doneOn?: string;
}
