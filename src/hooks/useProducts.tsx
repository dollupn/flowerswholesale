import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import {
  parseProductVariations,
  ProductVariation,
  ProductVariationRow,
} from '@/lib/product';

type ProductRow = Database['public']['Tables']['products']['Row'];
type ProductQueryRow = ProductRow & {
  product_variations?: ProductVariationRow[] | null;
};

type Product = ProductRow & { variations: ProductVariation[] | null };
export type ProductWithVariations = Product;

const mapProduct = (product: ProductQueryRow): Product => {
  const { product_variations, ...baseProduct } = product;
  return {
    ...baseProduct,
    // Prefer related rows if present; fallback to JSON on the product row
    variations: parseProductVariations(product_variations ?? baseProduct.variations),
  };
};

export function useProducts() {
  return useQuery<ProductWithVariations[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_variations(*)')
        .eq('in_stock', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data ?? []).map((p) => mapProduct(p as ProductQueryRow));
    },
  });
}

export function useAllProducts() {
  return useQuery<ProductWithVariations[]>({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_variations(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data ?? []).map((p) => mapProduct(p as ProductQueryRow));
    },
  });
}

export function useFeaturedProducts() {
  return useQuery<ProductWithVariations[]>({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_variations(*)')
        .eq('featured', true)
        .eq('in_stock', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data ?? []).map((p) => mapProduct(p as ProductQueryRow));
    },
  });
}

export function useProduct(id: string) {
  return useQuery<ProductWithVariations | null>({
    queryKey: ['products', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_variations(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? mapProduct(data as ProductQueryRow) : null;
    },
    enabled: !!id,
  });
}

export function useProductsByCategory(category?: string) {
  return useQuery<ProductWithVariations[]>({
    queryKey: ['products', 'category', category],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*, product_variations(*)')
        .eq('in_stock', true);

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map((p) => mapProduct(p as ProductQueryRow));
    },
    enabled: category !== undefined,
  });
}
