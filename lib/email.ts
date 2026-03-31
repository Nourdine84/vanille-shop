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

const FROM_EMAIL =
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

function safe(value: unknown) {
  return value !== undefined && value !== null && String(value).trim() !== ""
    ? escapeHtml(String(value))
    : "-";
}

function layout(content: string) {
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;background:#faf7f2;padding:30px;">
      <div style="max-width:600px;margin:0 auto;background:white;padding:30px;border-radius:16px;box-shadow:0 8px 24px rgba(0,0,0,0.05);">
        <div style="margin-bottom:20px;">
          <h1 style="margin:0;color:#a16207;font-size:28px;line-height:1.2;">Vanille’Or</h1>
          <p style="margin:8px 0 0 0;color:#666;">Vanille premium de Madagascar</p>
        </div>

        ${content}

        <div style="margin-top:30px;padding-top:20px;border-top:1px solid #eee;font-size:12px;color:#999;">
          Vanille’Or — Fournisseur premium Madagascar
        </div>
      </div>
    </div>
  `;
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
            <td style="padding:10px 0;color:#111;">${safe(item.name)}</td>
            <td style="padding:10px 0;text-align:center;color:#555;">x${item.quantity}</td>
            <td style="padding:10px 0;text-align:right;color:#111;font-weight:600;">
              ${formatPrice(item.priceCents * item.quantity)}
            </td>
          </tr>
        `
      )
      .join("");

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `✨ Confirmation commande Vanille’Or #${orderId.slice(0, 8)}`,
      html: layout(`
        <h2 style="margin:0 0 12px 0;color:#111;">Merci pour votre commande ✨</h2>

        <p style="margin:0 0 8px 0;color:#555;">
          Votre commande a bien été validée.
        </p>

        <p style="margin:0 0 20px 0;color:#777;font-size:14px;">
          Référence commande : <strong>#${orderId.slice(0, 8)}</strong>
        </p>

        <table style="width:100%;border-collapse:collapse;">
          ${itemsHtml}
        </table>

        <div style="margin-top:20px;padding-top:16px;border-top:1px solid #eee;">
          <p style="margin:0;font-size:18px;font-weight:700;color:#a16207;">
            Total : ${formatPrice(totalCents)}
          </p>
        </div>

        <div style="margin-top:24px;background:#fffaf1;padding:14px 16px;border-radius:12px;color:#555;">
          <p style="margin:0 0 6px 0;">📦 Préparation en cours</p>
          <p style="margin:0 0 6px 0;">🚚 Expédition sous 24 à 48h</p>
          <p style="margin:0;">📧 Nous vous tiendrons informé(e) de la suite</p>
        </div>
      `),
    });

    console.log("📧 ORDER EMAIL SENT:", to);
  } catch (error) {
    console.error("❌ EMAIL ORDER ERROR:", error);
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
      from: FROM_EMAIL,
      to,
      subject: `📦 Expédition Vanille’Or #${orderId.slice(0, 8)}`,
      html: layout(`
        <h2 style="margin:0 0 12px 0;color:#111;">Votre commande est en route 📦</h2>

        <p style="margin:0 0 10px 0;color:#555;">
          Référence commande : <strong>#${orderId.slice(0, 8)}</strong>
        </p>

        <p style="margin:0 0 8px 0;color:#555;">
          <strong>Transporteur :</strong> ${safe(carrier)}
        </p>

        <p style="margin:0;color:#555;">
          <strong>Numéro de suivi :</strong> ${safe(trackingNumber)}
        </p>
      `),
    });

    console.log("📧 SHIPPING EMAIL SENT:", to);
  } catch (error) {
    console.error("❌ EMAIL SHIPPING ERROR:", error);
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
      subject: "🔥 Nouveau lead B2B",
      html: layout(`
        <h2 style="margin:0 0 16px 0;color:#111;">Nouvelle demande B2B</h2>

        <p><strong>Nom :</strong> ${safe(name)}</p>
        <p><strong>Email :</strong> ${safe(email)}</p>
        <p><strong>Entreprise :</strong> ${safe(company)}</p>
        <p><strong>Quantité :</strong> ${safe(quantity)}</p>
        <p><strong>Message :</strong><br/>${safe(message)}</p>
      `),
    });

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Votre demande Vanille’Or a bien été reçue",
      html: layout(`
        <h2 style="margin:0 0 16px 0;color:#111;">Merci pour votre demande 🤝</h2>

        <p style="color:#555;">
          Bonjour ${safe(name)},<br/><br/>
          Nous avons bien reçu votre demande concernant
          <strong>${safe(quantity)}</strong>.
        </p>

        <p style="color:#555;">
          Notre équipe vous répond rapidement avec une offre adaptée.
        </p>
      `),
    });

    console.log("📧 B2B EMAIL SENT:", email);
  } catch (error) {
    console.error("❌ EMAIL B2B ERROR:", error);
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
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Votre demande Vanille’Or 🌿",
      html: layout(`
        <h2 style="margin:0 0 16px 0;color:#111;">Bonjour ${safe(name)},</h2>

        <p style="color:#555;">
          Nous avons bien reçu votre demande concernant
          <strong>${safe(quantity)}</strong>.
        </p>

        <p style="color:#555;">
          Nous revenons vers vous rapidement avec une offre adaptée.
        </p>
      `),
    });
  } catch (error) {
    console.error("❌ RELANCE V1 ERROR:", error);
  }
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
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Relance — votre demande Vanille’Or",
      html: layout(`
        <h2 style="margin:0 0 16px 0;color:#111;">Bonjour ${safe(name)},</h2>

        <p style="color:#555;">
          Suite à votre demande de <strong>${safe(quantity)}</strong>,
          nous pouvons vous proposer une offre sur mesure.
        </p>
      `),
    });
  } catch (error) {
    console.error("❌ RELANCE V2 ERROR:", error);
  }
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
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "🔥 Offre exclusive Vanille’Or",
      html: layout(`
        <h2 style="margin:0 0 16px 0;color:#111;">${safe(name)}, une opportunité pour vous</h2>

        <p style="color:#555;">
          Une offre préférentielle peut vous être proposée pour
          <strong>${safe(quantity)}</strong>.
        </p>

        <p style="color:#a16207;font-weight:700;">
          Remise exceptionnelle possible sur première commande.
        </p>
      `),
    });
  } catch (error) {
    console.error("❌ RELANCE V3 ERROR:", error);
  }
}

/* =========================
   DEVIS B2B
========================= */

export async function sendB2BDevisEmail({
  name,
  email,
  quantity,
}: {
  name: string;
  email: string;
  company?: string;
  quantity: string;
}) {
  const priceMap: Record<string, number> = {
    "10 kg": 1200,
    "25 kg": 2800,
    "50 kg": 5200,
    "100 kg +": 9500,
  };

  const price = priceMap[quantity] || 0;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "📄 Votre devis Vanille’Or",
      html: layout(`
        <h2 style="margin:0 0 16px 0;color:#111;">Votre devis personnalisé</h2>

        <p style="color:#555;">Bonjour ${safe(name)},</p>

        <p style="color:#555;">
          <strong>Quantité :</strong> ${safe(quantity)}
        </p>

        <h2 style="color:#a16207;margin:20px 0;">
          ${price} €
        </h2>

        <p style="color:#555;">
          ✔ Qualité premium<br/>
          ✔ Approvisionnement direct Madagascar<br/>
          ✔ Livraison gros volume
        </p>
      `),
    });

    console.log("📧 DEVIS SENT:", email);
  } catch (error) {
    console.error("❌ DEVIS ERROR:", error);
  }
}