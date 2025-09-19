-- Add variation columns to cart_items table
ALTER TABLE public.cart_items 
ADD COLUMN IF NOT EXISTS variation_sku text,
ADD COLUMN IF NOT EXISTS variation_label text,
ADD COLUMN IF NOT EXISTS variation_price integer;

-- Add variation columns to order_items table  
ALTER TABLE public.order_items
ADD COLUMN IF NOT EXISTS variation_sku text,
ADD COLUMN IF NOT EXISTS variation_label text,
ADD COLUMN IF NOT EXISTS variation_price integer;