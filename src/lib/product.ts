import { Database } from "@/integrations/supabase/types";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type ProductVariationRow =
  Database["public"]["Tables"]["product_variations"]["Row"];

export interface ProductVariation {
  label: string;
  sku: string;
  price: number;          // in cents
  quantity?: number | null;
}

/** Accept either embedded JSON, related rows, or nothing */
type VariationInput =
  | ProductRow["variations"]
  | ProductVariationRow[]
  | null
  | undefined;

const isProductVariationRow = (value: unknown): value is ProductVariationRow => {
  if (!value || typeof value !== "object") return false;
  return (
    "sku" in value &&
    "price" in value &&
    "label" in value &&
    typeof (value as ProductVariationRow).sku === "string" &&
    typeof (value as ProductVariationRow).label === "string" &&
    typeof (value as ProductVariationRow).price === "number"
  );
};

/**
 * Normalize variations from either:
 * - products.variations (JSON array), or
 * - product_variations join (rows)
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
      // From related table rows
      if (isProductVariationRow(v)) {
        return {
          sku: v.sku,
          price: v.price,
          label: v.label,
          quantity: typeof v.quantity === "number" ? v.quantity : null,
        } as ProductVariation;
      }

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
