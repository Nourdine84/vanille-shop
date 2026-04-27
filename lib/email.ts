import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/* ================= CONFIG ================= */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "http://localhost:3000";

const LOGO = "https://vanilleor.fr/images/logo-vanilleor.png";

/* ================= TYPES ================= */

type EmailItem = {
  id?: string;
  name?: string;
  quantity?: number;
  priceCents?: number;
  imageUrl?: string;
  description?: string;
  format?: string;
};

type LayoutProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  content: string;
  footer?: string;
};

type CustomerOrderPayload = {
  to: string;
  orderId: string;
  totalCents: number;
  items: EmailItem[];
};

type AdminOrderPayload = {
  orderId: string;
  customerEmail?: string | null;
  totalCents: number;
  items: EmailItem[];
};

type ShippingPayload = {
  to: string;
  orderId: string;
  trackingNumber?: string;
  carrier?: string;
};

type AbandonedCartPayload = {
  to: string;
  items: EmailItem[];
};

type B2BPayload = {
  name?: string;
  email?: string;
  company?: string;
  quantity?: string;
  message?: string;
};

type QuotePayload = {
  to: string;
  name?: string;
  quantity?: string;
  amountEuros?: number | null;
  customMessage?: string | null;
};

type RelancePayload = {
  to: string;
  name?: string;
};

/* ================= UTILS ================= */

function money(cents: number) {
  return `${(Number(cents || 0) / 100).toFixed(2).replace(".", ",")} €`;
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function resolveImageUrl(imageUrl?: string) {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http")) return imageUrl;
  return `${SITE_URL}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
}

/* ================= TEMPLATE PREMIUM V4 ================= */

function layout({
  title,
  subtitle,
  eyebrow,
  content,
  footer,
}: LayoutProps) {
  return `
  <body style="margin:0;padding:24px 12px;background:#f5f1ea;font-family:Arial,sans-serif;color:#1a1a1a;">
    <div style="max-width:680px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.08);">
      
      <div style="background:linear-gradient(135deg,#0f0f0f,#2a2117);padding:34px 28px 28px;text-align:center;">
        <img
          src="${LOGO}"
          alt="VanilleOr"
          style="width:170px;max-width:100%;height:auto;display:block;margin:0 auto 14px;"
        />

        ${
          eyebrow
            ? `<div style="color:#d4af37;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;font-weight:700;margin-bottom:10px;">${escapeHtml(
                eyebrow
              )}</div>`
            : ""
        }

        <h1 style="margin:0;color:#ffffff;font-size:30px;line-height:1.2;font-weight:800;">
          ${escapeHtml(title)}
        </h1>

        ${
          subtitle
            ? `<p style="margin:10px auto 0;color:#d6d0c8;font-size:15px;line-height:1.5;max-width:500px;">${escapeHtml(
                subtitle
              )}</p>`
            : ""
        }
      </div>

      <div style="padding:30px 26px;">
        ${content}

        <div style="margin-top:34px;padding-top:18px;border-top:1px solid #eee;text-align:center;font-size:12px;color:#777;line-height:1.6;">
          ${
            footer ||
            "VanilleOr — L’excellence de Madagascar<br/>Vanille & épices premium"
          }
        </div>
      </div>
    </div>
  </body>
  `;
}

/* ================= BLOCKS ================= */

function sectionCard(content: string) {
  return `
    <div style="
      margin-top:18px;
      background:#faf8f4;
      border:1px solid #eee7dd;
      border-radius:16px;
      padding:16px;
    ">
      ${content}
    </div>
  `;
}

function statRow(label: string, value: string, emphasized = false) {
  return `
    <div style="
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
      gap:14px;
      padding:${emphasized ? "16px 0 0" : "0"};
      margin-top:${emphasized ? "8px" : "0"};
      border-top:${emphasized ? "1px solid #eadfce" : "none"};
    ">
      <span style="
        font-size:${emphasized ? "18px" : "14px"};
        font-weight:${emphasized ? "800" : "600"};
        color:${emphasized ? "#1a1a1a" : "#5f5f5f"};
      ">
        ${escapeHtml(label)}
      </span>

      <span style="
        font-size:${emphasized ? "18px" : "14px"};
        font-weight:800;
        color:${emphasized ? "#a16207" : "#1a1a1a"};
        text-align:right;
      ">
        ${escapeHtml(value)}
      </span>
    </div>
  `;
}

function ctaButton(label: string, href: string) {
  return `
    <div style="margin-top:28px;text-align:center;">
      <a href="${escapeHtml(href)}" style="
        display:inline-block;
        background:#a16207;
        color:#ffffff;
        padding:14px 28px;
        border-radius:999px;
        text-decoration:none;
        font-weight:700;
        font-size:15px;
        box-shadow:0 8px 20px rgba(161,98,7,0.22);
      ">
        ${escapeHtml(label)}
      </a>
    </div>
  `;
}

/* ================= ITEMS RENDER ================= */

function renderItems(items: EmailItem[] = []) {
  if (!items.length) {
    return `
      <div style="
        padding:18px 0;
        color:#777;
        font-size:14px;
      ">
        Aucun produit renseigné.
      </div>
    `;
  }

  return items
    .map((item) => {
      const name = item?.name || "Produit";
      const qty = Number(item?.quantity) || 1;
      const priceCents = Number(item?.priceCents) || 0;
      const lineTotal = money(priceCents * qty);
      const description = item?.description?.trim();
      const format = item?.format?.trim();
      const imageUrl = resolveImageUrl(item?.imageUrl);

      return `
        <div style="
          display:flex;
          gap:14px;
          padding:14px 0;
          border-bottom:1px solid #ece7df;
          align-items:flex-start;
        ">
          ${
            imageUrl
              ? `
            <img
              src="${escapeHtml(imageUrl)}"
              alt="${escapeHtml(name)}"
              style="
                width:64px;
                height:64px;
                border-radius:12px;
                object-fit:cover;
                display:block;
                background:#f2eee8;
                border:1px solid #eee;
              "
            />
          `
              : `
            <div style="
              width:64px;
              height:64px;
              border-radius:12px;
              background:#f2eee8;
              border:1px solid #eee;
              flex-shrink:0;
            "></div>
          `
          }

          <div style="flex:1;min-width:0;">
            <div style="
              font-size:15px;
              font-weight:800;
              color:#141414;
              line-height:1.35;
              margin:0;
            ">
              ${escapeHtml(name)}
            </div>

            ${
              format
                ? `<div style="margin-top:4px;font-size:12px;color:#8a8a8a;font-weight:600;">Format : ${escapeHtml(
                    format
                  )}</div>`
                : ""
            }

            ${
              description
                ? `<div style="margin-top:6px;font-size:13px;line-height:1.55;color:#6e6e6e;">${escapeHtml(
                    description
                  )}</div>`
                : ""
            }

            <div style="margin-top:8px;font-size:13px;color:#7a7a7a;font-weight:600;">
              Quantité : ${qty}
            </div>
          </div>

          <div style="
            font-size:16px;
            font-weight:800;
            color:#a16207;
            white-space:nowrap;
            text-align:right;
            line-height:1.3;
          ">
            ${escapeHtml(lineTotal)}
          </div>
        </div>
      `;
    })
    .join("");
}

/* ================= SEND (DEBUG SAFE) ================= */

async function sendMail(payload: {
  to: string | string[] | undefined;
  subject: string;
  html: string;
}) {
  try {
    // ✅ FIX : bon check
    if (!payload.to) {
      console.warn("⚠️ EMAIL SKIPPED → no recipient");
      return null;
    }

    console.log("\n📧 ===== EMAIL DEBUG START =====");
    console.log("📧 API KEY:", !!process.env.RESEND_API_KEY);
    console.log("📧 FROM:", from);
    console.log("📧 TO:", payload.to);
    console.log("📧 SUBJECT:", payload.subject);

    const res = await resend.emails.send({
      from: process.env.EMAIL_FROM as string,
      to: payload.to,
      subject: payload.subject,

      // ✅ FIX RESEND V4 → obligatoire
      html: payload.html,
      text: payload.subject, // fallback simple (obligatoire pour TS)
    });

    console.log("📧 EMAIL RESULT:", JSON.stringify(res, null, 2));
    console.log("📧 ===== EMAIL DEBUG END =====\n");

    return res;
  } catch (err: any) {
    console.error("\n❌ EMAIL ERROR:", err?.message || err);
    console.error(err);
    return null;
  }
}

/* ================= ORDER CLIENT ================= */

export async function sendCustomerOrderEmail({
  to,
  orderId,
  totalCents,
  items,
}: CustomerOrderPayload) {
  const html = layout({
    eyebrow: "Commande",
    title: "Commande confirmée",
    subtitle: "Merci pour votre confiance. Nous préparons votre sélection avec le plus grand soin.",
    content: `
      <p style="margin:0 0 10px;font-size:16px;line-height:1.65;color:#333;">
        Votre commande <strong>#${escapeHtml(orderId)}</strong> a bien été validée.
      </p>

      <p style="margin:0;font-size:14px;line-height:1.65;color:#6b6b6b;">
        Voici le récapitulatif de votre achat :
      </p>

      ${sectionCard(renderItems(items))}

      ${sectionCard(
        statRow("Référence", `#${orderId}`) +
          statRow("Total", money(totalCents), true)
      )}

      ${ctaButton("Continuer mes achats", `${SITE_URL}/products`)}
    `,
  });

  return sendMail({
    to,
    subject: `Commande confirmée #${orderId}`,
    html,
  });
}

/* ================= ORDER ADMIN ================= */

export async function sendAdminOrderEmail({
  orderId,
  customerEmail,
  totalCents,
  items,
}: AdminOrderPayload) {
  const html = layout({
    eyebrow: "Administration",
    title: "Nouvelle commande",
    subtitle: "Une nouvelle commande a été enregistrée sur VanilleOr.",
    content: `
      ${sectionCard(
        statRow("Commande", orderId) +
          statRow("Email client", customerEmail || "-") +
          statRow("Total", money(totalCents), true)
      )}

      ${sectionCard(renderItems(items))}
    `,
  });

  return sendMail({
    to: process.env.EMAIL_ADMIN_TO,
    subject: `Nouvelle commande ${orderId}`,
    html,
  });
}

/* ================= SHIPPING ================= */

export async function sendShippingEmail(payload: ShippingPayload) {
  const html = layout({
    eyebrow: "Expédition",
    title: "Commande expédiée",
    subtitle: "Votre colis est en route.",
    content: `
      ${sectionCard(
        statRow("Commande", payload.orderId) +
          statRow("Transporteur", payload.carrier || "N/A") +
          statRow("Suivi", payload.trackingNumber || "N/A")
      )}

      ${ctaButton("Découvrir nos produits", `${SITE_URL}/products`)}
    `,
  });

  return sendMail({
    to: payload.to,
    subject: "Commande expédiée",
    html,
  });
}

/* ================= ABANDON CART ================= */

export async function sendAbandonedCartEmail({
  to,
  items,
}: AbandonedCartPayload) {
  const html = layout({
    eyebrow: "Panier",
    title: "Votre panier vous attend",
    subtitle: "Votre sélection est toujours disponible.",
    content: `
      <p style="margin:0;font-size:15px;line-height:1.65;color:#4a4a4a;">
        Retrouvez vos produits favoris et finalisez votre commande en quelques clics.
      </p>

      ${sectionCard(renderItems(items))}

      ${ctaButton("Finaliser ma commande", `${SITE_URL}/checkout`)}
    `,
  });

  return sendMail({
    to,
    subject: "Votre panier vous attend 🛒",
    html,
  });
}

/* ================= B2B ================= */

export async function sendB2BAdminEmail(payload: B2BPayload) {
  const html = layout({
    eyebrow: "B2B",
    title: "Nouvelle demande professionnelle",
    subtitle: "Un prospect a soumis une demande via le formulaire pro.",
    content: `
      ${sectionCard(
        statRow("Nom", payload.name || "-") +
          statRow("Email", payload.email || "-") +
          statRow("Entreprise", payload.company || "-") +
          statRow("Quantité", payload.quantity || "-")
      )}

      ${
        payload.message
          ? sectionCard(`
              <div style="font-size:14px;font-weight:700;color:#1a1a1a;margin-bottom:8px;">Message</div>
              <div style="font-size:14px;line-height:1.65;color:#666;">${escapeHtml(
                payload.message
              )}</div>
            `)
          : ""
      }
    `,
  });

  return sendMail({
    to: process.env.EMAIL_ADMIN_TO,
    subject: "Nouvelle demande pro",
    html,
  });
}

export async function sendB2BCustomerAckEmail(payload: B2BPayload) {
  const html = layout({
    eyebrow: "B2B",
    title: "Demande bien reçue",
    subtitle: "Nous revenons vers vous rapidement avec une réponse adaptée à votre besoin.",
    content: `
      <p style="margin:0 0 10px;font-size:16px;line-height:1.65;color:#333;">
        Merci ${escapeHtml(payload.name || "")},
      </p>

      <p style="margin:0;font-size:14px;line-height:1.7;color:#666;">
        Votre demande a bien été enregistrée. Notre équipe reviendra vers vous dans les meilleurs délais.
      </p>

      ${payload.quantity ? sectionCard(statRow("Quantité demandée", payload.quantity)) : ""}
    `,
  });

  return sendMail({
    to: payload.email,
    subject: "Demande bien reçue",
    html,
  });
}

/* ================= QUOTE ================= */

export async function sendQuoteEmail(payload: QuotePayload) {
  const html = layout({
    eyebrow: "Devis",
    title: "Votre devis VanilleOr",
    subtitle: "Voici un récapitulatif de votre demande.",
    content: `
      ${sectionCard(
        statRow("Nom", payload.name || "-") +
          statRow("Quantité", payload.quantity || "-") +
          (payload.amountEuros != null
            ? statRow("Montant estimé", `${payload.amountEuros} €`, true)
            : "")
      )}

      ${ctaButton("Découvrir nos produits", `${SITE_URL}/products`)}
    `,
  });

  return sendMail({
    to: payload.to,
    subject: "Votre devis",
    html,
  });
}

/* ================= RELANCE ================= */

export async function sendB2BRelanceEmail(payload: RelancePayload) {
  const html = layout({
    eyebrow: "Relance",
    title: "Nous revenons vers vous",
    subtitle: "Votre demande nous intéresse toujours.",
    content: `
      <p style="margin:0;font-size:15px;line-height:1.7;color:#555;">
        Bonjour ${escapeHtml(payload.name || "")},<br/><br/>
        Nous revenons vers vous concernant votre intérêt pour nos produits VanilleOr.
      </p>

      ${ctaButton("Découvrir VanilleOr", `${SITE_URL}/products`)}
    `,
  });

  return sendMail({
    to: payload.to,
    subject: "Relance VanilleOr",
    html,
  });
}

export async function sendB2BRelanceV2Email(payload: RelancePayload) {
  const html = layout({
    eyebrow: "Relance",
    title: "Dernier message de suivi",
    subtitle: "Nous restons disponibles pour échanger.",
    content: `
      <p style="margin:0;font-size:15px;line-height:1.7;color:#555;">
        Bonjour ${escapeHtml(payload.name || "")},<br/><br/>
        Nous vous adressons un dernier message de suivi concernant votre demande.
      </p>

      ${ctaButton("Voir nos produits", `${SITE_URL}/products`)}
    `,
  });

  return sendMail({
    to: payload.to,
    subject: "Dernière relance",
    html,
  });
}