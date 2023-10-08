export const ALL_CLOTHING_TYPE_CATEGORIES = [
  "PSA",
  "PSA Jugend",
  "Verein",
  "Anderes",
] as const;

export type ClothingTypeCategory =
  (typeof ALL_CLOTHING_TYPE_CATEGORIES)[number];

export interface ClothingType {
  id: string;
  name: string;

  isAvailable?: boolean;
  category?: ClothingTypeCategory;
  price?: number;
  sizes?: Array<string | number>;
}
