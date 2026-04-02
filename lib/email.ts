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
   LAYOUT PREMIUM
========================= */

function layout(content: string) {
  return `
    <div style="font-family:Arial;background:#faf7f2;padding:40px;">
      <div style="max-width:600px;margin:0 auto;background:white;padding:30px;border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,0.05);">
        
        <div style="text-align:center;margin-bottom:20px;">
          <img src="${BASE_URL}/logo.png" style="height:60px;" />
        </div>

        ${content}

        <div style="margin-top:30px;text-align:center;font-size:12px;color:#999;">
          Vanille’Or — Premium Madagascar
        </div>
      </div>
    </div>
  `;
}

/* =========================
   ORDER EMAIL
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
          <td>${safe(item.name)}</td>
          <td>x${item.quantity}</td>
          <td style="text-align:right;">
            ${formatPrice(item.priceCents * item.quantity)}
          </td>
        </tr>`
      )
      .join("");

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Commande confirmée #${orderId.slice(0, 8)}`,
      html: layout(`
        <h2>Merci pour votre commande</h2>

        <table style="width:100%;">
          ${itemsHtml}
        </table>

        <h3>Total : ${formatPrice(totalCents)}</h3>

        ${
          trackingNumber
            ? `<p>Tracking : ${trackingNumber}</p>`
            : ""
        }

        ${
          trackingLink
            ? `<a href="${trackingLink}">Suivre mon colis</a>`
            : ""
        }
      `),
    });
  } catch (err) {
    console.error("EMAIL ORDER ERROR", err);
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
    const link = getTrackingLink(carrier, trackingNumber);

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Expédition commande #${orderId.slice(0, 8)}`,
      html: layout(`
        <h2>Votre commande est expédiée</h2>

        <p>Tracking : ${trackingNumber}</p>

        ${
          link
            ? `<a href="${link}">Suivre</a>`
            : ""
        }
      `),
    });
  } catch (err) {
    console.error(err);
  }
}

/* =========================
   B2B EMAIL
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
      subject: "Nouveau lead B2B",
      html: layout(`
        <p>${safe(name)}</p>
        <p>${safe(email)}</p>
        <p>${safe(company)}</p>
        <p>${safe(quantity)}</p>
        <p>${safe(message)}</p>
      `),
    });
  } catch (err) {
    console.error(err);
  }
}

/* =========================
   DEVIS B2B (FIX FINAL)
========================= */

export async function sendB2BDevisEmail({
  name,
  email,
  company,
  quantity,
}: {
  name: string;
  email: string;
  company?: string;
  quantity: string;
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Votre devis Vanille’Or",
      html: layout(`
        <h2>Bonjour ${safe(name)}</h2>

        ${
          company
            ? `<p>Entreprise : ${safe(company)}</p>`
            : ""
        }

        <p>Quantité : ${safe(quantity)}</p>
      `),
    });
  } catch (err) {
    console.error(err);
  }
}

/* =========================
   RELANCES B2B
========================= */

export async function sendB2BRelanceEmail({
  name,
  email,
  quantity,
}: {
  name: string;
  email: string;
  quantity: string;
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Relance Vanille’Or",
    html: layout(`<p>${safe(name)} - ${safe(quantity)}</p>`),
  });
}

export async function sendB2BRelanceV2Email({
  name,
  email,
  quantity,
}: {
  name: string;
  email: string;
  quantity: string;
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Relance 2",
    html: layout(`<p>${safe(name)} - ${safe(quantity)}</p>`),
  });
}

export async function sendB2BRelanceV3Email({
  name,
  email,
  quantity,
}: {
  name: string;
  email: string;
  quantity: string;
}) {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Relance finale",
    html: layout(`<p>${safe(name)} - ${safe(quantity)}</p>`),
  });
}