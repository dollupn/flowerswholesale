-- Allow multiple cart rows per product distinguished by variation
ALTER TABLE public.cart_items
  DROP CONSTRAINT IF EXISTS cart_items_user_id_product_id_key;

-- Handle legacy names from older branches
ALTER TABLE public.cart_items
  DROP CONSTRAINT IF EXISTS cart_items_user_product;
ALTER TABLE public.cart_items
  DROP CONSTRAINT IF EXISTS cart_items_user_product_variation_unique;

DROP INDEX IF EXISTS cart_items_user_id_product_id_variation_idx;
DROP INDEX IF EXISTS cart_items_user_product_null_variation_idx;

-- Enforce uniqueness:
--   - (user_id, product_id, variation_sku) unique for variant lines
--   - 1 row per (user_id, product_id) when variation_sku IS NULL
ALTER TABLE public.cart_items
  ADD CONSTRAINT cart_items_user_product_variation_unique
  UNIQUE (user_id, product_id, variation_sku);

CREATE UNIQUE INDEX cart_items_user_product_null_variation_idx
  ON public.cart_items (user_id, product_id)
  WHERE variation_sku IS NULL;

-- Optional: forbid empty string SKUs (we only allow NULL or real SKUs)
ALTER TABLE public.cart_items
  DROP CONSTRAINT IF EXISTS cart_items_variation_sku_not_empty;
ALTER TABLE public.cart_items
  ADD CONSTRAINT cart_items_variation_sku_not_empty
  CHECK (variation_sku IS NULL OR length(btrim(variation_sku)) > 0);
