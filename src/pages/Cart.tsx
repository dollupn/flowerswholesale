import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function CartPage() {
  const { cartItems, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart, isUpdatingCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (priceInCents: number) => {
    return `Rs ${(priceInCents / 100).toFixed(2)}`;
  };

  const handleCheckout = () => {
    // TODO: Implement checkout functionality
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-vanilla-cream via-white to-vanilla-beige">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="w-24 h-24 mx-auto text-vanilla-brown/50 mb-6" />
            <h1 className="text-3xl font-serif font-bold text-vanilla-brown mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-vanilla-brown/70 mb-8">
              Start shopping to add some delicious vanilla products to your cart!
            </p>
            <Link to="/shop">
              <Button size="lg" className="bg-vanilla-brown hover:bg-vanilla-brown/90 text-vanilla-cream">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-vanilla-cream via-white to-vanilla-beige">
      <Header />
      <div className="container mx-auto px-4 py-12 pb-24 md:pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-vanilla-brown mb-8">
            Shopping Cart ({totalItems} items)
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const unitPrice = item.variation_price ?? item.product.price;

                return (
                  <Card key={item.id} className="border-vanilla-beige/30 bg-vanilla-cream">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3 md:space-x-4">
                        <img
                          src={item.product.image_url || 'https://images.unsplash.com/photo-1586049332816-6de5d1e8e38b?w=200'}
                          alt={item.product.name}
                          className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <Link to={`/product/${item.product.id}`}>
                            <h3 className="font-serif font-semibold text-base md:text-lg text-vanilla-brown hover:text-vanilla-brown/80 truncate">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-vanilla-brown/60 text-xs md:text-sm mb-1 md:mb-2">
                            {item.product.category}
                          </p>
                          {item.variation_label && (
                            <p className="text-vanilla-brown/70 text-xs md:text-sm mb-1 md:mb-2">
                              {item.variation_label}
                              {item.variation_sku && (
                                <span className="ml-1 text-vanilla-brown/50">• SKU: {item.variation_sku}</span>
                              )}
                            </p>
                          )}
                          <p className="text-vanilla-brown font-semibold text-sm md:text-base">
                            {formatPrice(unitPrice)}
                          </p>

                          {/* Mobile: Quantity controls below product info */}
                          <div className="flex items-center justify-between mt-3 md:hidden">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity({ itemId: item.id, quantity: item.quantity - 1 })}
                              disabled={isUpdatingCart}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity({ itemId: item.id, quantity: item.quantity + 1 })}
                              disabled={isUpdatingCart}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            disabled={isUpdatingCart}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Desktop: Quantity controls and delete on the right */}
                      <div className="hidden md:flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity({ itemId: item.id, quantity: item.quantity - 1 })}
                          disabled={isUpdatingCart}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity({ itemId: item.id, quantity: item.quantity + 1 })}
                          disabled={isUpdatingCart}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        disabled={isUpdatingCart}
                        className="hidden md:flex text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-vanilla-beige/30 bg-vanilla-cream sticky top-4">
                <CardHeader>
                  <CardTitle className="text-vanilla-brown">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-vanilla-brown/70">Subtotal ({totalItems} items)</span>
                    <span className="font-semibold text-vanilla-brown">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="text-vanilla-brown/70 font-medium">Shipping Options:</div>
                    {totalPrice >= 100000 ? (
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>• Free Postage</span>
                          <span className="text-green-600">Free</span>
                        </div>
                        <div className="flex justify-between">
                          <span>• Free Home Delivery</span>
                          <span className="text-green-600">Free</span>
                        </div>
                        <div className="flex justify-between">
                          <span>• Pickup at Pereybere</span>
                          <span className="text-green-600">Free</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>• Postage</span>
                          <span>Rs 60.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>• Home Delivery</span>
                          <span>Rs 150.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>• Pickup at Pereybere</span>
                          <span className="text-green-600">Free</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-vanilla-brown">Total</span>
                    <span className="font-bold text-vanilla-brown">{formatPrice(totalPrice)}</span>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-vanilla-brown hover:bg-vanilla-brown/90 text-vanilla-cream"
                      size="lg"
                    >
                      Proceed to Checkout
                    </Button>
                    <Link to="/shop" className="block">
                      <Button variant="outline" className="w-full" size="lg">
                        Continue Shopping
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => clearCart()}
                      className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      Clear Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function Cart() {
  return (
    <AuthGuard>
      <CartPage />
    </AuthGuard>
  );
}