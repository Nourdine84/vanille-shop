import { Resend } from "resend";

type OrderItem = {
  name: string;
  quantity: number;
  priceCents: number;
};

type SendOrderConfirmationParams = {
  to: string;
  orderId: string;
  items: OrderItem[];
  totalCents: number;
};

type SendShippingEmailParams = {
  to: string;
  orderId: string;
  trackingNumber: string;
  carrier?: string | null;
};

const resend = new Resend(process.env.RESEND_API_KEY);

const from = process.env.RESEND_FROM_EMAIL || "Vanille’Or <onboarding@resend.dev>";

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendOrderConfirmationEmail({
  to,
  orderId,
  items,
  totalCents,
}: SendOrderConfirmationParams) {
  const safeItems = items.map((item) => ({
    name: escapeHtml(item.name),
    quantity: item.quantity,
    price: formatPrice(item.priceCents * item.quantity),
  }));

  const itemsHtml = safeItems
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;color:#111;">${item.name}</td>
          <td style="padding:8px 0;color:#666;text-align:center;">x${item.quantity}</td>
          <td style="padding:8px 0;color:#111;text-align:right;">${item.price}</td>
        </tr>
      `
    )
    .join("");

  await resend.emails.send({
    from,
    to,
    subject: `Confirmation de commande Vanille’Or #${orderId.slice(0, 8)}`,
    html: `
      <div style="font-family:Arial,sans-serif;background:#faf7f2;padding:32px;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;box-shadow:0 8px 30px rgba(0,0,0,0.06);">
          <h1 style="margin:0 0 16px;font-size:28px;color:#111;">Merci pour votre commande ✨</h1>
          <p style="margin:0 0 24px;color:#555;line-height:1.6;">
            Votre commande Vanille’Or a bien été confirmée et est en cours de préparation.
          </p>

          <div style="background:#f7f7f7;border-radius:12px;padding:16px 18px;margin-bottom:24px;">
            <p style="margin:0;color:#333;"><strong>Commande :</strong> #${escapeHtml(orderId.slice(0, 8))}</p>
          </div>

          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <thead>
              <tr>
                <th style="text-align:left;padding-bottom:10px;border-bottom:1px solid #eee;">Produit</th>
                <th style="text-align:center;padding-bottom:10px;border-bottom:1px solid #eee;">Qté</th>
                <th style="text-align:right;padding-bottom:10px;border-bottom:1px solid #eee;">Montant</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="display:flex;justify-content:space-between;border-top:1px solid #eee;padding-top:16px;margin-bottom:24px;">
            <span style="font-size:16px;color:#333;"><strong>Total</strong></span>
            <span style="font-size:18px;color:#a16207;"><strong>${formatPrice(totalCents)}</strong></span>
          </div>

          <p style="margin:0;color:#555;line-height:1.6;">
            Vous recevrez un nouvel email dès que votre commande sera expédiée.
          </p>

          <div style="margin-top:28px;padding-top:18px;border-top:1px solid #eee;font-size:13px;color:#888;">
            Vanille’Or — Vanille premium de Madagascar
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendShippingEmail({
  to,
  orderId,
  trackingNumber,
  carrier,
}: SendShippingEmailParams) {
  const safeTracking = escapeHtml(trackingNumber);
  const safeCarrier = carrier ? escapeHtml(carrier) : "Transporteur";

  await resend.emails.send({
    from,
    to,
    subject: `Votre commande Vanille’Or #${orderId.slice(0, 8)} a été expédiée`,
    html: `
      <div style="font-family:Arial,sans-serif;background:#faf7f2;padding:32px;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;box-shadow:0 8px 30px rgba(0,0,0,0.06);">
          <h1 style="margin:0 0 16px;font-size:28px;color:#111;">Votre commande est en route 📦</h1>
          <p style="margin:0 0 24px;color:#555;line-height:1.6;">
            Bonne nouvelle, votre commande Vanille’Or a été expédiée.
          </p>

          <div style="background:#f7f7f7;border-radius:12px;padding:16px 18px;margin-bottom:24px;">
            <p style="margin:0 0 8px;color:#333;"><strong>Commande :</strong> #${escapeHtml(orderId.slice(0, 8))}</p>
            <p style="margin:0 0 8px;color:#333;"><strong>Transporteur :</strong> ${safeCarrier}</p>
            <p style="margin:0;color:#333;"><strong>Numéro de suivi :</strong> ${safeTracking}</p>
          </div>

          <p style="margin:0;color:#555;line-height:1.6;">
            Conservez cet email pour suivre l’acheminement de votre colis.
          </p>

          <div style="margin-top:28px;padding-top:18px;border-top:1px solid #eee;font-size:13px;color:#888;">
            Vanille’Or — Vanille premium de Madagascar
          </div>
        </div>
      </div>
    `,
  });
}