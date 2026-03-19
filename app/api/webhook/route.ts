import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    console.error("❌ Signature Stripe manquante");
    return new NextResponse("Signature manquante", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("❌ Webhook signature error:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  console.log("📦 Event:", event.type);

  // 🎯 CHECKOUT VALIDÉ
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // 🔹 récupérer les produits du checkout
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      console.log("📧 Tentative envoi email à:", process.env.EMAIL_TEST);

      await resend.emails.send({
        from: "Vanille Or <onboarding@resend.dev>",
        to: process.env.EMAIL_TEST || "msanourdine@hotmail.com",
        subject: "✨ Confirmation de votre commande - Vanille Or",

        html: `
          <div style="font-family: Arial, sans-serif; background:#f9fafb; padding:40px;">
            
            <div style="max-width:600px; margin:0 auto; background:white; padding:30px; border-radius:12px;">

              <h1 style="text-align:center; margin-bottom:10px;">
                Vanille Or
              </h1>

              <h2 style="text-align:center; margin-bottom:20px;">
                Merci pour votre commande ✨
              </h2>

              <p style="text-align:center; color:#555;">
                Votre paiement a bien été confirmé.
              </p>

              <hr style="margin:30px 0;" />

              <h3>Détails de votre commande :</h3>

              <ul style="padding-left:20px;">
                ${lineItems.data
                  .map(
                    (item) => `
                    <li>
                      ${item.description || "Produit"} x ${
                      item.quantity || 1
                    }
                    </li>
                  `
                  )
                  .join("")}
              </ul>

              <p style="margin-top:20px;">
                <strong>Total :</strong> ${(
                  (session.amount_total || 0) / 100
                ).toFixed(2)} €
              </p>

              <hr style="margin:30px 0;" />

              <p style="text-align:center; font-size:14px; color:#777;">
                Livraison rapide • Qualité premium • Vanille d'exception
              </p>

            </div>

          </div>
        `,
      });

      console.log("✅ Email envoyé avec succès");
    } catch (err) {
      console.error("❌ Erreur envoi email:", err);
    }
  }

  return NextResponse.json({ received: true });
}