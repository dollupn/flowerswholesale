import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderConfirmationRequest {
  orderData: {
    id: string;
    customer: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      variation?: string;
    }>;
    shipping: {
      method: string;
      fee: number;
      address: {
        line1: string;
        city: string;
        postalCode?: string;
        country: string;
      };
    };
    payment: {
      method: string;
    };
    totals: {
      subtotal: number;
      shipping: number;
      grandTotal: number;
    };
  };
}

const getShippingMethodName = (method: string) => {
  switch (method) {
    case 'postage':
      return 'Postage';
    case 'home_delivery':
      return 'Home Delivery';
    case 'pickup_pereybere':
      return 'Pickup at Pereybere';
    default:
      return method;
  }
};

const getPaymentMethodName = (method: string) => {
  switch (method) {
    case 'juice':
      return 'Juice (Bank Transfer/QR)';
    case 'cod':
      return 'Cash on Delivery';
    default:
      return method;
  }
};

const generateEmailHTML = (orderData: OrderConfirmationRequest['orderData']) => {
  const itemsHtml = orderData.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong>
        ${item.variation ? `<br><small style="color: #666;">${item.variation}</small>` : ''}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">Rs ${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Vanilluxe</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f9f7f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #8B4513, #A0522D); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Vanilluxe</h1>
          <p style="margin: 5px 0 0 0; font-size: 16px; opacity: 0.9;">Premium Vanilla Products</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px;">
          <h2 style="color: #8B4513; margin-top: 0;">Order Confirmation</h2>
          
          <p>Dear ${orderData.customer.firstName} ${orderData.customer.lastName},</p>
          
          <p>Thank you for your order! We're excited to prepare your premium vanilla products for you.</p>
          
          <div style="background-color: #f9f7f4; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #8B4513;">Order Details</h3>
            <p style="margin: 5px 0;"><strong>Order ID:</strong> #${orderData.id.slice(-8)}</p>
            <p style="margin: 5px 0;"><strong>Customer:</strong> ${orderData.customer.firstName} ${orderData.customer.lastName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${orderData.customer.email}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${orderData.customer.phone}</p>
          </div>

          <!-- Order Items -->
          <h3 style="color: #8B4513;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 12px 8px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
                <th style="padding: 12px 8px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                <th style="padding: 12px 8px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Shipping & Payment Info -->
          <div style="background-color: #f9f7f4; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #8B4513;">Shipping & Payment</h3>
            <p style="margin: 5px 0;"><strong>Shipping Method:</strong> ${getShippingMethodName(orderData.shipping.method)}</p>
            <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${getPaymentMethodName(orderData.payment.method)}</p>
            <p style="margin: 5px 0;"><strong>Delivery Address:</strong></p>
            <p style="margin: 5px 0 5px 20px;">
              ${orderData.shipping.address.line1}<br>
              ${orderData.shipping.address.city}${orderData.shipping.address.postalCode ? ', ' + orderData.shipping.address.postalCode : ''}<br>
              ${orderData.shipping.address.country}
            </p>
          </div>

          <!-- Order Total -->
          <div style="background-color: #8B4513; color: white; padding: 20px; margin: 20px 0; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span>Subtotal:</span>
              <span>Rs ${orderData.totals.subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
              <span>Shipping:</span>
              <span>Rs ${orderData.totals.shipping.toFixed(2)}</span>
            </div>
            <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.3); margin: 15px 0;">
            <div style="display: flex; justify-content: space-between; font-size: 18px; font-weight: bold;">
              <span>Total:</span>
              <span>Rs ${orderData.totals.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <!-- Payment Instructions -->
          ${orderData.payment.method === 'juice' ? `
          <div style="background-color: #e8f5e8; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #4caf50;">
            <h3 style="margin-top: 0; color: #2e7d32;">Payment Instructions</h3>
            <p>Please complete your payment via Juice using bank transfer or QR code. You will receive payment instructions separately.</p>
          </div>
          ` : ''}

          <p>We will process your order and keep you updated on the delivery status.</p>
          
          <p>If you have any questions about your order, please don't hesitate to contact us.</p>
          
          <p style="margin-top: 30px;">Best regards,<br>
          <strong>The Vanilluxe Team</strong></p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            This is an automated message. Please do not reply to this email.
          </p>
          <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
            © 2024 Vanilluxe - Premium Vanilla Products
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderData }: OrderConfirmationRequest = await req.json();

    if (!orderData) {
      throw new Error('Order data is required');
    }

    console.log('Sending order confirmation email for order:', orderData.id);

    const emailHtml = generateEmailHTML(orderData);
    
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "Vanilluxe <info@vanilluxe.store>",
      to: [orderData.customer.email],
      subject: `Order Confirmation - Vanilluxe #${orderData.id.slice(-8)}`,
      html: emailHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Order confirmation email sent successfully",
      emailId: emailResponse.data?.id
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-order-confirmation function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);