// Deno / Supabase Edge Function
// EXPECTS: { orderData: { ... } }  <-- your current payload shape

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

/* ---------- CORS ---------- */
const ALLOWED_ORIGINS = ["https://vanilluxe.store", "http://localhost:5173"];
const cors = (origin: string | null) => ({
  "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin ?? "") ? (origin as string) : "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  Vary: "Origin",
});

/* ---------- SMTP (Zoho) ---------- */
const smtpUsername = Deno.env.get("ZOHO_SMTP_USER") ?? "info@vanilluxe.store";
const smtpPassword = Deno.env.get("ZOHO_SMTP_PASSWORD") ?? "gTeUN6GxgRT8";
const fromAddress = Deno.env.get("ZOHO_FROM_EMAIL") ?? "info@vanilluxe.store";

const client = new SMTPClient({
  connection: {
    hostname: "smtp.zoho.com",
    port: 465,
    tls: true,
    auth: { username: smtpUsername, password: smtpPassword },
  },
});

/* ---------- Types ---------- */
type OrderItem = { sku: string; name: string; quantity: number; price: number; variant?: string };
type OrderData = {
  id: string;
  customer: { email: string; firstName?: string; lastName?: string; name?: string; phone?: string };
  items: OrderItem[];
  subtotal: number;
  shippingCost?: number;
  total: number;
  shippingMethod?: string;
  paymentMethod?: string;
  address?: { line1?: string; line2?: string; city?: string; postalCode?: string };
  createdAt?: string;
};

/* ---------- Helpers ---------- */
const mur = (n: number) => `Rs ${Number(n || 0).toFixed(2)}`;

function validate(o: OrderData | null): string[] {
  const p: string[] = [];
  if (!o) { p.push("Invalid JSON body"); return p; }
  if (!o.id) p.push("Missing order.id");
  if (!o.customer?.email) p.push("Missing customer.email");
  if (!o.items?.length) p.push("No items");
  return p;
}

function html(o: OrderData): string {
  const name =
    o.customer.name ||
    [o.customer.firstName, o.customer.lastName].filter(Boolean).join(" ").trim() ||
    "Customer";

  const address = o.address
    ? [o.address.line1, o.address.line2, o.address.city, o.address.postalCode].filter(Boolean).join(", ")
    : "";

  const rows = o.items.map(it => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${it.name}${it.variant ? ` — <small>${it.variant}</small>` : ""}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${it.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${mur(it.price)}</td>
    </tr>`).join("");

  return `<!doctype html><html><body style="margin:0;background:#f7f6f3;font-family:Arial,Segoe UI,Roboto,Helvetica,sans-serif">
  <table width="100%" cellspacing="0" cellpadding="0" style="background:#f7f6f3;padding:24px 0">
    <tr><td align="center">
      <table width="600" cellspacing="0" cellpadding="0" style="background:#fff;border-radius:12px;overflow:hidden">
        <tr><td style="padding:24px 28px;background:#1f140c;color:#fff">
          <h1 style="margin:0;font-size:20px">Vanilluxe • Order Confirmation</h1>
          <div style="opacity:.9;font-size:13px;margin-top:6px">Order #${o.id.slice(-8)}</div>
        </td></tr>
        <tr><td style="padding:26px 28px">
          <p style="margin:0 0 12px">Hi ${name},</p>
          <p style="margin:0 0 16px">Thank you for your purchase! We're preparing your premium Madagascar vanilla.</p>

          <h3 style="margin:18px 0 8px;color:#8B4513">Order Details</h3>
          <p style="margin:4px 0"><strong>Email:</strong> ${o.customer.email}</p>
          ${o.customer.phone ? `<p style="margin:4px 0"><strong>Phone:</strong> ${o.customer.phone}</p>` : ""}
          ${address ? `<p style="margin:4px 0"><strong>Address:</strong> ${address}</p>` : ""}

          <h3 style="margin:20px 0 8px;color:#8B4513">Items</h3>
          <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
            <thead>
              <tr>
                <th align="left"  style="border-bottom:1px solid #ddd;padding:8px">Product</th>
                <th align="center"style="border-bottom:1px solid #ddd;padding:8px">Qty</th>
                <th align="right" style="border-bottom:1px solid #ddd;padding:8px">Price</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
              <tr><td colspan="3" style="height:8px"></td></tr>
              <tr><td></td><td style="padding:6px 8px;text-align:right"><strong>Subtotal</strong></td><td style="padding:6px 8px;text-align:right">${mur(o.subtotal)}</td></tr>
              <tr><td></td><td style="padding:6px 8px;text-align:right"><strong>Shipping</strong></td><td style="padding:6px 8px;text-align:right">${mur(o.shippingCost ?? 0)}</td></tr>
              <tr><td></td><td style="padding:8px;text-align:right;border-top:1px solid #ddd"><strong>Total</strong></td><td style="padding:8px;text-align:right;border-top:1px solid #ddd"><strong>${mur(o.total)}</strong></td></tr>
            </tbody>
          </table>

          <div style="margin:20px 0;padding:14px;border:1px dashed #c7b9a6;border-radius:10px;background:#fffaf2">
            <strong style="display:block;margin-bottom:6px">Payment instructions</strong>
            <div style="font-size:14px;line-height:1.45">Please Juice on <strong>58196634</strong> and include your <strong>order number</strong> as remarks.</div>
          </div>

          <p style="margin:20px 0 6px">Any questions? Reply to this email and we’ll help.</p>
          <p style="margin:0;color:#7a6a58">— Vanilluxe • vanilluxe.store</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
  </body></html>`;
}

/* ---------- Handler ---------- */
serve(async (req: Request) => {
  const origin = req.headers.get("Origin");
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors(origin) });
  }

  try {
    const { orderData } = await req.json();
    const problems = validate(orderData as OrderData);
    if (problems.length) {
      return new Response(JSON.stringify({ ok: false, problems }), {
        status: 400,
        headers: { ...cors(origin), "Content-Type": "application/json" },
      });
    }

    const emailHtml = html(orderData as OrderData);

    // HTML only (prevents quoted-printable "=20" artifacts)
    await client.send({
      from: `Vanilluxe <${fromAddress}>`,
      to: (orderData as OrderData).customer.email,
      subject: `Order Confirmation - Vanilluxe #${(orderData as OrderData).id.slice(-8)}`,
      html: emailHtml,
    });

    // Optional: copy to store inbox
    if ((orderData as OrderData).customer.email.toLowerCase() !== fromAddress.toLowerCase()) {
      await client.send({
        from: `Vanilluxe <${fromAddress}>`,
        to: fromAddress,
        subject: `Copy • Order #${(orderData as OrderData).id.slice(-8)} sent to ${(orderData as OrderData).customer.email}`,
        html: emailHtml,
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
