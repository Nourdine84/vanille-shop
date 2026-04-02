import { Resend } from "resend";

/* =========================
   TYPES
========================= */

type OrderItem = {
  id?: string;
  name: string;
  quantity: number;
  priceCents: number;
};

type SendOrderConfirmationParams = {
  to: string;
  orderId: string;
  items: OrderItem[];
  totalCents: number;
  trackingNumber?: string;
  carrier?: string | null;
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

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ||
  "Vanille’Or <onboarding@resend.dev>";

const B2B_RECEIVER =
  process.env.B2B_RECEIVER_EMAIL || "contact@vanilleor.com";

const BASE_URL =
  process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

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

function safe(value: unknown) {
  return value !== undefined && value !== null && String(value).trim() !== ""
    ? escapeHtml(String(value))
    : "-";
}

/* =========================
   TRACKING LINK
========================= */

function getTrackingLink(carrier?: string | null, tracking?: string) {
  if (!carrier || !tracking) return null;

  switch (carrier.toLowerCase()) {
    case "colissimo":
      return `https://www.laposte.fr/outils/suivre-vos-envois?code=${tracking}`;
    case "chronopost":
      return `https://www.chronopost.fr/tracking-no-cms/suivi-page?listeNumerosLT=${tracking}`;
    case "dhl":
      return `https://www.dhl.com/fr-fr/home/tracking.html?tracking-id=${tracking}`;
    default:
      return null;
  }
}

/* =========================
   LAYOUT PREMIUM (LOGO)
========================= */

function layout(content: string) {
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#faf7f2;padding:40px;">
      <div style="max-width:600px;margin:0 auto;background:white;padding:30px;border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,0.05);">
        
        <!-- LOGO -->
        <div style="text-align:center;margin-bottom:20px;">
          <img 
            src="${BASE_URL}/logo.png" 
            alt="Vanille’Or"
            style="height:60px;object-fit:contain;"
          />
        </div>

        ${content}

        <div style="margin-top:30px;padding-top:20px;border-top:1px solid #eee;font-size:12px;color:#999;text-align:center;">
          Vanille’Or — Vanille premium de Madagascar
        </div>
      </div>
    </div>
  `;
}

/* =========================
   ORDER CONFIRMATION PREMIUM
========================= */

export async function sendOrderConfirmationEmail({
  to,
  orderId,
  items,
  totalCents,
  trackingNumber,
  carrier,
}: SendOrderConfirmationParams) {
  try {
    const trackingLink = getTrackingLink(carrier, trackingNumber);

    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding:10px 0;">${safe(item.name)}</td>
          <td style="text-align:center;">x${item.quantity}</td>
          <td style="text-align:right;font-weight:600;">
            ${formatPrice(item.priceCents * item.quantity)}
          </td>
        </tr>
      `
      )
      .join("");

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `✨ Commande confirmée Vanille’Or #${orderId.slice(0, 8)}`,

      html: layout(`
        <h2 style="text-align:center;">Merci pour votre commande ✨</h2>

        <p style="text-align:center;color:#666;">
          Référence : <strong>#${orderId.slice(0, 8)}</strong>
        </p>

        <table style="width:100%;margin-top:20px;">
          ${itemsHtml}
        </table>

        <h3 style="text-align:right;margin-top:20px;">
          Total : ${formatPrice(totalCents)}
        </h3>

        ${
          trackingNumber
            ? `
          <div style="margin-top:30px;padding:20px;background:#fffaf1;border-radius:12px;text-align:center;">
            <p>📦 Expédition en cours</p>
            <strong>${trackingNumber}</strong>

            ${
              trackingLink
                ? `
              <div style="margin-top:10px;">
                <a href="${trackingLink}" 
                   style="background:#a16207;color:white;padding:10px 18px;border-radius:8px;text-decoration:none;">
                  Suivre mon colis
                </a>
              </div>
            `
                : ""
            }
          </div>
        `
            : ""
        }

        <div style="text-align:center;margin-top:30px;">
          <a href="${BASE_URL}/products"
             style="background:#a16207;color:white;padding:12px 20px;border-radius:10px;text-decoration:none;">
            Voir nos produits
          </a>
        </div>
      `),
    });

    console.log("📧 ORDER EMAIL SENT:", to);
  } catch (error) {
    console.error("❌ EMAIL ORDER ERROR:", error);
  }
}

/* =========================
   SHIPPING EMAIL PREMIUM
========================= */

export async function sendShippingEmail({
  to,
  orderId,
  trackingNumber,
  carrier,
}: SendShippingEmailParams) {
  try {
    const trackingLink = getTrackingLink(carrier, trackingNumber);

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `📦 Expédition Vanille’Or #${orderId.slice(0, 8)}`,

      html: layout(`
        <h2>Votre commande est en route 📦</h2>

        <p><strong>Commande :</strong> #${orderId.slice(0, 8)}</p>
        <p><strong>Transporteur :</strong> ${safe(carrier)}</p>
        <p><strong>Suivi :</strong> ${safe(trackingNumber)}</p>

        ${
          trackingLink
            ? `
          <div style="margin-top:20px;text-align:center;">
            <a href="${trackingLink}" 
               style="background:#a16207;color:white;padding:12px 20px;border-radius:10px;text-decoration:none;">
              Suivre mon colis
            </a>
          </div>
        `
            : ""
        }
      `),
    });

    console.log("📧 SHIPPING EMAIL SENT:", to);
  } catch (error) {
    console.error("❌ EMAIL SHIPPING ERROR:", error);
  }
}

/* =========================
   B2B EMAIL (inchangé mais clean)
========================= */

export async function sendB2BEmail({
  name,
  email,
  company,
  quantity,
  message,
}: SendB2BParams) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [B2B_RECEIVER],
      subject: "🔥 Nouveau lead B2B",
      html: layout(`
        <h2>Nouvelle demande B2B</h2>

        <p><strong>Nom :</strong> ${safe(name)}</p>
        <p><strong>Email :</strong> ${safe(email)}</p>
        <p><strong>Entreprise :</strong> ${safe(company)}</p>
        <p><strong>Quantité :</strong> ${safe(quantity)}</p>
        <p><strong>Message :</strong><br/>${safe(message)}</p>
      `),
    });

    console.log("📧 B2B EMAIL SENT:", email);
  } catch (error) {
    console.error("❌ EMAIL B2B ERROR:", error);
  }
}