-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'US',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table (migrating from static data)
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- Price in cents
  image_url TEXT,
  category TEXT,
  featured BOOLEAN DEFAULT FALSE,
  in_stock BOOLEAN DEFAULT TRUE,
  origin TEXT,
  grade TEXT,
  processing TEXT,
  uses TEXT[],
  storage TEXT,
  gallery TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount INTEGER NOT NULL, -- Total in cents
  shipping_address JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_per_item INTEGER NOT NULL, -- Price per item in cents at time of purchase
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cart table for persistent cart
CREATE TABLE public.cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Products policies (public read access for shopping)
CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT 
USING (true);

-- Orders policies
CREATE POLICY "Users can view their own orders" 
ON public.orders FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.orders FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" 
ON public.orders FOR UPDATE 
USING (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view their order items" 
ON public.order_items FOR SELECT 
USING (auth.uid() = (SELECT user_id FROM public.orders WHERE id = order_id));

CREATE POLICY "Users can create order items for their orders" 
ON public.order_items FOR INSERT 
WITH CHECK (auth.uid() = (SELECT user_id FROM public.orders WHERE id = order_id));

-- Cart policies
CREATE POLICY "Users can manage their own cart" 
ON public.cart_items FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial products data
INSERT INTO public.products (id, name, price, image_url, description, category, featured, in_stock, origin, grade, processing, uses, storage, gallery) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Premium Madagascar Vanilla Beans', 850, 'https://images.unsplash.com/photo-1586049332816-6de5d1e8e38b?w=500', 'Grade A vanilla beans directly sourced from Madagascar. Perfect for baking, desserts, and gourmet cooking.', 'Vanilla Beans', true, true, 'Sambava, Madagascar', 'Grade A (Gourmet)', 'Traditional curing process', ARRAY['Baking', 'Ice cream', 'Custards', 'Cocktails'], 'Cool, dry place in airtight container', ARRAY['https://images.unsplash.com/photo-1586049332816-6de5d1e8e38b?w=500', 'https://images.unsplash.com/photo-1557679569-4bd6ac1bb98e?w=500', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500']),
('550e8400-e29b-41d4-a716-446655440002', 'Pure Vanilla Extract', 450, 'https://images.unsplash.com/photo-1557679569-4bd6ac1bb98e?w=500', '100% pure vanilla extract made from Madagascar vanilla beans. No artificial flavors or additives.', 'Vanilla Extract', true, true, 'Made from Madagascar vanilla beans', 'Pure extract (35% alcohol)', 'Slow extraction process', ARRAY['Baking', 'Beverages', 'Desserts', 'Marinades'], 'Room temperature, away from light', ARRAY['https://images.unsplash.com/photo-1557679569-4bd6ac1bb98e?w=500', 'https://images.unsplash.com/photo-1586049332816-6de5d1e8e38b?w=500']),
('550e8400-e29b-41d4-a716-446655440003', 'Fine Vanilla Powder', 320, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500', 'Finely ground vanilla beans powder. Perfect for dry mixes, chocolate, and where liquid extract isn''t ideal.', 'Vanilla Powder', true, true, 'Ground Madagascar vanilla beans', 'Fine powder', 'Ground whole vanilla beans', ARRAY['Chocolate making', 'Dry mixes', 'Dusting', 'Coffee'], 'Airtight container, cool dry place', ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500', 'https://images.unsplash.com/photo-1586049332816-6de5d1e8e38b?w=500']),
('550e8400-e29b-41d4-a716-446655440004', 'Grade B Vanilla Beans', 650, 'https://images.unsplash.com/photo-1586049332816-6de5d1e8e38b?w=500', 'Grade B vanilla beans, perfect for extract making and cooking. Lower moisture content, intense flavor.', 'Vanilla Beans', false, true, 'Sambava, Madagascar', 'Grade B (Extract grade)', 'Traditional curing, lower moisture', ARRAY['Extract making', 'Cooking', 'Infusions'], 'Cool, dry place in airtight container', ARRAY['https://images.unsplash.com/photo-1586049332816-6de5d1e8e38b?w=500', 'https://images.unsplash.com/photo-1557679569-4bd6ac1bb98e?w=500']),
('550e8400-e29b-41d4-a716-446655440005', 'Gourmet Vanilla Paste', 550, 'https://images.unsplash.com/photo-1557679569-4bd6ac1bb98e?w=500', 'Rich vanilla paste with vanilla bean specks. Combines the convenience of extract with visual appeal.', 'Vanilla Paste', false, true, 'Made from Madagascar vanilla beans', 'Gourmet paste with bean specks', 'Ground beans with extract', ARRAY['Baking', 'Frosting', 'Ice cream', 'Sauces'], 'Refrigerate after opening', ARRAY['https://images.unsplash.com/photo-1557679569-4bd6ac1bb98e?w=500', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500']),
('550e8400-e29b-41d4-a716-446655440006', 'Vanilla-Infused Sugar', 280, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500', 'Premium cane sugar infused with real vanilla beans. Perfect for baking and beverages.', 'Vanilla Sugar', false, true, 'Mauritian cane sugar with Madagascar vanilla', 'Premium infused sugar', 'Long infusion process', ARRAY['Baking', 'Tea & coffee', 'Desserts', 'Cocktails'], 'Airtight container, room temperature', ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500', 'https://images.unsplash.com/photo-1586049332816-6de5d1e8e38b?w=500']);