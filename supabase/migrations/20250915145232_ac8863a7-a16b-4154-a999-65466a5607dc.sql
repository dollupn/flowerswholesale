-- Add custom label field to products table
ALTER TABLE public.products 
ADD COLUMN label text;