import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { sendOrderEmail } from "@/lib/email";
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
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("💰 PAYMENT SUCCESS:", session.id);

    try {
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      const items = lineItems.data.map((item) => ({
        name: item.description || "Produit",
        quantity: item.quantity || 1,
        priceCents: item.amount_total || 0,
      }));

      const totalCents = items.reduce(
        (acc, item) => acc + item.priceCents,
        0
      );

      const customerEmail =
        session.customer_details?.email || "tn.smok@hotmail.fr";

      // 🔥 ENREGISTREMENT DB (CRITIQUE)
      await prisma.order.create({
        data: {
          stripeSessionId: session.id,
          stripePaymentId: session.payment_intent as string,
          email: customerEmail,
          status: "PAID",
          totalCents,
          items: items as any, // ✅ JSON safe
        },
      });

      console.log("💾 ORDER SAVED");

      // 🔥 EMAIL
      await sendOrderEmail({
        to: customerEmail,
        items,
        totalCents,
      });

      console.log("📧 EMAIL SENT");

    } catch (error) {
      console.error("❌ PROCESS ERROR:", error);
    }
  }

  return NextResponse.json({ received: true });
}