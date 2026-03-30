import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("❌ Signature error:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const orderId = session.metadata?.orderId;

      if (!orderId) {
        console.error("❌ orderId missing");
        return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
      }

      // ✅ UPDATE ORDER
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          stripePaymentId: session.payment_intent as string,
        },
      });

      console.log("✅ ORDER PAID:", order.id);

      /* =========================
         📧 EMAIL CLIENT
      ========================= */

      const email = session.customer_details?.email;

      if (email) {
        await resend.emails.send({
          from: "Vanille’Or <onboarding@resend.dev>",
          to: email,
          subject: "Confirmation de votre commande",
          html: `
            <h2>Merci pour votre commande 🙏</h2>
            <p>Votre commande a bien été confirmée.</p>

            <p><strong>Montant :</strong> ${(session.amount_total! / 100).toFixed(2)} €</p>

            <p>Nous préparons votre colis 🚚</p>

            <br/>
            <p>— Vanille’Or</p>
          `,
        });

        console.log("📧 Email client envoyé");
      }

      /* =========================
         📧 EMAIL ADMIN
      ========================= */

      await resend.emails.send({
        from: "Vanille’Or <onboarding@resend.dev>",
        to: "msanourdine@hotmail.fr",
        subject: "Nouvelle commande reçue 💰",
        html: `
          <h2>Nouvelle commande</h2>
          <p>ID: ${order.id}</p>
          <p>Montant: ${(session.amount_total! / 100).toFixed(2)} €</p>
        `,
      });

      console.log("📧 Email admin envoyé");
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("🔥 WEBHOOK ERROR:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}