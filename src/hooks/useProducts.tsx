import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import {
  parseProductVariations,
  ProductVariation,
} from '@/lib/product';

type ProductRow = Database['public']['Tables']['products']['Row'];

type Product = ProductRow & { variations: ProductVariation[] | null };
export type ProductWithVariations = Product;

const mapProduct = (product: ProductRow): Product => {
  return {
    ...product,
    variations: parseProductVariations(product.variations),
  };
};

export function useProducts() {
  return useQuery<ProductWithVariations[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('in_stock', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data ?? []).map(mapProduct);
    },
  });
}

export function useAllProducts() {
  return useQuery<ProductWithVariations[]>({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('in_stock', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data ?? []).map(mapProduct);
    },
  });
}

export function useFeaturedProducts() {
  return useQuery<ProductWithVariations[]>({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .order('in_stock', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data ?? []).map(mapProduct);
    },
  });
}

export function useProduct(id: string) {
  return useQuery<ProductWithVariations | null>({
    queryKey: ['products', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data ? mapProduct(data) : null;
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
        .select('*');

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query
        .order('in_stock', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapProduct);
    },
    enabled: category !== undefined,
  });
}