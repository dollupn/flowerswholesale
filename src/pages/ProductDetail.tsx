
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowUp, ShoppingCart, Star, Truck, Shield } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProduct, useProductsByCategory } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import { parseProductVariations, ProductVariation } from "@/lib/product";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id || '');
  const { data: categoryProducts = [] } = useProductsByCategory(product?.category);
  const { user } = useAuth();
  const { toast } = useToast();
  const { addToCart, isAddingToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariationSku, setSelectedVariationSku] = useState<string | null>(null);

  const variations = useMemo(
    () => (product ? parseProductVariations(product.variations) : null),
    [product]
  );
  const selectedVariation = variations?.find(variation => variation.sku === selectedVariationSku) ?? null;
  const displayPrice = selectedVariation ? selectedVariation.price : product?.price ?? 0;

  const relatedProducts = categoryProducts
    .filter(p => p.id !== product?.id)
    .slice(0, 3);

  useEffect(() => {
    if (!product) {
      setSelectedVariationSku(null);
      return;
    }

    if (variations && variations.length > 0) {
      setSelectedVariationSku(prev =>
        prev && variations.some(variation => variation.sku === prev)
          ? prev
          : variations[0].sku
      );
    } else {
      setSelectedVariationSku(null);
    }
  }, [product, variations]);

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    if (!product) return;

    if (variations && variations.length > 0) {
      if (!selectedVariation) {
        toast({
          title: "Select a Variation",
          description: "Please choose a quantity option before adding to your cart.",
          variant: "destructive",
        });
        return;
      }

    addToCart({
      productId: product.id,
      quantity,
    });
      return;
    }

    addToCart({ productId: product.id, quantity });
  };

  const handleWhatsAppInquiry = () => {
    if (!product) return;
    const variationMessage = selectedVariation
      ? ` (${selectedVariation.label} - SKU ${selectedVariation.sku})`
      : '';
    const message = `Hi! I'm interested in ${product.name}${variationMessage}. Can you tell me more about it?`;
    window.open(`https://wa.me/23052345678?text=${encodeURIComponent(message)}`, "_blank");
  };

  const formatPrice = (priceInCents: number) => {
    return `Rs ${(priceInCents / 100).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-vanilla-cream">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-vanilla-brown"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-vanilla-cream">
          <div className="text-center">
            <h1 className="text-2xl font-serif font-bold text-vanilla-brown mb-4">
              Product Not Found
            </h1>
            <Button asChild>
              <Link to="/shop">Back to Shop</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      
      <div className="min-h-screen bg-vanilla-cream">
        {/* Breadcrumb */}
        <div className="py-4 border-b border-vanilla-beige/30">
          <div className="container mx-auto px-4">
            <nav className="text-sm text-vanilla-brown/70">
              <Link to="/" className="hover:text-vanilla-brown">Home</Link>
              <span className="mx-2">/</span>
              <Link to="/shop" className="hover:text-vanilla-brown">Shop</Link>
              <span className="mx-2">/</span>
              <span className="text-vanilla-brown">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div>
              <div className="mb-4">
                <img
                  src={product.gallery?.[selectedImage] || product.image_url || 'https://images.unsplash.com/photo-1586049332816-6de5d1e8e38b?w=500'}
                  alt={product.name}
                  className="w-full h-[26rem] md:h-[32rem] object-cover rounded-xl luxury-shadow"
                />
              </div>
              {product.gallery && product.gallery.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.gallery.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-vanilla-brown' : 'border-vanilla-beige/30'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <Badge variant="secondary" className="bg-vanilla-beige text-vanilla-brown">
                  {product.category}
                </Badge>
                {product.in_stock && (
                  <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">
                    In Stock
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-vanilla-brown mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center mb-6">
                <div className="flex text-vanilla-yellow mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <span className="text-vanilla-brown/70">(4.9/5 from 127 reviews)</span>
              </div>

              <p className="text-vanilla-brown/80 text-lg mb-6 leading-relaxed">
                {product.description}
              </p>

              <div className="bg-vanilla-beige/20 p-6 rounded-xl mb-6">
                <h3 className="font-serif font-semibold text-vanilla-brown mb-4">Product Details</h3>
                <div className="space-y-2 text-sm">
                  {product.origin && (
                    <div className="flex justify-between">
                      <span className="text-vanilla-brown/70">Origin:</span>
                      <span className="text-vanilla-brown">{product.origin}</span>
                    </div>
                  )}
                  {product.grade && (
                    <div className="flex justify-between">
                      <span className="text-vanilla-brown/70">Grade:</span>
                      <span className="text-vanilla-brown">{product.grade}</span>
                    </div>
                  )}
                  {product.processing && (
                    <div className="flex justify-between">
                      <span className="text-vanilla-brown/70">Processing:</span>
                      <span className="text-vanilla-brown">{product.processing}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-serif font-semibold text-vanilla-brown mb-3">Perfect For:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.uses?.map((use, index) => (
                    <Badge key={index} variant="outline" className="border-vanilla-brown/30 text-vanilla-brown">
                      {use}
                    </Badge>
                  )) || (
                    <p className="text-vanilla-brown/70 text-sm">No specific uses listed</p>
                  )}
                </div>
              </div>

              {variations && variations.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-serif font-semibold text-vanilla-brown mb-3">Select Quantity</h3>
                  <RadioGroup
                    value={selectedVariationSku ?? ''}
                    onValueChange={value => setSelectedVariationSku(value)}
                    className="space-y-3"
                  >
                    {variations.map((variation: ProductVariation) => (
                      <div
                        key={variation.sku}
                        className="flex items-start gap-3 border border-vanilla-beige/60 rounded-lg p-3 hover:border-vanilla-brown transition-colors"
                      >
                        <RadioGroupItem
                          value={variation.sku}
                          id={`variation-${variation.sku}`}
                          className="mt-1"
                        />
                        <Label htmlFor={`variation-${variation.sku}`} className="flex-1 cursor-pointer">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                              <p className="font-medium text-vanilla-brown">{variation.label}</p>
                              {typeof variation.quantity === 'number' && (
                                <p className="text-sm text-vanilla-brown/70">{variation.quantity} beans</p>
                              )}
                              <p className="text-xs text-vanilla-brown/60">SKU: {variation.sku}</p>
                            </div>
                            <div className="text-right font-semibold text-vanilla-brown">
                              {formatPrice(variation.price)}
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              <div className="border-t border-vanilla-beige/30 pt-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-bold text-vanilla-brown">
                    {formatPrice(displayPrice)}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-vanilla-brown/70">Qty:</span>
                    <div className="flex items-center border border-vanilla-beige rounded-md">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 hover:bg-vanilla-beige/20"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 border-x border-vanilla-beige">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-1 hover:bg-vanilla-beige/20"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1 bg-vanilla-brown hover:bg-vanilla-brown/90 text-vanilla-cream"
                    size="lg"
                    disabled={isAddingToCart}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                  </Button>
                  <Button
                    onClick={handleWhatsAppInquiry}
                    variant="outline"
                    className="border-vanilla-brown text-vanilla-brown hover:bg-vanilla-brown/5"
                    size="lg"
                  >
                    WhatsApp Inquiry
                  </Button>
                </div>

                <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-vanilla-brown/70">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4" />
                    <span>Free island delivery</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>Quality guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How to Use Section */}
          <Card className="mt-12 luxury-shadow border-vanilla-beige/30 bg-vanilla-cream">
            <CardContent className="p-8">
              <h2 className="text-2xl font-serif font-bold text-vanilla-brown mb-4">
                How to Use & Storage
              </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div>
                   <h3 className="font-semibold text-vanilla-brown mb-3">Storage Instructions</h3>
                   <p className="text-vanilla-brown/80">{product.storage || 'Store in a cool, dry place'}</p>
                 </div>
                 <div>
                   <h3 className="font-semibold text-vanilla-brown mb-3">Best Uses</h3>
                   <ul className="text-vanilla-brown/80 space-y-1">
                     {product.uses?.map((use, index) => (
                       <li key={index}>• {use}</li>
                     )) || (
                       <li>Perfect for various culinary applications</li>
                     )}
                   </ul>
                 </div>
               </div>
            </CardContent>
          </Card>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-serif font-bold text-vanilla-brown mb-8 text-center">
                Goes Well With...
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetail;
