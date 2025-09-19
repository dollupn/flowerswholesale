-- Add variations column to products table
ALTER TABLE public.products 
ADD COLUMN variations jsonb DEFAULT '[]'::jsonb;