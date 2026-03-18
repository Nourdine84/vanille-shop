import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type OrderItem = {
  name: string;
  quantity: number;
  priceCents: number;
};

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
    console.log("📧 Tentative envoi email à:", to);

    const itemsHtml = items
      .map(
        (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${(item.priceCents / 100).toFixed(2)} €</td>
        </tr>
      `
      )
      .join("");

    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM as string,
      to,
      subject: "Confirmation de commande - Vanille Or",
      html: `
        <div style="font-family: Arial; max-width: 600px; margin: auto;">
          <h2 style="color:#007BFF;">Merci pour votre commande</h2>

          <p>Votre commande a bien été confirmée.</p>

          <table width="100%" border="1" cellspacing="0" cellpadding="8">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <h3>Total : ${(totalCents / 100).toFixed(2)} €</h3>

          <p style="margin-top:20px;">
            Merci pour votre confiance,<br/>
            <strong>Vanille Or</strong>
          </p>
        </div>
      `,
    });

    console.log("✅ Email envoyé:", response);
  } catch (error) {
    console.error("❌ Erreur envoi email:", error);
  }
}
