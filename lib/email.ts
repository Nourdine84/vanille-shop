import { Resend } from "resend";

/* =========================
   TYPES
========================= */

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

type SendB2BParams = {
  name: string;
  email: string;
  company?: string;
  quantity: string;
  message?: string;
};

/* =========================
   INIT
========================= */

const resend = new Resend(process.env.RESEND_API_KEY);

const from =
  process.env.RESEND_FROM_EMAIL ||
  "Vanille’Or <onboarding@resend.dev>";

const B2B_RECEIVER =
  process.env.B2B_RECEIVER_EMAIL || "contact@vanilleor.com";

/* =========================
   UTILS
========================= */

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

/* =========================
   ORDER CONFIRMATION
========================= */

export async function sendOrderConfirmationEmail({
  to,
  orderId,
  items,
  totalCents,
}: SendOrderConfirmationParams) {
  try {
    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td>${escapeHtml(item.name)}</td>
          <td style="text-align:center">x${item.quantity}</td>
          <td style="text-align:right">${formatPrice(
            item.priceCents * item.quantity
          )}</td>
        </tr>
      `
      )
      .join("");

    await resend.emails.send({
      from,
      to,
      subject: `Confirmation commande Vanille’Or #${orderId.slice(0, 8)}`,
      html: `
        <div style="font-family:Arial;background:#faf7f2;padding:30px;">
          <div style="background:white;padding:25px;border-radius:12px;max-width:600px;margin:auto;">
            <h2>Merci pour votre commande ✨</h2>
            <p>Commande #${orderId.slice(0, 8)}</p>

            <table style="width:100%;margin-top:20px;">
              ${itemsHtml}
            </table>

            <h3 style="margin-top:20px;color:#a16207;">
              Total: ${formatPrice(totalCents)}
            </h3>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("EMAIL ORDER ERROR:", error);
  }
}

/* =========================
   SHIPPING EMAIL
========================= */

export async function sendShippingEmail({
  to,
  orderId,
  trackingNumber,
  carrier,
}: SendShippingEmailParams) {
  try {
    await resend.emails.send({
      from,
      to,
      subject: `Expédition Vanille’Or #${orderId.slice(0, 8)}`,
      html: `
        <div style="font-family:Arial;background:#faf7f2;padding:30px;">
          <div style="background:white;padding:25px;border-radius:12px;">
            <h2>Votre commande est en route 📦</h2>
            <p>Commande #${orderId.slice(0, 8)}</p>
            <p>Transporteur: ${escapeHtml(carrier || "N/A")}</p>
            <p>Suivi: ${escapeHtml(trackingNumber)}</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("EMAIL SHIPPING ERROR:", error);
  }
}

/* =========================
   B2B EMAIL (ADMIN + CLIENT)
========================= */

export async function sendB2BEmail({
  name,
  email,
  company,
  quantity,
  message,
}: SendB2BParams) {
  try {
    /* 🔥 EMAIL ADMIN */
    await resend.emails.send({
      from,
      to: [B2B_RECEIVER],
      subject: "🔥 Nouveau lead B2B",
      html: `
        <div style="font-family:Arial;background:#faf7f2;padding:30px;">
          <div style="background:white;padding:25px;border-radius:12px;">
            <h2>Nouvelle demande B2B</h2>
            <p><strong>Nom:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Entreprise:</strong> ${escapeHtml(company || "-")}</p>
            <p><strong>Quantité:</strong> ${escapeHtml(quantity)}</p>
            <p><strong>Message:</strong><br/>${escapeHtml(message || "-")}</p>
          </div>
        </div>
      `,
    });

    /* 🔥 EMAIL CLIENT (TRÈS IMPORTANT BUSINESS) */
    await resend.emails.send({
      from,
      to: email,
      subject: "Votre demande Vanille’Or a bien été reçue",
      html: `
        <div style="font-family:Arial;background:#faf7f2;padding:30px;">
          <div style="background:white;padding:25px;border-radius:12px;">
            
            <h2>Merci pour votre demande 🤝</h2>

            <p>
              Bonjour ${escapeHtml(name)},<br/><br/>
              Nous avons bien reçu votre demande concernant 
              <strong>${escapeHtml(quantity)}</strong>.
            </p>

            <p>
              Notre équipe va vous répondre rapidement avec une offre adaptée.
            </p>

            <div style="margin-top:20px;color:#777;">
              Vanille’Or — Fournisseur premium Madagascar
            </div>

          </div>
        </div>
      `,
    });

  } catch (error) {
    console.error("EMAIL B2B ERROR:", error);
  }
}