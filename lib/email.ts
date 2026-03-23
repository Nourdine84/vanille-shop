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
    console.log("📧 Envoi email à:", to);

    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td style="padding:10px; border-bottom:1px solid #eee;">
            ${item.name}
          </td>
          <td style="padding:10px; border-bottom:1px solid #eee; text-align:center;">
            ${item.quantity}
          </td>
          <td style="padding:10px; border-bottom:1px solid #eee; text-align:right;">
            ${formatPrice(item.priceCents * item.quantity)}
          </td>
        </tr>
      `
      )
      .join("");

    const html = `
      <div style="font-family: Arial, sans-serif; background:#faf7f2; padding:30px;">
        
        <div style="max-width:600px; margin:auto; background:white; border-radius:12px; overflow:hidden;">
          
          <!-- HEADER -->
          <div style="background:#a16207; color:white; padding:20px; text-align:center;">
            <h2 style="margin:0;">Vanille’Or</h2>
            <p style="margin:5px 0 0; font-size:14px;">
              Vanille premium de Madagascar
            </p>
          </div>

          <!-- CONTENT -->
          <div style="padding:25px;">
            
            <h3 style="margin-top:0;">Merci pour votre commande 🎉</h3>

            <p style="color:#555;">
              Votre commande a bien été confirmée et est en cours de préparation.
            </p>

            <!-- TABLE -->
            <table width="100%" cellspacing="0" cellpadding="0" style="margin-top:20px;">
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
            <div style="margin-top:20px; text-align:right;">
              <h3>Total : ${formatPrice(totalCents)}</h3>
            </div>

            <!-- INFO -->
            <div style="margin-top:20px; font-size:14px; color:#666;">
              📦 Préparation en cours <br/>
              🚚 Expédition sous 24-48h <br/>
              📧 Vous recevrez un email de suivi
            </div>

          </div>

          <!-- FOOTER -->
          <div style="background:#fafafa; padding:20px; text-align:center; font-size:12px; color:#888;">
            <p style="margin:0;">
              Merci pour votre confiance 💛
            </p>
            <p style="margin:5px 0 0;">
              © Vanille’Or — AKM.Consulting
            </p>
          </div>

        </div>
      </div>
    `;

    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM as string,
      to,
      subject: "Votre commande Vanille’Or est confirmée 🎉",
      html,
    });

    console.log("✅ Email envoyé:", response);

  } catch (error) {
    console.error("❌ Erreur envoi email:", error);
  }
}
