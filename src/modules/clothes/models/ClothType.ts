const CATEGORIES = ["PSA", "PSA Jugend", "Verein", "Anderes"] as const;

export type Category = typeof CATEGORIES[number];

export interface ClothType {
  id: string;
  manufacturer?: string;
  name: string;

  isAvailable?: boolean;
  category?: Category;
  price?: number;
  sizes?: Array<string | number>;
}
