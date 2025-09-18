alter table public.products
  add column if not exists variations jsonb;

alter table public.cart_items
  add column if not exists variation_sku text,
  add column if not exists variation_label text,
  add column if not exists variation_price integer;

alter table public.order_items
  add column if not exists variation_sku text,
  add column if not exists variation_label text,
  add column if not exists variation_price integer;
