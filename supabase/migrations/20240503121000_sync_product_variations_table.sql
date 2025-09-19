-- Ensure product variations table exists for structured variation management
CREATE TABLE IF NOT EXISTS public.product_variations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sku text NOT NULL UNIQUE,
  label text NOT NULL,
  price integer NOT NULL,
  quantity integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.product_variations ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_product_variations_product_id
  ON public.product_variations(product_id);

DO $$ BEGIN
  CREATE POLICY "Product variations are viewable by everyone"
    ON public.product_variations
    FOR SELECT
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can insert product variations"
    ON public.product_variations
    FOR INSERT
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can update product variations"
    ON public.product_variations
    FOR UPDATE
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can delete product variations"
    ON public.product_variations
    FOR DELETE
    USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
