// supabase/functions/send-order-confirmation/index.ts
// Deno Edge Function: sends order confirmation email via Zoho (SMTP, denomailer)

import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

/* ------------------------- C O R S   S E T U P ------------------------- */

const ALLOWED_ORIGINS = [
  "https://vanilluxe.store",
  "http://localhost:5173", // dev
];

const corsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin ?? "")
    ? (origin as string)
    : "https://vanilluxe.store",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Vary": "Origin",
});

/* ---------------------------- E N V   (tmp) ---------------------------- */
/*  You asked to keep fallbacks for now to ensure it works even if env vars
    are not present. Remove the fallbacks later for security.              */

const SMTP_HOST = Deno.env.get("ZOHO_SMTP_HOST") ?? "smtp.zoho.com";
const SMTP_PORT = Number(Deno.env.get("ZOHO_SMTP_PORT") ?? "587"); // 587 STARTTLS (often faster than 465)
const SMTP_SECURE = (Deno.env.get("ZOHO_SMTP_SECURE") ?? "false") === "true"; // false for 587, true for 465

const SMTP_USER = Deno.env.get("ZOHO_SMTP_USER") ?? "info@vanilluxe.store";
const SMTP_PASS = Deno.env.get("ZOHO_SMTP_PASSWORD") ?? "gTeUN6GxgRT8";
const FROM_EMAIL = Deno.env.get("ZOHO_FROM_EMAIL") ?? "info@vanilluxe.store";

/* ------------------------------ T Y P E S ------------------------------ */

type OrderItem = {
  name: string;
  qty: number;
  price: number;          // per unit
  subtitle?: string;
};

type Address = {
  line1?: string;
  line2?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
};

type OrderData = {
  id: string;
  customer: { name: string; email: string; phone?: string };
  items: OrderItem[];
  shippingMethod: string;  // "Postage" | "Delivery" | "Pickup"
  paymentMethod: string;   // "Juice" | "COD" | etc.
  address?: Address;
  subtotal: number;
  shippingCost: number;
  total: number;
  createdAt?: string | Date;
};

/* ------------------------------ U T I L S ------------------------------ */

const mur = (n: number) => `Rs ${n.toFixed(2)}`;
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* --------------------------- E M A I L   H T M L --------------------------- */

function generateEmailHTML(order: OrderData): string {
  const last8 = order.id.slice(-8);
  const addr = order.address ?? {};
  const addressHtml = `
    ${addr.line1 ?? ""}${addr.line1 && addr.line2 ? "<br/>" : ""}${addr.line2 ?? ""}
    ${addr.city ? `<br/>${addr.city}` : ""}
    ${addr.region ? `<br/>${addr.region}` : ""}
    ${addr.postalCode ? `<br/>${addr.postalCode}` : ""}
    ${addr.country ? `<br/>${addr.country}` : ""}
  `.trim();

  const itemsRows = order.items.map(it => `
    <tr>
      <td style="padding:10px 0;">
        <div style="font-weight:600;color:#2b2b2b;">${esc(it.name)}</div>
        ${it.subtitle ? `<div style="font-size:12px;color:#7a7a7a;">${esc(it.subtitle)}</div>` : ""}
      </td>
      <td style="padding:10px 0;text-align:center;">${it.qty}</td>
      <td style="padding:10px 0;text-align:right;">${mur(it.price * it.qty)}</td>
    </tr>
  `).join("");

  const created = order.createdAt ? new Date(order.createdAt) : new Date();

  return `<!doctype html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Order Confirmation</title>
</head>
<body style="margin:0;background:#f6f6f6;font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1d1d1f;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f6f6;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          <tr>
            <td style="background:#8a4b20;color:#fff;padding:24px 24px;">
              <div style="font-size:24px;font-weight:700;">Vanilluxe</div>
              <div style="opacity:.9;">Premium Vanilla Products</div>
            </td>
          </tr>

          <tr>
            <td style="padding:24px;">
              <h1 style="margin:0 0 12px;font-size:20px;">Order Confirmation</h1>
              <p style="margin:0 0 16px;">Dear ${esc(order.customer.name)},</p>
              <p style="margin:0 0 16px;">Thank you for your order! We’re excited to prepare your premium vanilla products for you.</p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;background:#fafafa;border:1px solid #eee;border-radius:8px;">
                <tr><td style="padding:16px 16px 8px;font-weight:600;color:#444;">Order Details</td></tr>
                <tr>
                  <td style="padding:0 16px 16px;">
                    <div style="line-height:1.6;">
                      <div>Order ID: <strong>#${last8}</strong></div>
                      <div>Date: ${created.toLocaleString()}</div>
                      <div>Customer: ${esc(order.customer.name)}</div>
                      <div>Email: <a href="mailto:${order.customer.email}">${order.customer.email}</a></div>
                      ${order.customer.phone ? `<div>Phone: ${esc(order.customer.phone)}</div>` : ""}
                    </div>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;border-top:1px solid #eee;">
                <thead>
                  <tr>
                    <th align="left" style="padding:12px 0;color:#666;font-weight:600;">Product</th>
                    <th align="center" style="padding:12px 0;color:#666;font-weight:600;">Qty</th>
                    <th align="right" style="padding:12px 0;color:#666;font-weight:600;">Price</th>
                  </tr>
                </thead>
                <tbody>${itemsRows}</tbody>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;background:#fafafa;border:1px solid #eee;border-radius:8px;">
                <tr>
                  <td style="padding:16px;">
                    <div style="font-weight:600;margin-bottom:8px;">Shipping & Payment</div>
                    <div>Shipping Method: ${esc(order.shippingMethod)}</div>
                    <div>Payment Method: ${esc(order.paymentMethod)}</div>
                    ${
                      addressHtml
                        ? `<div style="margin-top:8px;"><div style="font-weight:600;">Delivery Address:</div><div>${addressHtml}</div></div>`
                        : ""
                    }
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 16px;">
                <tr><td style="padding:8px 0;color:#555;">Subtotal:</td><td align="right" style="padding:8px 0;color:#555;">${mur(order.subtotal)}</td></tr>
                <tr><td style="padding:8px 0;color:#555;">Shipping:</td><td align="right" style="padding:8px 0;color:#555;">${mur(order.shippingCost)}</td></tr>
                <tr><td colspan="2" style="padding:8px 0 0;"><hr style="border:none;border-top:1px solid #eee;" /></td></tr>
                <tr><td style="padding:12px 0;font-weight:700;color:#2b2b2b;">Total:</td><td align="right" style="padding:12px 0;font-weight:700;color:#2b2b2b;">${mur(order.total)}</td></tr>
              </table>

              <!-- Payment Instructions (UPDATED) -->
              <div style="margin:16px 0;padding:16px;border:1px solid #e5f2e9;background:#f3fbf6;border-radius:8px;">
                <div style="font-weight:700;margin-bottom:6px;">Payment Instructions</div>
                <div>Please complete your payment via <strong>Juice</strong> to <strong>58196634</strong> and include your <strong>order number</strong> as remarks.</div>
              </div>

              <p style="margin:16px 0;">We will process your order and keep you updated on the delivery status.</p>
              <p style="margin:16px 0;">If you have any questions about your order, please don’t hesitate to contact us.</p>

              <p style="margin:16px 0 0;">Best regards,<br/>The Vanilluxe Team</p>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 24px;color:#8b8b8b;font-size:12px;text-align:center;border-top:1px solid #eee;">
              This is an automated message. Please do not reply to this email.<br/>
              © ${new Date().getFullYear()} Vanilluxe — Premium Vanilla Products
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function generateEmailText(order: OrderData): string {
  const lines: string[] = [];
  lines.push("Vanilluxe — Premium Vanilla Products");
  lines.push("");
  lines.push("Order Confirmation");
  lines.push(`Order ID: #${order.id.slice(-8)}`);
  lines.push(`Customer: ${order.customer.name}`);
  lines.push(`Email: ${order.customer.email}`);
  if (order.customer.phone) lines.push(`Phone: ${order.customer.phone}`);
  lines.push("");
  lines.push("Items:");
  for (const it of order.items) {
    lines.push(` - ${it.name} x${it.qty} — ${mur(it.price * it.qty)}`);
  }
  lines.push("");
  lines.push(`Shipping Method: ${order.shippingMethod}`);
  lines.push(`Payment Method: ${order.paymentMethod}`);
  if (order.address) {
    const a = order.address;
    lines.push("Delivery Address:");
    if (a.line1) lines.push(` ${a.line1}`);
    if (a.line2) lines.push(` ${a.line2}`);
    const cityLine = [a.city, a.region, a.postalCode].filter(Boolean).join(", ");
    if (cityLine) lines.push(` ${cityLine}`);
    if (a.country) lines.push(` ${a.country}`);
  }
  lines.push("");
  lines.push(`Subtotal: ${mur(order.subtotal)}`);
  lines.push(`Shipping: ${mur(order.shippingCost)}`);
  lines.push(`Total: ${mur(order.total)}`);
  lines.push("");
  lines.push("Payment Instructions:");
  lines.push("Please complete your payment via Juice to 58196634 and include your order number as remarks.");
  lines.push("");
  lines.push("We will process your order and keep you updated on the delivery status.");
  lines.push("If you have any questions about your order, please contact us.");
  lines.push("");
  lines.push("Best regards,");
  lines.push("The Vanilluxe Team");
  return lines.join("\n");
}

/* --------------------------- S M T P   S E N D --------------------------- */

async function sendOrderEmail(order: OrderData) {
  const client = new SMTPClient({
    connection: {
      hostname: SMTP_HOST,
      port: SMTP_PORT,
      // For Zoho: 587 + STARTTLS (tls: true triggers STARTTLS for denomailer)
      tls: SMTP_PORT === 587 ? true : SMTP_SECURE,
      auth: { username: SMTP_USER, password: SMTP_PASS },
    },
  });

  const htmlRaw = generateEmailHTML(order);
  // remove trailing spaces/tabs (prevents =20) and normalize newlines
  const htmlClean = htmlRaw.replace(/[ \t]+$/gm, "").replace(/\r?\n/g, "\n");
  const textAlt = generateEmailText(order);

  const subject = `Order Confirmation - Vanilluxe #${order.id.slice(-8)}`;

  await client.send({
    from: `Vanilluxe <${FROM_EMAIL}>`,
    to: order.customer.email,
    subject,
    content: "text/html; charset=UTF-8",
    html: htmlClean,
    text: textAlt,
    headers: {
      "MIME-Version": "1.0",
      "Content-Type": "text/html; charset=UTF-8",
      "Content-Transfer-Encoding": "8bit",
    },
  });

  await client.close();
}

/* --------------------------- H A N D L E R --------------------------- */
/*  Call this function from your frontend with:
    supabase.functions.invoke("send-order-confirmation", { body: orderData })
*/

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");

  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(origin) });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: corsHeaders(origin),
    });
  }

  try {
    const order = (await req.json()) as OrderData;

    // Basic validation
    if (!order?.customer?.email || !order?.id) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing order.id or customer.email" }),
        { status: 400, headers: { ...corsHeaders(origin), "Content-Type": "application/json" } },
      );
    }

    // Option A (fast UX): fire-and-forget email so the client doesn't wait
    // const _p = sendOrderEmail(order).catch((e) => console.error("Email error:", e));

    // Option B (strict): wait for email to be sent, fail request if it fails
    await sendOrderEmail(order);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
    });
  }
});
