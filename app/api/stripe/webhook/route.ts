import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendCustomerOrderEmail,
  sendAdminOrderEmail,
} from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

function parseItems(items: any) {
  try {
    if (!items) return [];
    if (typeof items === "string") return JSON.parse(items);
    if (Array.isArray(items)) return items;
    return [];
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (error: any) {
      console.error("❌ STRIPE WEBHOOK SIGNATURE ERROR:", error.message);
      return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
    }

    if (event.type !== "checkout.session.completed") {
      return NextResponse.json({ received: true });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      return NextResponse.json({ error: "orderId manquant" }, { status: 400 });
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    }

    if (existingOrder.status === "PAID") {
      return NextResponse.json({ received: true, alreadyPaid: true });
    }

    const customerEmail =
      session.customer_details?.email ||
      existingOrder.email ||
      null;

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        email: customerEmail,
        stripePaymentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id || null,
      },
    });

    const items = parseItems(updatedOrder.items);

    await Promise.all(
      items.map(async (item: any) => {
        const productId = item?.id?.split("-")[0];
        if (!productId) return;

        await prisma.product.update({
          where: { id: productId },
          data: {
            stock: {
              decrement: Math.max(1, Number(item.quantity) || 1),
            },
          },
        });
      })
    );

    if (customerEmail) {
      await sendCustomerOrderEmail({
        to: customerEmail,
        orderId: updatedOrder.id,
        totalCents: updatedOrder.totalCents,
        items,
      });
    }

    await sendAdminOrderEmail({
      orderId: updatedOrder.id,
      customerEmail,
      totalCents: updatedOrder.totalCents,
      items,
    });

    console.log("✅ STRIPE ORDER PAID:", updatedOrder.id);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("🔥 STRIPE WEBHOOK ERROR:", error);

    return NextResponse.json(
      { error: "Erreur webhook Stripe" },
      { status: 500 }
    );
  }
}