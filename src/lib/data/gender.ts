import type { Gender } from "@/lib/types";

export function matchesCatalogueGender(
  productGender: Gender,
  filter?: "men" | "women",
) {
  if (!filter) return true;
  return productGender === filter || productGender === "unisex";
}

export const LOCKED_COLLECTION_SLUGS = new Set(["men", "women"]);
