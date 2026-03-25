import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderEmail } from "@/lib/email";

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

  // ✅ PAIEMENT VALIDÉ
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("💰 PAYMENT SUCCESS:", session.id);

    try {
      // 🔥 récupérer produits Stripe
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
        session.customer_details?.email || "N/A";

      // 💾 SAVE EN BASE
      await prisma.order.create({
        data: {
          status: "PAID",
          stripeSessionId: session.id,
          totalCents,
          currency: "EUR",
          email: customerEmail,
          items: items,
        },
      });

      console.log("💾 ORDER SAVED");

      // 📧 EMAIL CLIENT
      if (customerEmail && customerEmail !== "N/A") {
        await sendOrderEmail({
          to: customerEmail,
          items,
          totalCents,
        });
      }

      console.log("📧 EMAIL SENT");
    } catch (error) {
      console.error("❌ ORDER SAVE ERROR:", error);
    }
  }

  return NextResponse.json({ received: true });
}