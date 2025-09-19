-- Allow multiple cart rows per product distinguished by variation
ALTER TABLE public.cart_items
  DROP CONSTRAINT IF EXISTS cart_items_user_id_product_id_key;

ALTER TABLE public.cart_items
  DROP CONSTRAINT IF EXISTS cart_items_user_product_variation_unique;

DROP INDEX IF EXISTS cart_items_user_id_product_id_variation_idx;
DROP INDEX IF EXISTS cart_items_user_product_null_variation_idx;

-- Ensure each (user, product, variation) combination is unique while
-- still enforcing a single row for non-variant products
ALTER TABLE public.cart_items
  ADD CONSTRAINT cart_items_user_product_variation_unique
    UNIQUE (user_id, product_id, variation_sku);

CREATE UNIQUE INDEX cart_items_user_product_null_variation_idx
  ON public.cart_items (user_id, product_id)
  WHERE variation_sku IS NULL;
