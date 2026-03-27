import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

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
  } catch (err) {
    console.error("❌ Webhook signature error:", err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  try {
    // =========================
    // 💳 PAIEMENT VALIDÉ
    // =========================
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("✅ PAYMENT SUCCESS:", session.id);

      const email = session.customer_details?.email || null;

      const subtotal = Number(session.metadata?.subtotal || 0);
      const shipping = Number(session.metadata?.shipping || 0);

      // 🔥 IMPORTANT : récupérer les items Stripe
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      const items = lineItems.data.map((item) => ({
        name: item.description,
        quantity: item.quantity,
        priceCents: item.amount_total
          ? Math.round(item.amount_total / item.quantity!)
          : 0,
      }));

      // 💾 SAVE ORDER
      await prisma.order.create({
        data: {
          email,
          status: "PAID",
          stripeSessionId: session.id,
          totalCents: subtotal + shipping,
          items,
        },
      });

      console.log("📦 ORDER SAVED IN DB");
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("🔥 WEBHOOK ERROR:", error);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}