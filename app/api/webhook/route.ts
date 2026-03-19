import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("❌ Webhook signature error:", err.message);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  // 🎯 Paiement validé
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("✅ Paiement réussi :", session.id);

    const customerEmail = session.customer_details?.email;

    try {
      // 🔥 FIX TEMPORAIRE RESEND (IMPORTANT)
      const result = await resend.emails.send({
        from: "Vanille Or <onboarding@resend.dev>",

        // 🔥 ON FORCE TON EMAIL POUR TEST
        to: "msanourdine@hotmail.com",

        subject: "Confirmation de votre commande",
        html: `
          <h1>Merci pour votre commande 🎉</h1>
          <p>Votre paiement a bien été confirmé.</p>
          <p>Nous préparons votre commande avec soin.</p>
          <br/>
          <p><strong>Vanille Or</strong></p>
        `,
      });

      console.log("📨 RESEND RESULT:", result);
      console.log("📧 Email client initial :", customerEmail);

    } catch (error) {
      console.error("❌ Email error:", error);
    }
  }

  return new NextResponse("OK", { status: 200 });
}