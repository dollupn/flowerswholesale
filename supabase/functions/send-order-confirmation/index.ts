// supabase/functions/send-order-confirmation/index.ts
// Edge Function: normalize order payload, send email via Zoho SMTP

import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

/* ------------------------- C O R S ------------------------- */
const ALLOWED_ORIGINS = ["https://vanilluxe.store", "http://localhost:5173"];
const corsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin ?? "")
    ? (origin as string)
    : "https://vanilluxe.store",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  Vary: "Origin",
});

/* -------------------- ENV (with fallbacks for now) -------------------- */
const SMTP_HOST = Deno.env.get("ZOHO_SMTP_HOST") ?? "smtp.zoho.com";
const SMTP_PORT = Number(Deno.env.get("ZOHO_SMTP_PORT") ?? "587"); // 587 STARTTLS
const SMTP_SECURE = (Deno.env.get("ZOHO_SMTP_SECURE") ?? "false") === "true";
const SMTP_USER = Deno.env.get("ZOHO_SMTP_USER") ?? "info@vanilluxe.store";
const SMTP_PASS = Deno.env.get("ZOHO_SMTP_PASSWORD") ?? "gTeUN6GxgRT8";
const FROM_EMAIL = Deno.env.get("ZOHO_FROM_EMAIL") ?? "info@vanilluxe.store";

/* --------------------------- Types --------------------------- */
type OrderItem = { name: string; qty: number; price: number; subtitle?: string };
type Address = {
  line1?: string; line2?: string; city?: string; region?: string;
  postalCode?: string; country?: string;
};
type OrderData = {
  id: string;
  customer: { name: string; email: string; phone?: string };
  items: OrderItem[];
  shippingMethod: string;
  paymentMethod: string;
  address?: Address;
  subtotal: number;
  shippingCost: number;
  total: number;
  createdAt?: string | Date;
};

/* --------------------------- Utils --------------------------- */
const mur = (n: number) => `Rs ${Number(n || 0).toFixed(2)}`;
const esc = (s: string) => String(s ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Normalize various checkout payloads */
function normalizeOrderPayload(raw: any): { order?: OrderData; problems: string[] } {
  const p = raw?.order ?? raw ?? {};
  const problems: string[] = [];

  const id = p.id ?? p.order_id ?? p.orderId ?? p.number ?? p.reference ?? p.orderNumber;
  if (!id) problems.push("Missing order.id");

  const cust = p.customer ?? p.user ?? {};
  const customerEmail = cust.email ?? p.customer_email ?? p.email;
  if (!customerEmail) problems.push("Missing customer.email");
  const customerName = cust.name ?? p.customer_name ?? p.name ?? "Customer";
  const customerPhone = cust.phone ?? p.customer_phone ?? p.phone;

  // Items
  const rawItems = p.items ?? p.cartItems ?? p.products ?? [];
  const items: OrderItem[] = (Array.isArray(rawItems) ? rawItems : []).map((it: any) => ({
    name: it.name ?? it.title ?? "Item",
    qty: Number(it.qty ?? it.quantity ?? 1),
    price: Number(it.price ?? it.unit_price ?? it.amount ?? 0),
    subtitle: it.subtitle ?? it.variant ?? it.option,
  }));
  if (!items.length) problems.push("No items");

  // Address
  const a = p.address ?? p.shipping_address ?? {};
  const address: Address = {
    line1: a.line1 ?? a.address1 ?? a.address,
    line2: a.line2 ?? a.address2,
    city: a.city,
    region: a.region ?? a.state,
    postalCode: a.postalCode ?? a.zip,
    country: a.country,
  };

  const subtotal = Number(p.subtotal ?? p.sub_total ?? 0);
  const shippingCost = Number(p.shippingCost ?? p.shipping_cost ?? p.shipping ?? 0);
  const total = Number(p.total ?? subtotal + shippingCost);

  const order: OrderData = {
    id: String(id),
    customer: { name: String(customerName), email: String(customerEmail), phone: customerPhone },
    items,
    shippingMethod: p.shippingMethod ?? p.delivery ?? "Postage",
    paymentMethod: p.paymentMethod ?? p.payment ?? "Juice",
    address,
    subtotal,
    shippingCost,
    total,
    createdAt: p.createdAt ?? new Date(),
  };

  return { order, problems };
}

/* --------------------- Email HTML (shortened) --------------------- */
function generateEmailHTML(order: OrderData): string {
  return `
  <html><body>
  <h2>Order Confirmation</h2>
  <p>Dear ${esc(order.customer.name)}, thank you for your order.</p>
  <p><b>Order ID:</b> #${order.id.slice(-8)}</p>
  <ul>${order.items.map(it => `<li>${esc(it.name)} x${it.qty} — ${mur(it.price * it.qty)}</li>`).join("")}</ul>
  <p><b>Total:</b> ${mur(order.total)}</p>
  <h3>Payment Instructions</h3>
  <p>Please complete your payment via <b>Juice</b> to <b>58196634</b> and include your <b>order number</b> as remarks.</p>
  <p>We will keep you updated on delivery.</p>
  <p>— The Vanilluxe Team</p>
  </body></html>`;
}
function generateEmailText(order: OrderData): string {
  return `Order Confirmation - Vanilluxe
Order ID: #${order.id.slice(-8)}
Customer: ${order.customer.name}
Total: ${mur(order.total)}

Please complete your payment via Juice to 58196634 and include your order number as remarks.

Thank you,
The Vanilluxe Team`;
}

/* --------------------- SMTP Send --------------------- */
async function sendOrderEmail(order: OrderData) {
  const client = new SMTPClient({
    connection: {
      hostname: SMTP_HOST,
      port: SMTP_PORT,
      tls: SMTP_PORT === 587 ? true : SMTP_SECURE,
      auth: { username: SMTP_USER, password: SMTP_PASS },
    },
  });

  const html = generateEmailHTML(order);
  const text = generateEmailText(order);

  await client.send({
    from: `Vanilluxe <${FROM_EMAIL}>`,
    to: order.customer.email,
    subject: `Order Confirmation - Vanilluxe #${order.id.slice(-8)}`,
    html,
    text,
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
  await client.close();
}

/* --------------------- Handler --------------------- */
Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(origin) });
  if (req.method !== "POST") return new Response("Method Not Allowed", { status: 405, headers: corsHeaders(origin) });

  try {
    const raw = await req.json();
    const { order, problems } = normalizeOrderPayload(raw);
    if (problems.length) {
      return new Response(JSON.stringify({ ok: false, problems }), {
        status: 400,
        headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
      });
    }

    await sendOrderEmail(order!);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Function error:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
    });
  }
});
