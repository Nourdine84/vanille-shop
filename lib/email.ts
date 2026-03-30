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
      from,
      to: email,
      subject: "Votre demande Vanille’Or 🌿",
      html: `
        <div style="font-family:Arial;background:#faf7f2;padding:32px;">
          <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:16px;">
            
            <h2 style="margin-bottom:10px;">
              Bonjour ${name},
            </h2>

            <p style="color:#555;">
              Nous avons bien reçu votre demande concernant 
              <strong>${quantity}</strong>.
            </p>

            <p style="color:#555;">
              Nous revenons vers vous rapidement avec une offre adaptée.
            </p>

            <p style="margin-top:20px;">
              👉 Si votre besoin est urgent, vous pouvez nous répondre directement à cet email.
            </p>

            <div style="margin-top:30px;font-size:13px;color:#888;">
              Vanille’Or — Premium Madagascar
            </div>

          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("RELANCE EMAIL ERROR:", error);
  }
}

export async function sendB2BRelanceV2Email({
  name,
  email,
  quantity,
}: any) {
  await resend.emails.send({
    from,
    to: email,
    subject: "Relance — votre demande Vanille’Or",
    html: `
      <div style="padding:30px;background:#faf7f2">
        <div style="background:white;padding:25px;border-radius:12px">

          <h2>Bonjour ${name},</h2>

          <p>
            Nous souhaitions revenir vers vous concernant votre demande de ${quantity}.
          </p>

          <p>
            Nos équipes peuvent vous proposer une offre sur mesure adaptée à votre activité.
          </p>

          <p><strong>Souhaitez-vous que nous vous envoions un devis rapidement ?</strong></p>

        </div>
      </div>
    `,
  });
}

export async function sendB2BRelanceV3Email({
  name,
  email,
  quantity,
}: any) {
  await resend.emails.send({
    from,
    to: email,
    subject: "Offre exclusive Vanille’Or 🔥",
    html: `
      <div style="padding:30px;background:#faf7f2">
        <div style="background:white;padding:25px;border-radius:12px">

          <h2>${name}, une opportunité pour vous</h2>

          <p>
            Suite à votre demande (${quantity}), nous pouvons vous proposer une offre préférentielle.
          </p>

          <p style="font-size:18px;color:#a16207;">
            🔥 Remise exceptionnelle possible sur votre première commande
          </p>

          <p>
            Répondez simplement à cet email pour en profiter.
          </p>

        </div>
      </div>
    `,
  });
}

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
  const priceMap: Record<string, number> = {
    "10 kg": 1200,
    "25 kg": 2800,
    "50 kg": 5200,
    "100 kg +": 9500,
  };

  const price = priceMap[quantity] || 0;

  try {
    await resend.emails.send({
      from,
      to: [email],
      subject: "📄 Votre devis Vanille’Or",
      html: `
        <div style="font-family:Arial;background:#faf7f2;padding:30px;">
          <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:16px;">
            
            <h1 style="color:#a16207;">Vanille’Or</h1>

            <h2>Votre devis personnalisé</h2>

            <p>Bonjour ${name},</p>

            <p>
              Suite à votre demande, voici votre devis :
            </p>

            <hr/>

            <p><strong>Produit :</strong> Vanille premium Madagascar</p>
            <p><strong>Quantité :</strong> ${quantity}</p>

            <h2 style="color:#a16207;">
              ${price} €
            </h2>

            <p style="margin-top:20px;">
              ✔ Qualité premium<br/>
              ✔ Approvisionnement direct Madagascar<br/>
              ✔ Livraison gros volume
            </p>

            <p style="margin-top:20px;">
              Nous restons à votre disposition pour finaliser votre commande.
            </p>

            <p style="margin-top:20px;">
              — Vanille’Or
            </p>

          </div>
        </div>
      `,
    });

    console.log("✅ DEVIS EMAIL SENT:", email);

  } catch (error) {
    console.error("❌ DEVIS EMAIL ERROR:", error);
  }
}