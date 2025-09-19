-- Fix ambiguous product embedding by removing duplicate FK we added
ALTER TABLE public.cart_items DROP CONSTRAINT IF EXISTS fk_cart_items_product_id;
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS fk_order_items_product_id;
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS fk_order_items_order_id;

-- Replace old uniqueness with variation-aware rules
ALTER TABLE public.cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_product_id_key;

-- Unique when no variation (ensures only one row without variation)
CREATE UNIQUE INDEX IF NOT EXISTS ux_cart_items_unique_novariation
ON public.cart_items(user_id, product_id)
WHERE variation_sku IS NULL;

-- Unique per variation (allows multiple variations for same product)
CREATE UNIQUE INDEX IF NOT EXISTS ux_cart_items_unique_variation
ON public.cart_items(user_id, product_id, variation_sku)
WHERE variation_sku IS NOT NULL;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_variation_sku ON public.cart_items(variation_sku);
