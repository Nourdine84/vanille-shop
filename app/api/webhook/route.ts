import Stripe from "stripe";
import { NextResponse } from "next/server";
import { sendOrderEmail } from "../../../lib/email";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error("❌ Webhook signature error:", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  // 💰 PAIEMENT VALIDÉ
  if (event.type === "checkout.session.completed") {
    const session: any = event.data.object;

    console.log("💰 PAYMENT SUCCESS");

    const email = session.customer_email;

    const cart = JSON.parse(session.metadata?.cart || "[]");

    const total = session.amount_total;

    if (email && cart.length > 0) {
      await sendOrderEmail({
        to: email,
        items: cart,
        totalCents: total,
      });
    } else {
      console.error("❌ EMAIL OU PANIER MANQUANT");
    }
  }

  return NextResponse.json({ received: true });
}

