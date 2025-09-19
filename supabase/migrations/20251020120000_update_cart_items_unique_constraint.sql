-- Allow multiple cart rows per product distinguished by variation
ALTER TABLE public.cart_items
  DROP CONSTRAINT IF EXISTS cart_items_user_id_product_id_key;

DROP INDEX IF EXISTS cart_items_user_id_product_id_variation_idx;

CREATE UNIQUE INDEX cart_items_user_id_product_id_variation_idx
  ON public.cart_items (user_id, product_id, COALESCE(variation_sku, ''));
