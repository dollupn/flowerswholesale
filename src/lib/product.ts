import { Database } from "@/integrations/supabase/types";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export interface ProductVariation {
  label: string;
  sku: string;
  price: number;
  quantity?: number | null;
  [key: string]: any;
}

export const parseProductVariations = (
  variations: ProductRow["variations"]
): ProductVariation[] | null => {
  if (!variations) {
    return null;
  }

  if (!Array.isArray(variations)) {
    return null;
  }

  return variations
    .map((variation) => {
      if (
        variation &&
        typeof variation === "object" &&
        "sku" in variation &&
        "price" in variation &&
        "label" in variation
      ) {
        const { sku, price, label, quantity } = variation as Record<string, unknown>;

        if (typeof sku !== "string" || typeof label !== "string") {
          return null;
        }

        if (typeof price !== "number") {
          return null;
        }

        return {
          sku,
          price,
          label,
          quantity: typeof quantity === "number" ? quantity : null,
        } satisfies ProductVariation;
      }

      return null;
    })
    .filter((variation): variation is NonNullable<typeof variation> => variation !== null);
};

export const getProductBasePrice = (product: ProductRow): number => {
  const variations = parseProductVariations(product.variations);

  if (!variations || variations.length === 0) {
    return product.price;
  }

  return variations.reduce((lowest, variation) => {
    return variation.price < lowest ? variation.price : lowest;
  }, variations[0].price);
};
