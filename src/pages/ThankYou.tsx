import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Package, Phone, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface OrderDetails {
  id: string;
  total_amount: number;
  shipping_address: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    specialRequest?: string;
    shippingMethod: string;
    paymentMethod: string;
  };
  created_at: string;
}

export default function ThankYou() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order');
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder({ ...data, shipping_address: data.shipping_address as OrderDetails['shipping_address'] });
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (priceInCents: number) => {
    return `Rs ${(priceInCents / 100).toFixed(2)}`;
  };

  const getShippingMethodDisplay = (method: string) => {
    switch (method) {
      case 'postage':
        return 'Free Postage';
      case 'home_delivery':
        return 'Free Home Delivery';
      case 'pickup_pereybere':
        return 'Pickup at Pereybere';
      default:
        return method;
    }
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case 'juice':
        return 'Juice (Bank Transfer / QR)';
      case 'cod':
        return 'Cash on Delivery (COD)';
      default:
        return method;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-vanilla-cream to-vanilla-beige/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-vanilla-brown"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-vanilla-cream to-vanilla-beige/30 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <p className="text-vanilla-brown">Order not found</p>
            <Link to="/">
              <Button className="mt-4 bg-vanilla-brown hover:bg-vanilla-brown/90 text-vanilla-cream">
                Return to Shop
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-vanilla-cream to-vanilla-beige/30 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-serif font-bold text-vanilla-brown mb-2">
              Order Confirmed!
            </h1>
            <p className="text-vanilla-brown/70">
              Thank you for your order. We'll process it shortly.
            </p>
          </div>

          {/* Order Details */}
          <Card className="border-vanilla-beige/30 bg-vanilla-cream mb-6">
            <CardHeader>
              <CardTitle className="text-vanilla-brown flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order #{order.id.slice(-8)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-vanilla-brown/70">Order Date:</span>
                  <p className="font-semibold text-vanilla-brown">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-vanilla-brown/70">Total Amount:</span>
                  <p className="font-semibold text-vanilla-brown">
                    {formatPrice(order.total_amount)}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Shipping Information */}
              <div>
                <h3 className="font-semibold text-vanilla-brown mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Shipping Details
                </h3>
                <div className="bg-vanilla-beige/20 p-3 rounded-md text-sm">
                  <p className="font-semibold">
                    {order.shipping_address.firstName} {order.shipping_address.lastName}
                  </p>
                  <p>{order.shipping_address.address}</p>
                  <p>
                    {order.shipping_address.city}
                    {order.shipping_address.postalCode && `, ${order.shipping_address.postalCode}`}
                  </p>
                  <p>{order.shipping_address.country}</p>
                  
                  <div className="mt-2 pt-2 border-t border-vanilla-beige/30">
                    <p><strong>Method:</strong> {getShippingMethodDisplay(order.shipping_address.shippingMethod)}</p>
                  </div>
                </div>
              </div>

              {/* Contact & Payment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-vanilla-brown mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact
                  </h3>
                  <div className="bg-vanilla-beige/20 p-3 rounded-md text-sm">
                    <p>{order.shipping_address.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-vanilla-brown mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment
                  </h3>
                  <div className="bg-vanilla-beige/20 p-3 rounded-md text-sm">
                    <p>{getPaymentMethodDisplay(order.shipping_address.paymentMethod)}</p>
                  </div>
                </div>
              </div>

              {/* Special Request */}
              {order.shipping_address.specialRequest && (
                <div>
                  <h3 className="font-semibold text-vanilla-brown mb-2">Special Request</h3>
                  <div className="bg-vanilla-beige/20 p-3 rounded-md text-sm">
                    <p>{order.shipping_address.specialRequest}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="border-vanilla-beige/30 bg-vanilla-cream">
            <CardHeader>
              <CardTitle className="text-vanilla-brown">What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-vanilla-brown/80">
              <p>• You'll receive an email confirmation shortly</p>
              <p>• We'll contact you at {order.shipping_address.phone} if needed</p>
              {order.shipping_address.shippingMethod === 'pickup_pereybere' && (
                <p>• We'll notify you when your order is ready for pickup at Pereybere</p>
              )}
              {order.shipping_address.shippingMethod === 'home_delivery' && (
                <p>• We'll arrange delivery to your address</p>
              )}
              {order.shipping_address.shippingMethod === 'postage' && (
                <p>• Your order will be sent via post</p>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link to="/orders" className="flex-1">
              <Button variant="outline" className="w-full border-vanilla-brown text-vanilla-brown hover:bg-vanilla-brown hover:text-vanilla-cream">
                View My Orders
              </Button>
            </Link>
            <Link to="/shop" className="flex-1">
              <Button className="w-full bg-vanilla-brown hover:bg-vanilla-brown/90 text-vanilla-cream">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}