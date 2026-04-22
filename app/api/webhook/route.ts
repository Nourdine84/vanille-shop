import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  sendCustomerOrderEmail,
  sendAdminOrderEmail,
} from "@/lib/email";

export const runtime = "nodejs";

/* ================= INIT ================= */

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY manquante");
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("STRIPE_WEBHOOK_SECRET manquant");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ================= WEBHOOK ================= */

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature");

    if (!signature) {
      console.error("❌ Missing Stripe signature");
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
      console.error("❌ Signature verification failed:", err.message);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log("📡 EVENT:", event.type);

    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(
        event.data.object as Stripe.Checkout.Session
      );
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("🔥 WEBHOOK GLOBAL ERROR:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

/* ================= HANDLER ================= */

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
) {
  try {
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      console.error("❌ Missing orderId");
      return;
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      console.error("❌ Order not found:", orderId);
      return;
    }

    if (existingOrder.status === "PAID") {
      console.log("⚠️ Already processed:", orderId);
      return;
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        stripePaymentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id,
      },
    });

    console.log("✅ ORDER PAID:", order.id);

    /* ================= ITEMS RAW ================= */

    let items: any[] = [];

    try {
      items =
        typeof order.items === "string"
          ? JSON.parse(order.items)
          : order.items || [];
    } catch {
      items = [];
    }

    /* ================= STOCK ================= */

    await Promise.all(
      items.map(async (item) => {
        const cleanId = item?.id?.split("-")[0];
        if (!cleanId) return;

        await prisma.product.update({
          where: { id: cleanId },
          data: {
            stock: {
              decrement: Math.max(1, Number(item.quantity) || 1),
            },
          },
        });
      })
    );

    console.log("📦 STOCK UPDATED");

    /* ================= FORMAT PREMIUM (🔥 IMPORTANT) ================= */

    const formattedItems = items.map((item: any) => ({
      id: item?.id || "",
      name: item?.name || "Produit",
      quantity: Number(item?.quantity) || 1,
      priceCents: Number(item?.priceCents) || 0,

      // 🔥 NOUVEAU → enrichissement email
      imageUrl: item?.imageUrl || "",
      description: item?.description || "",
      format: item?.format || "",
    }));

    /* ================= EMAIL ================= */

    const email = session.customer_details?.email;

    console.log("📧 EMAIL CLIENT:", email);

    /* ===== CLIENT ===== */

    if (email) {
      try {
        const res = await sendCustomerOrderEmail({
          to: email,
          orderId: order.id,
          totalCents: order.totalCents,
          items: formattedItems,
        });

        console.log("📧 CLIENT EMAIL RESULT:", res);

      } catch (err) {
        console.error("❌ CLIENT EMAIL ERROR:", err);
      }
    } else {
      console.warn("⚠️ Aucun email client détecté");
    }

    /* ===== ADMIN ===== */

    try {
      const resAdmin = await sendAdminOrderEmail({
        orderId: order.id,
        customerEmail: email,
        totalCents: order.totalCents,
        items: formattedItems,
      });

      console.log("📧 ADMIN EMAIL RESULT:", resAdmin);

    } catch (err) {
      console.error("❌ ADMIN EMAIL ERROR:", err);
    }

  } catch (error) {
    console.error("🔥 HANDLER ERROR:", error);
  }
}