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
      // 🔥 récupérer ligne items Stripe
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      const items = lineItems.data.map((item) => ({
        name: item.description || "Produit",
        quantity: item.quantity || 1,
        priceCents: item.amount_total || 0, // déjà total ligne
      }));

      const totalCents = items.reduce(
        (acc: number, item) => acc + item.priceCents,
        0
      );

      const customerEmail =
        session.customer_details?.email || null;

      // 🔥 UPDATE si existe / sinon CREATE
      const existingOrder = await prisma.order.findFirst({
        where: {
          stripeSessionId: session.id,
        },
      });

      if (existingOrder) {
        // UPDATE
        await prisma.order.update({
          where: { id: existingOrder.id },
          data: {
            status: "PAID",
            email: customerEmail,
          },
        });

        console.log("🔄 ORDER UPDATED");
      } else {
        // CREATE fallback
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

        console.log("💾 ORDER CREATED (fallback)");
      }

      // 📧 EMAIL CLIENT
      if (customerEmail) {
        await sendOrderEmail({
          to: customerEmail,
          items,
          totalCents,
        });

        console.log("📧 EMAIL SENT");
      }

    } catch (error) {
      console.error("❌ WEBHOOK PROCESS ERROR:", error);
    }
  }

  return NextResponse.json({ received: true });
}