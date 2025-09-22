const handlePlaceOrder = async () => {
  if (!user) return;
  if (!isFormValid) return;

  setIsProcessing(true);

  try {
    const shippingFeeCents = getShippingFee();
    const grandTotalCents = totalPrice + shippingFeeCents;

    // Build a payload you might store/show (not sent to the email function)
    const orderPayload = {
      customer: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: user.email || '',
        address: {
          line1: formData.address,
          city: formData.city,
          postalCode: formData.postalCode || '',
          country: formData.country,
        },
        note: formData.specialRequest,
      },
      shipping: {
        method: formData.shippingMethod,
        fee: shippingFeeCents,
      },
      payment: {
        method: formData.paymentMethod,
      },
      cart: cartItems.map((item) => {
        const unitPrice = item.variation_price ?? item.product.price;
        return {
          sku: item.variation_sku ?? item.product_id,
          name: item.product.name,
          qty: item.quantity,
          unitPrice: unitPrice / 100,
          variation: item.variation_label ?? undefined,
        };
      }),
      totals: {
        subtotal: totalPrice / 100,
        shipping: shippingFeeCents / 100,
        grandTotal: grandTotalCents / 100,
      },
      currency: 'MUR',
    };

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
