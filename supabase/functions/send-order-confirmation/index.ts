// supabase/functions/send-order-confirmation/index.ts
// Edge Function for Supabase (Deno). Sends order confirmation via Zoho SMTP.
// - Accepts payloads shaped as { orderData: {...} } or { order: {...} } or raw order.
// - Fixes the `=20` artifacts by sending pure HTML.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

/* ----------------------------- CORS ----------------------------- */
const ALLOWED_ORIGINS = ["https://vanilluxe.store", "http://localhost:5173"];
const cors = (origin: string | null) => ({
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin ?? "")
    ? (origin as string)
    : "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  Vary: "Origin",
});

/* -------------------------- Types --------------------------- */
type Address = {
  line1?: string; line2?: string; city?: string; postalCode?: string;
};

type OrderItem = {
  sku: string;
  name: string;
  quantity: number;
  price: number; // unit price
  variant?: string;
};

type Order = {
  id: string;
  customer: { firstName?: string; lastName?: string; name?: string; email: string; phone?: string };
  items: OrderItem[];
  shippingMethod: string;
  paymentMethod: string;
  address?: Address;
  subtotal: number;
  shippingCost: number;
  total: number;
  createdAt?: string | Date;
};

const mur = (n: number) => `Rs ${Number(n || 0).toFixed(2)}`;

/* ---------------------- SMTP Setup (Zoho) ---------------------- */
const smtpUsername = Deno.env.get("ZOHO_SMTP_USER") ?? "info@vanilluxe.store";
const smtpPassword = Deno.env.get("ZOHO_SMTP_PASSWORD") ?? "gTeUN6GxgRT8";
const fromAddress = Deno.env.get("ZOHO_FROM_EMAIL") ?? "info@vanilluxe.store";

const smtpClient = new SMTPClient({
  connection: {
    hostname: "smtp.zoho.com",
    port: 465,          // SSL
    tls: true,
    auth: { username: smtpUsername, password: smtpPassword },
  },
});

/* --------------------- Normalization Helper -------------------- */
function normalizeOrder(body: unknown): Order | null {
  let raw: any = body ?? {};
  if ("orderData" in (raw ?? {})) raw = raw.orderData;
  else if ("order" in (raw ?? {})) raw = raw.order;

  if (!raw || typeof raw !== "object") return null;
  const cust = raw.customer ?? {};
  const name =
    cust.name ??
    [cust.firstName, cust.lastName].filter(Boolean).join(" ").trim();

  const order: Order = {
    id: String(raw.id ?? "").trim(),
    customer: {
      firstName: cust.firstName,
      lastName: cust.lastName,
      name: name || undefined,
      email: String(cust.email ?? "").trim(),
      phone: cust.phone ? String(cust.phone) : undefined,
    },
    items: Array.isArray(raw.items)
      ? raw.items.map((it: any) => ({
          sku: String(it.sku ?? it.id ?? "").trim(),
          name: String(it.name ?? it.title ?? "").trim(),
          quantity: Number(it.quantity ?? it.qty ?? 0),
          price: Number(it.price ?? it.unitPrice ?? 0),
          variant: it.variant ?? it.option,
        }))
      : [],
    shippingMethod: String(raw.shippingMethod ?? raw.deliveryMethod ?? "").trim(),
    paymentMethod: String(raw.paymentMethod ?? raw.payment ?? "").trim(),
    address: raw.address ?? raw.shippingAddress ?? undefined,
    subtotal: Number(raw.subtotal ?? raw.subTotal ?? 0),
    shippingCost: Number(raw.shippingCost ?? raw.shipping ?? 0),
    total: Number(raw.total ?? 0),
    createdAt: raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
  };

  return order;
}

/* ----------------------- Validation Helper --------------------- */
function validateOrder(o: Order | null): string[] {
  const problems: string[] = [];
  if (!o) { problems.push("Invalid JSON body"); return problems; }
  if (!o.id) problems.push("Missing order.id");
  if (!o.customer?.email) problems.push("Missing customer.email");
  if (!o.items?.length) problems.push("No items");
  return problems;
}

/* ------------------------- Email HTML -------------------------- */
function orderHtml(o: Order): string {
  const customerName =
    o.customer.name ||
    [o.customer.firstName, o.customer.lastName].filter(Boolean).join(" ").trim() ||
    "Customer";

  const addressStr = o.address
    ? [o.address.line1, o.address.line2, o.address.city, o.address.postalCode]
        .filter(Boolean)
        .join(", ")
    : "";

  const itemsRows = o.items.map(
    (it) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee;">${it.name}${it.variant ? ` — <small>${it.variant}</small>` : ""}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${it.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${mur(it.price)}</td>
      </tr>`
  ).join("");

  return `
  <!doctype html>
  <html>
  <body style="margin:0;background:#f7f6f3;font-family:Arial,Segoe UI,Roboto,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f6f3;padding:24px 0;">
      <tr><td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:12px;overflow:hidden">
          <tr>
            <td style="padding:24px 28px;background:#1f140c;color:#fff;">
              <h1 style="margin:0;font-size:20px;letter-spacing:0.5px;">Vanilluxe • Order Confirmation</h1>
              <div style="opacity:.9;font-size:13px;margin-top:6px">Order #${o.id.slice(-8)} • ${new Date(o.createdAt ?? new Date()).toLocaleString("en-GB")}</div>
            </td>
          </tr>
          <tr><td style="padding:26px 28px">
            <p style="margin:0 0 12px">Hi ${customerName},</p>
            <p style="margin:0 0 16px">Thank you for your purchase! We're preparing your premium Madagascar vanilla.</p>

            <h3 style="margin:18px 0 8px;color:#8B4513">Order Details</h3>
            <p style="margin:4px 0"><strong>Customer:</strong> ${customerName}</p>
            <p style="margin:4px 0"><strong>Email:</strong> ${o.customer.email}</p>
            ${o.customer.phone ? `<p style="margin:4px 0"><strong>Phone:</strong> ${o.customer.phone}</p>` : ""}
            ${addressStr ? `<p style="margin:4px 0"><strong>Address:</strong> ${addressStr}</p>` : ""}

            <h3 style="margin:20px 0 8px;color:#8B4513">Items</h3>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
              <thead>
                <tr>
                  <th align="left" style="border-bottom:1px solid #ddd;padding:8px">Product</th>
                  <th align="center" style="border-bottom:1px solid #ddd;padding:8px">Qty</th>
                  <th align="right" style="border-bottom:1px solid #ddd;padding:8px">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
                <tr><td colspan="3" style="height:8px"></td></tr>
                <tr>
                  <td></td>
                  <td style="padding:6px 8px;text-align:right"><strong>Subtotal</strong></td>
                  <td style="padding:6px 8px;text-align:right">${mur(o.subtotal)}</td>
                </tr>
                <tr>
                  <td></td>
                  <td style="padding:6px 8px;text-align:right"><strong>Shipping</strong></td>
                  <td style="padding:6px 8px;text-align:right">${mur(o.shippingCost)}</td>
                </tr>
                <tr>
                  <td></td>
                  <td style="padding:8px;text-align:right;border-top:1px solid #ddd"><strong>Total</strong></td>
                  <td style="padding:8px;text-align:right;border-top:1px solid #ddd"><strong>${mur(o.total)}</strong></td>
                </tr>
              </tbody>
            </table>

            <div style="margin:20px 0;padding:14px;border:1px dashed #c7b9a6;border-radius:10px;background:#fffaf2">
              <strong style="display:block;margin-bottom:6px">Payment instructions</strong>
              <div style="font-size:14px;line-height:1.45">
                Please Juice on <strong>58196634</strong> and include your <strong>order number</strong> as remarks.
              </div>
            </div>

            <p style="margin:20px 0 6px">Any questions? Reply to this email and we’ll help.</p>
            <p style="margin:0;color:#7a6a58">— Vanilluxe • vanilluxe.store</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
  </html>`;
}

/* --------------------------- Handler --------------------------- */
serve(async (req: Request) => {
  const origin = req.headers.get("Origin");
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors(origin) });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const order = normalizeOrder(body);
    const problems = validateOrder(order);
    if (problems.length) {
      return new Response(JSON.stringify({ ok: false, problems }), {
        status: 400,
        headers: { ...cors(origin), "Content-Type": "application/json" },
      });
    }

    const html = orderHtml(order as Order);
    await smtpClient.send({
      from: fromAddress,
      to: order!.customer.email,
      subject: `Vanilluxe – Order #${order!.id.slice(-8)}`,
      html,   // Send HTML only → no "=20" artifacts
    });

    // Optional: BCC store address
    if (order!.customer.email.toLowerCase() !== fromAddress.toLowerCase()) {
      await smtpClient.send({
        from: fromAddress,
        to: fromAddress,
        subject: `Copy • Order #${order!.id.slice(-8)} sent to ${order!.customer.email}`,
        html,
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...cors(origin), "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-order-confirmation error:", err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { ...cors(origin), "Content-Type": "application/json" },
    });
  }
});
