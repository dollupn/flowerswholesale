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

-- Add foreign key constraint from cart_items to products (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_cart_items_product_id'
    ) THEN
        ALTER TABLE public.cart_items 
        ADD CONSTRAINT fk_cart_items_product_id 
        FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraint from order_items to products (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_order_items_product_id'
    ) THEN
        ALTER TABLE public.order_items
        ADD CONSTRAINT fk_order_items_product_id 
        FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add foreign key constraint from order_items to orders (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_order_items_order_id'
    ) THEN
        ALTER TABLE public.order_items
        ADD CONSTRAINT fk_order_items_order_id 
        FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add indexes for better performance (if not exists)
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON public.cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);