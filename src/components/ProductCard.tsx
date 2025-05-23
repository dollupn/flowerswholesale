
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log(`Added ${product.name} to cart`);
    // Add to cart logic here
  };

  return (
    <Card className="group hover-lift luxury-shadow border-vanilla-beige/30 bg-vanilla-cream overflow-hidden">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-gradient-to-br from-vanilla-cream to-vanilla-beige/20">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
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
              Rs {product.price}
            </span>
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="bg-vanilla-brown hover:bg-vanilla-brown/90 text-vanilla-cream"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
