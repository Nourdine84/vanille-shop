import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/* ================= CONFIG ================= */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "http://localhost:3000";

  const LOGO = "https://vanilleor.fr/images/logo-vanilleor.png";

/* ================= UTILS ================= */

function money(cents: number) {
  return `${(cents / 100).toFixed(2).replace(".", ",")} €`;
}

/* ================= TEMPLATE PREMIUM ================= */

function layout({
  title,
  subtitle,
  content,
  footer,
}: {
  title: string;
  subtitle?: string;
  content: string;
  footer?: string;
}) {
  return `
  <body style="margin:0;background:#f5f1ea;font-family:Arial, sans-serif;">
    <div style="max-width:640px;margin:auto;background:white;border-radius:18px;overflow:hidden;">
      
      <!-- HEADER -->
      <div style="background:linear-gradient(135deg,#0f0f0f,#2a2117);padding:30px;text-align:center;">
        <img src="${LOGO}" style="width:180px;margin-bottom:10px"/>
        <h1 style="color:white;margin:0">${title}</h1>
        ${
          subtitle
            ? `<p style="color:#ccc;margin-top:8px">${subtitle}</p>`
            : ""
        }
      </div>

      <!-- BODY -->
      <div style="padding:25px;">
        ${content}

        <div style="margin-top:30px;font-size:12px;color:#777;text-align:center;">
          ${footer || "VanilleOr — L’excellence de Madagascar"}
        </div>
      </div>

    </div>
  </body>
  `;
}

/* ================= ITEMS ================= */

function renderItems(items: any[]) {
  return items
    .map(
      (i) => `
    <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;">
      <span>${i.name} x${i.quantity}</span>
      <strong>${money(i.priceCents * i.quantity)}</strong>
    </div>
  `
    )
    .join("");
}

/* ================= SEND ================= */

async function sendMail(payload: any) {
  const res = await resend.emails.send({
    from: process.env.EMAIL_FROM as string,
    ...payload,
  });

  console.log("📧 EMAIL RESULT:", res);

  return res;
}

/* ================= CLIENT ORDER ================= */

export async function sendCustomerOrderEmail({
  to,
  orderId,
  totalCents,
  items,
}: any) {
  const html = layout({
    title: "Commande confirmée",
    subtitle: "Merci pour votre confiance",
    content: `
      <p>Votre commande <strong>#${orderId}</strong> a été validée.</p>

      <div style="margin-top:20px">
        ${renderItems(items)}
      </div>

      <h2 style="margin-top:20px;color:#a16207">
        Total : ${money(totalCents)}
      </h2>

      <div style="margin-top:25px;text-align:center">
        <a href="${SITE_URL}/products" style="
          background:#a16207;
          color:white;
          padding:14px 22px;
          border-radius:10px;
          text-decoration:none;
          font-weight:bold;
        ">
          Continuer mes achats
        </a>
      </div>
    `,
  });

  return sendMail({
    to,
    subject: `Commande confirmée #${orderId}`,
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
  const html = layout({
    title: "Nouvelle commande",
    content: `
      <p><strong>Commande :</strong> ${orderId}</p>
      <p><strong>Email :</strong> ${customerEmail}</p>

      <div style="margin-top:20px">
        ${renderItems(items)}
      </div>

      <h2 style="margin-top:20px;color:#a16207">
        Total : ${money(totalCents)}
      </h2>
    `,
  });

  return sendMail({
    to: process.env.EMAIL_ADMIN_TO,
    subject: `Nouvelle commande ${orderId}`,
    html,
  });
}

/* ================= B2B ================= */

export async function sendB2BAdminEmail(payload: any) {
  const html = layout({
    title: "Nouvelle demande B2B",
    content: `
      <p><strong>Nom :</strong> ${payload.name}</p>
      <p><strong>Email :</strong> ${payload.email}</p>
      <p><strong>Entreprise :</strong> ${payload.company || "-"}</p>
      <p><strong>Quantité :</strong> ${payload.quantity}</p>
      <p><strong>Message :</strong> ${payload.message || "-"}</p>
    `,
  });

  return sendMail({
    to: process.env.EMAIL_ADMIN_TO,
    subject: "Nouvelle demande pro",
    html,
  });
}

export async function sendB2BCustomerAckEmail(payload: any) {
  const html = layout({
    title: "Demande reçue",
    subtitle: "Nous revenons vers vous rapidement",
    content: `
      <p>Merci ${payload.name},</p>
      <p>Votre demande a bien été enregistrée.</p>
    `,
  });

  return sendMail({
    to: payload.email,
    subject: "Demande bien reçue",
    html,
  });
}