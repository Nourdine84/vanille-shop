import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type OrderItem = {
  name: string;
  quantity: number;
  priceCents: number;
};

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

export async function sendOrderEmail({
  to,
  items,
  totalCents,
}: {
  to: string;
  items: OrderItem[];
  totalCents: number;
}) {
  try {
    const safeEmail = to || "tn.smok@hotmail.fr";

    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding:12px; border-bottom:1px solid #eee;">
            ${item.name}
          </td>
          <td style="padding:12px; border-bottom:1px solid #eee; text-align:center;">
            ${item.quantity}
          </td>
          <td style="padding:12px; border-bottom:1px solid #eee; text-align:right; font-weight:600;">
            ${formatPrice(item.priceCents * item.quantity)}
          </td>
        </tr>
      `
      )
      .join("");

    const html = `
    <div style="font-family: Arial, sans-serif; background:#f5f1ea; padding:40px;">
      
      <div style="max-width:620px; margin:auto; background:white; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">

        <!-- HEADER PREMIUM -->
        <div style="background:linear-gradient(135deg,#a16207,#d4a373); color:white; padding:30px; text-align:center;">
          <h1 style="margin:0; font-size:26px;">Vanille’Or</h1>
          <p style="margin:8px 0 0; font-size:14px; opacity:0.9;">
            L’excellence de la vanille de Madagascar
          </p>
        </div>

        <!-- CONTENU -->
        <div style="padding:30px;">
          
          <h2 style="margin-top:0; font-size:22px;">
            Merci pour votre commande ✨
          </h2>

          <p style="color:#555; line-height:1.6;">
            Nous avons bien reçu votre commande.  
            Chaque gousse de vanille est sélectionnée avec soin auprès de producteurs locaux à Madagascar afin de garantir une qualité exceptionnelle.
          </p>

          <!-- TABLE PRODUITS -->
          <table width="100%" cellspacing="0" cellpadding="0" style="margin-top:25px;">
            <thead>
              <tr style="text-align:left; border-bottom:2px solid #eee;">
                <th style="padding:10px;">Produit</th>
                <th style="padding:10px; text-align:center;">Qté</th>
                <th style="padding:10px; text-align:right;">Prix</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- TOTAL -->
          <div style="margin-top:25px; text-align:right;">
            <h2 style="margin:0;">Total : ${formatPrice(totalCents)}</h2>
          </div>

          <!-- INFO LIVRAISON -->
          <div style="margin-top:25px; font-size:14px; color:#666;">
            📦 Préparation en cours <br/>
            🚚 Expédition sous 24-48h <br/>
            📧 Suivi envoyé prochainement
          </div>

          <!-- CTA -->
          <div style="text-align:center; margin-top:30px;">
            <a href="https://vanilleor.fr/products" 
               style="display:inline-block; background:#a16207; color:white; padding:14px 24px; border-radius:10px; text-decoration:none; font-weight:600;">
               Découvrir nos produits
            </a>
          </div>

        </div>

        <!-- FOOTER -->
        <div style="background:#fafafa; padding:20px; text-align:center; font-size:12px; color:#888;">
          <p style="margin:0;">
            Vanille premium • Madagascar • Qualité artisanale
          </p>
          <p style="margin:5px 0 0;">
            © Vanille’Or — AKM Consulting
          </p>
        </div>

      </div>
    </div>
    `;

    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM || "contact@vanilleor.fr",
      to: safeEmail,
      subject: "Votre commande Vanille’Or est confirmée ✨",
      html,
    });

    console.log("✅ Email envoyé:", response);

  } catch (error) {
    console.error("❌ Erreur email:", error);
  }
}