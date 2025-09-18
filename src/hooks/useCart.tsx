import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';

type CartItem = Database['public']['Tables']['cart_items']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

interface CartItemWithProduct extends CartItem {
  product: Product;
}

interface CartItemVariationInput {
  sku: string;
  label: string;
  price: number;
}

export function useCart() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data as CartItemWithProduct[];
    },
    enabled: !!user,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity = 1,
      variation,
    }: {
      productId: string;
      quantity?: number;
      variation?: CartItemVariationInput;
    }) => {
      if (!user) throw new Error('User not authenticated');

      // Check if item already exists in cart
      let existingItemQuery = supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (variation?.sku) {
        existingItemQuery = existingItemQuery.eq('variation_sku', variation.sku);
      } else {
        existingItemQuery = existingItemQuery.is('variation_sku', null);
      }

      const { data: existingItem } = await existingItemQuery.maybeSingle();

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (error) throw error;
      } else {
        // Insert new item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity,
            variation_label: variation?.label ?? null,
            variation_sku: variation?.sku ?? null,
            variation_price: variation?.price ?? null,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      toast({
        title: "Added to Cart",
        description: "Product has been added to your cart.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add product to cart.",
        variant: "destructive",
      });
      console.error('Add to cart error:', error);
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (quantity <= 0) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', itemId);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update cart item.",
        variant: "destructive",
      });
      console.error('Update cart error:', error);
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
      toast({
        title: "Removed from Cart",
        description: "Product has been removed from your cart.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove product from cart.",
        variant: "destructive",
      });
      console.error('Remove from cart error:', error);
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to clear cart.",
        variant: "destructive",
      });
      console.error('Clear cart error:', error);
    },
  });

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => {
    const unitPrice = item.variation_price ?? item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  return {
    cartItems,
    isLoading,
    totalItems,
    totalPrice,
    addToCart: addToCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    isUpdatingCart: updateQuantityMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending,
  };
}