export const ALL_CLOTH_TYPE_CATEGORIES = [
  "PSA",
  "PSA Jugend",
  "Verein",
  "Anderes",
] as const;

export type ClothTypeCategory = typeof ALL_CLOTH_TYPE_CATEGORIES[number];

export interface ClothType {
  id: string;
  manufacturer?: string;
  name: string;

  isAvailable?: boolean;
  category?: ClothTypeCategory;
  price?: number;
  sizes?: Array<string | number>;
}
