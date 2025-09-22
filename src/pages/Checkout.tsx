import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { AuthGuard } from '@/components/AuthGuard';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { InternationalPhoneInput } from '@/components/ui/phone-input';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  specialRequest: string;
  shippingMethod: 'postage' | 'home_delivery' | 'pickup_pereybere';
  paymentMethod: 'juice' | 'cod';
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  specialRequest?: string;
}

function CheckoutPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Mauritius',
    specialRequest: '',
    shippingMethod: 'postage',
    paymentMethod: 'juice',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Load form data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('checkout-form');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData((prev) => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to parse saved form data:', e);
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('checkout-form', JSON.stringify(formData));
  }, [formData]);

  const formatPrice = (priceInCents: number) => `Rs ${(priceInCents / 100).toFixed(2)}`;

  const validatePhone = (phone: string): boolean => {
    return phone && phone.trim().length > 0;
  };

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Enter a valid phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (formData.specialRequest.length > 240) {
      newErrors.specialRequest = 'Special request must be 240 characters or less';
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    setIsFormValid(isValid);
    return isValid;
  }, [formData]);

  // Update form validity when form data changes
  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleInputChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const handleShippingChange = (value: FormData['shippingMethod']) => {
    let newPaymentMethod = formData.paymentMethod;

    // If postage is selected, force juice payment
    if (value === 'postage') {
      newPaymentMethod = 'juice';
    } else if (
      (value === 'home_delivery' || value === 'pickup_pereybere') &&
      !getAvailablePaymentMethods().includes(formData.paymentMethod)
    ) {
      newPaymentMethod = 'juice';
    }

    setFormData((prev) => ({
      ...prev,
      shippingMethod: value,
      paymentMethod: newPaymentMethod,
    }));
  };

  const getShippingFee = (): number => {
    const isAbove1000 = totalPrice >= 100000; // Rs 1000 = 100000 cents

    switch (formData.shippingMethod) {
      case 'postage':
        return isAbove1000 ? 0 : 6000; // Rs 60
      case 'home_delivery':
        return isAbove1000 ? 0 : 15000; // Rs 150
      case 'pickup_pereybere':
        return 0;
      default:
        return 0;
    }
  };

  const getAvailablePaymentMethods = () => {
    if (formData.shippingMethod === 'postage') {
      return ['juice'];
    }
    return ['juice', 'cod'];
  };

  // ===========================
  // PLACE ORDER (updated)
  // ===========================
  const handlePlaceOrder = async () => {
    if (!user) return;
    if (!isFormValid) return;

    setIsProcessing(true);

    try {
      const shippingFeeCents = getShippingFee();
      const grandTotalCents = totalPrice + shippingFeeCents;

      // 1) Create order in DB
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: grandTotalCents,
          shipping_address: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
            specialRequest: formData.specialRequest,
            shippingMethod: formData.shippingMethod,
            paymentMethod: formData.paymentMethod,
          },
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2) Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_per_item: item.variation_price ?? item.product.price,
        variation_sku: item.variation_sku,
        variation_label: item.variation_label,
        variation_price: item.variation_price,
      }));
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // 3) Clear cart + local state
      await clearCart();
      localStorage.removeItem('checkout-form');

      // 4) Success UI immediately
      toast({
        title: 'Order Placed Successfully!',
        description: `Your order #${order.id.slice(-8)} has been placed.`,
      });
      navigate(`/thank-you?order=${order.id}`);

      // 5) Fire-and-forget email AFTER navigate, with payload matching the Edge Function
      if (user.email) {
        const emailPayload = {
          orderData: {
            id: order.id,
            customer: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: user.email,
              phone: formData.phone,
            },
            items: cartItems.map((item) => {
              const unitPrice = item.variation_price ?? item.product.price;
              return {
                name: item.product?.name ?? 'Product',
                quantity: item.quantity,
                // unit price in MUR, not line total
                price: unitPrice / 100,
                variant: item.variation_label ?? undefined,
              };
            }),
            // top-level totals expected by the function
            subtotal: totalPrice / 100,
            shippingCost: shippingFeeCents / 100,
            total: grandTotalCents / 100,
            shippingMethod: formData.shippingMethod,
            paymentMethod: formData.paymentMethod,
            address: {
              line1: formData.address,
              city: formData.city,
              postalCode: formData.postalCode || undefined,
              country: formData.country,
            },
          },
        };

        // do NOT await → non-blocking
        supabase.functions
          .invoke('send-order-confirmation', { body: emailPayload })
          .catch((e) => console.error('Email send failed (non-blocking):', e));
      } else {
        console.warn('User email not available; skipping order confirmation email.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Order Failed',
        description: 'There was an error processing your order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-vanilla-cream to-vanilla-beige/30 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-serif font-bold text-vanilla-brown mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Forms */}
              <div className="space-y-6">
                {/* Shipping Information */}
                <Card className="border-vanilla-beige/30 bg-vanilla-cream">
                  <CardHeader>
                    <CardTitle className="text-vanilla-brown">Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className={errors.firstName ? 'border-red-500' : ''}
                        />
                        {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className={errors.lastName ? 'border-red-500' : ''}
                        />
                        {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <InternationalPhoneInput
                        value={formData.phone}
                        onChange={(value) => handleInputChange('phone', value || '')}
                        placeholder="Enter phone number"
                        defaultCountry="MU"
                        className={errors.phone ? 'border-red-500' : ''}
                      />
                      {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows={3}
                        className={errors.address ? 'border-red-500' : ''}
                      />
                      {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className={errors.city ? 'border-red-500' : ''}
                        />
                        {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mauritius">Mauritius</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="specialRequest">Special Request</Label>
                      <Textarea
                        id="specialRequest"
                        value={formData.specialRequest}
                        onChange={(e) => handleInputChange('specialRequest', e.target.value)}
                        placeholder="Leave at reception, call on arrival, gift note, etc."
                        rows={3}
                        maxLength={240}
                        className={errors.specialRequest ? 'border-red-500' : ''}
                      />
                      <div className="flex justify-between items-center mt-1">
                        {errors.specialRequest && <p className="text-sm text-red-500">{errors.specialRequest}</p>}
                        <p className="text-sm text-vanilla-brown/60 ml-auto">{formData.specialRequest.length}/240</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Options */}
                <Card className="border-vanilla-beige/30 bg-vanilla-cream">
                  <CardHeader>
                    <CardTitle className="text-vanilla-brown">Shipping</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={formData.shippingMethod} onValueChange={handleShippingChange} className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="postage" id="postage" />
                        <Label htmlFor="postage" className="flex-1">
                          <div className="flex justify-between">
                            <span>{totalPrice >= 100000 ? 'Free Postage' : 'Postage'}</span>
                            <span className="font-semibold">{totalPrice >= 100000 ? 'Rs 0' : 'Rs 60'}</span>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="home_delivery" id="home_delivery" />
                        <Label htmlFor="home_delivery" className="flex-1">
                          <div className="flex justify-between">
                            <span>{totalPrice >= 100000 ? 'Free Home Delivery' : 'Home Delivery'}</span>
                            <span className="font-semibold">{totalPrice >= 100000 ? 'Rs 0' : 'Rs 150'}</span>
                          </div>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="pickup_pereybere" id="pickup_pereybere" />
                        <Label htmlFor="pickup_pereybere" className="flex-1">
                          <div className="flex justify-between">
                            <span>Pickup at Pereybere</span>
                            <span className="font-semibold">Rs 0</span>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card className="border-vanilla-beige/30 bg-vanilla-cream">
                  <CardHeader>
                    <CardTitle className="text-vanilla-brown">Payment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value: FormData['paymentMethod']) =>
                        setFormData((prev) => ({ ...prev, paymentMethod: value }))
                      }
                      className="space-y-4"
                    >
                      {getAvailablePaymentMethods().includes('juice') && (
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="juice" id="juice" />
                          <Label htmlFor="juice">Juice (bank transfer / QR)</Label>
                        </div>
                      )}

                      {getAvailablePaymentMethods().includes('cod') && (
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cod" id="cod" />
                          <Label htmlFor="cod">Cash on Delivery (COD)</Label>
                        </div>
                      )}
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Order Summary */}
              <Card className="border-vanilla-beige/30 bg-vanilla-cream lg:sticky lg:top-4 h-fit">
                <CardHeader>
                  <CardTitle className="text-vanilla-brown">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => {
                    const unitPrice = item.variation_price ?? item.product.price;

                    return (
                      <div key={item.id} className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-vanilla-brown">{item.product.name}</p>
                          {item.variation_label && (
                            <p className="text-sm text-vanilla-brown/70">
                              {item.variation_label}
                              {item.variation_sku && (
                                <span className="ml-1 text-xs text-vanilla-brown/60">• SKU: {item.variation_sku}</span>
                              )}
                            </p>
                          )}
                          <p className="text-sm text-vanilla-brown/60">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-vanilla-brown">{formatPrice(unitPrice * item.quantity)}</p>
                          {item.variation_price && (
                            <p className="text-xs text-vanilla-brown/60">{formatPrice(unitPrice)} each</p>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-vanilla-brown/70">Subtotal</span>
                    <span className="font-semibold text-vanilla-brown">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-vanilla-brown/70">Shipping</span>
                    <span className="font-semibold text-vanilla-brown">{formatPrice(getShippingFee())}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-vanilla-brown">Total</span>
                    <span className="font-bold text-vanilla-brown">
                      {formatPrice(totalPrice + getShippingFee())}
                    </span>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || !isFormValid}
                    className="w-full bg-vanilla-brown hover:bg-vanilla-brown/90 text-vanilla-cream mt-6"
                    size="lg"
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Explicit default export to satisfy Vite/Rollup
function Checkout() {
  return (
    <AuthGuard>
      <CheckoutPage />
    </AuthGuard>
  );
}

export default Checkout;
export { CheckoutPage };
