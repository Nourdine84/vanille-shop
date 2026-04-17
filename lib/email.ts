import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/* ================= TYPES ================= */

type MailPayload = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

type OrderItem = {
  id?: string;
  name?: string;
  quantity?: number;
  priceCents?: number;
  imageUrl?: string;
};

type B2BPayload = {
  name: string;
  email: string;
  company?: string | null;
  quantity: string;
  message?: string | null;
};

type QuotePayload = {
  to: string;
  name: string;
  company?: string | null;
  quantity: string;
  amountEuros?: number | null;
  customMessage?: string | null;
};

/* ================= CONFIG ================= */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "http://localhost:3000";

const LOGO_URL = `${SITE_URL}/images/logo-vanilleor.png`;

/* ================= UTILS ================= */

function money(cents: number) {
  return `${(Number(cents || 0) / 100)
    .toFixed(2)
    .replace(".", ",")} €`;
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* ================= LAYOUT PREMIUM ================= */

function renderLayout({
  title,
  subtitle,
  body,
  footer,
  ctaLabel,
  ctaHref,
}: any) {
  return `
  <body style="margin:0;background:#f6f2eb;font-family:Arial;">
    <div style="max-width:680px;margin:auto;background:white;border-radius:18px;overflow:hidden;">
      
      <div style="background:linear-gradient(135deg,#111,#2a2117);padding:30px;text-align:center;">
        <img src="${LOGO_URL}" style="max-width:200px;margin-bottom:10px"/>
        <h1 style="color:white;">${title}</h1>
        ${subtitle ? `<p style="color:#ddd">${subtitle}</p>` : ""}
      </div>

      <div style="padding:25px;">
        ${body}

        ${
          ctaLabel
            ? `<div style="text-align:center;margin-top:25px">
                <a href="${ctaHref}" style="
                  background:#a16207;
                  color:white;
                  padding:14px 20px;
                  border-radius:10px;
                  text-decoration:none;
                  font-weight:bold;
                ">${ctaLabel}</a>
              </div>`
            : ""
        }

        <div style="margin-top:25px;font-size:12px;color:#777;text-align:center;">
          ${footer || "VanilleOr — Vanille premium"}
        </div>
      </div>
    </div>
  </body>
  `;
}

/* ================= SEND ================= */

async function sendMail(payload: MailPayload) {
  return resend.emails.send({
    from: process.env.EMAIL_FROM as string,
    ...payload,
  });
}

/* ================= ITEMS ================= */

function renderItems(items: OrderItem[]) {
  return items
    .map(
      (i) => `
      <div style="display:flex;justify-content:space-between;margin-bottom:10px">
        <span>${escapeHtml(i.name || "Produit")} x${i.quantity}</span>
        <strong>${money(
          (i.priceCents || 0) * (i.quantity || 1)
        )}</strong>
      </div>
    `
    )
    .join("");
}

/* ================= CLIENT ORDER ================= */

export async function sendCustomerOrderEmail({
  to,
  orderId,
  totalCents,
  items,
}: any) {
  const html = renderLayout({
    title: "Commande confirmée",
    subtitle: "Merci pour votre confiance",
    body: `
      <p>Votre commande #${orderId}</p>
      ${renderItems(items)}
      <h2>Total : ${money(totalCents)}</h2>
    `,
    ctaLabel: "Voir les produits",
    ctaHref: `${SITE_URL}/products`,
  });

  return sendMail({
    to,
    subject: `Commande #${orderId}`,
    html,
  });
}

/* ================= ADMIN ORDER ================= */

export async function sendAdminOrderEmail({
  orderId,
  customerEmail,
  totalCents,
  items,
}: any) {
  const html = renderLayout({
    title: "Nouvelle commande",
    body: `
      <p>ID : ${orderId}</p>
      <p>Email : ${customerEmail}</p>
      ${renderItems(items)}
      <h2>Total : ${money(totalCents)}</h2>
    `,
  });

  return sendMail({
    to: process.env.EMAIL_ADMIN_TO as string,
    subject: `Commande ${orderId}`,
    html,
  });
}

/* ================= SHIPPING ================= */

export async function sendShippingEmail({
  to,
  orderId,
  trackingNumber,
  carrier,
}: any) {
  const html = renderLayout({
    title: "Commande expédiée",
    body: `
      <p>Commande #${orderId}</p>
      <p>Transporteur : ${carrier}</p>
      <p>Suivi : ${trackingNumber}</p>
    `,
  });

  return sendMail({
    to,
    subject: "Commande expédiée",
    html,
  });
}

/* ================= REVIEW ================= */

export async function sendReviewRequestEmail({ to, orderId }: any) {
  const html = renderLayout({
    title: "Donnez votre avis ⭐",
    body: `
      <p>Commande #${orderId}</p>
      <p>Votre avis est important pour nous</p>
    `,
    ctaLabel: "Laisser un avis",
    ctaHref: `${SITE_URL}/reviews`,
  });

  return sendMail({
    to,
    subject: "Votre avis compte",
    html,
  });
}

/* ================= ABANDON CART ================= */

export async function sendAbandonedCartEmail({ to, items }: any) {
  const html = renderLayout({
    title: "Votre panier vous attend",
    body: `
      ${renderItems(items)}
      <p>Stock limité ⚠️</p>
    `,
    ctaLabel: "Finaliser",
    ctaHref: `${SITE_URL}/checkout`,
  });

  return sendMail({
    to,
    subject: "Panier en attente",
    html,
  });
}

/* ================= B2B ================= */

export async function sendB2BAdminEmail(payload: B2BPayload) {
  const html = renderLayout({
    title: "Demande pro",
    body: `
      <p>${payload.name}</p>
      <p>${payload.email}</p>
      <p>${payload.quantity}</p>
    `,
  });

  return sendMail({
    to: process.env.EMAIL_ADMIN_TO as string,
    subject: "Nouvelle demande pro",
    html,
  });
}

export async function sendB2BCustomerAckEmail(payload: B2BPayload) {
  const html = renderLayout({
    title: "Demande reçue",
    body: `<p>Merci ${payload.name}</p>`,
  });

  return sendMail({
    to: payload.email,
    subject: "Demande reçue",
    html,
  });
}

/* ================= QUOTE ================= */

export async function sendQuoteEmail(payload: QuotePayload) {
  const html = renderLayout({
    title: "Votre devis",
    body: `
      <p>${payload.name}</p>
      <p>${payload.quantity}</p>
      ${
        payload.amountEuros
          ? `<h2>${payload.amountEuros} €</h2>`
          : ""
      }
    `,
  });

  return sendMail({
    to: payload.to,
    subject: "Votre devis",
    html,
  });
}