
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { Database } from "@/integrations/supabase/types";
import { getProductBasePrice, parseProductVariations } from "@/lib/product";

type Product = Database['public']['Tables']['products']['Row'];

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { user } = useAuth();
  const { addToCart, isAddingToCart } = useCart();
  const variations = parseProductVariations(product.variations);
  const hasVariations = !!variations && variations.length > 0;
  const basePrice = getProductBasePrice(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    if (hasVariations) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Could redirect to auth page or show a message
      return;
    }

    addToCart({ productId: product.id });
  };

  const formatPrice = (priceInCents: number) => {
    return `Rs ${(priceInCents / 100).toFixed(2)}`;
  };

  return (
    <Card className="group hover-lift luxury-shadow border-vanilla-beige/30 bg-vanilla-cream overflow-hidden">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-vanilla-cream to-vanilla-beige/20">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1586049332816-6de5d1e8e38b?w=500'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.featured && (
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-vanilla-yellow text-vanilla-brown">
                Featured
              </Badge>
            </div>
          )}
          {product.label && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                {product.label}
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="mb-2">
            <span className="text-xs text-vanilla-brown/60 uppercase tracking-wider">
              {product.category}
            </span>
          </div>
          <h3 className="font-serif font-semibold text-lg text-vanilla-brown mb-2 group-hover:text-vanilla-brown/80 transition-colors">
            {product.name}
          </h3>
          <p className="text-vanilla-brown/70 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-vanilla-brown">
              {hasVariations ? `From ${formatPrice(basePrice)}` : formatPrice(product.price)}
            </span>
            <Button
              onClick={handleAddToCart}
              size="sm"
              disabled={!hasVariations && (!user || isAddingToCart)}
              className="bg-vanilla-brown hover:bg-vanilla-brown/90 text-vanilla-cream disabled:opacity-50"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              {hasVariations ? "View Options" : isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
