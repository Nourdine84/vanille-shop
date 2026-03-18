import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import Stripe from "stripe";
import { sendOrderEmail } from "../../../lib/email";

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("Variables Stripe manquantes");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      throw new Error("Signature Stripe absente");
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("📦 Event:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("✅ PAYMENT:", session.id);
      console.log("📧 Email Stripe:", session.customer_details?.email);

      const existing = await prisma.order.findUnique({
        where: { stripeSessionId: session.id },
      });

      if (existing) {
        console.log("⚠️ Déjà traité");
        return NextResponse.json({ received: true });
      }

      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      const items = lineItems.data.map((item) => ({
        name: item.description,
        quantity: item.quantity,
        priceCents: item.amount_subtotal,
      }));

      const userId = session.metadata?.userId || null;

      await prisma.order.create({
        data: {
          userId,
          stripeSessionId: session.id,
          stripePaymentId: session.payment_intent as string,
          totalCents: session.amount_total || 0,
          currency: session.currency || "EUR",
          status: "PAID",
          items,
        },
      });

      const customerEmail =
        session.customer_details?.email || "msanourdine@hotmail.com";

      await sendOrderEmail({
        to: customerEmail,
        items,
        totalCents: session.amount_total || 0,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ WEBHOOK ERROR:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
