import { Database } from "@/integrations/supabase/types";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export interface ProductVariation {
  label: string;
  sku: string;
  price: number;          // in cents
  quantity?: number | null;
  [key: string]: any;     // Make it compatible with Json type
}

/** Accept JSON array or nothing */
type VariationInput =
  | ProductRow["variations"]
  | null
  | undefined;

/**
 * Normalize variations from products.variations JSON column
 *
 * Returns:
 *  - null  => when no variations provided at all
 *  - []    => when provided but none are valid
 *  - array => normalized list (price in cents)
 */
export const parseProductVariations = (
  variations: VariationInput
): ProductVariation[] | null => {
  if (variations == null) return null;
  if (!Array.isArray(variations)) return null;

  const normalized = variations
    .map((v) => {
      // From JSON array on products.variations
      if (
        v &&
        typeof v === "object" &&
        "sku" in v &&
        "price" in v &&
        "label" in v
      ) {
        const { sku, price, label, quantity } = v as Record<string, unknown>;
        if (typeof sku !== "string" || typeof label !== "string") return null;
        if (typeof price !== "number") return null;

        return {
          sku,
          price,
          label,
          quantity: typeof quantity === "number" ? quantity : null,
        } as ProductVariation;
      }

      return null;
    })
    .filter((x): x is ProductVariation => x !== null);

  return normalized;
};

/** Base price: product.price (cents) OR min variation price (cents) */
export const getProductBasePrice = (product: ProductRow): number => {
  const variations = parseProductVariations(product.variations);
  if (!variations || variations.length === 0) return product.price;

  return variations.reduce(
    (min, v) => (v.price < min ? v.price : min),
    variations[0].price
  );
};