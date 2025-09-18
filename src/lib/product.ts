import { Database } from "@/integrations/supabase/types";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type ProductVariationRow = Database["public"]["Tables"]["product_variations"]["Row"];

export interface ProductVariation {
  label: string;
  sku: string;
  price: number;
  quantity?: number | null;
}

type VariationInput =
  | ProductRow["variations"]
  | ProductVariationRow[]
  | null
  | undefined;

const isProductVariationRow = (value: unknown): value is ProductVariationRow => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return (
    "sku" in value &&
    "price" in value &&
    "label" in value &&
    typeof (value as ProductVariationRow).sku === "string" &&
    typeof (value as ProductVariationRow).label === "string" &&
    typeof (value as ProductVariationRow).price === "number"
  );
};

export const parseProductVariations = (
  variations: VariationInput
): ProductVariation[] | null => {
  if (!variations) {
    return null;
  }

  if (!Array.isArray(variations)) {
    return null;
  }

  return variations
    .map((variation) => {
      if (isProductVariationRow(variation)) {
        return {
          sku: variation.sku,
          price: variation.price,
          label: variation.label,
          quantity:
            typeof variation.quantity === "number"
              ? variation.quantity
              : null,
        } satisfies ProductVariation;
      }

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
    .filter((variation): variation is ProductVariation => variation !== null);
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
