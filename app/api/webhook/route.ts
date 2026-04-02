import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { Resend } from "resend";

export const runtime = "nodejs";

/* =========================
   INIT SAFE
========================= */

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("❌ STRIPE_SECRET_KEY manquante");
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("❌ STRIPE_WEBHOOK_SECRET manquant");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

/* =========================
   WEBHOOK
========================= */

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
      console.error("❌ Signature error:", err.message);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log("📡 EVENT:", event.type);

    /* =========================
       💰 CHECKOUT SUCCESS
    ========================= */
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        console.error("❌ Missing orderId");
        return NextResponse.json({ received: true });
      }

      /* =========================
         FETCH ORDER
      ========================= */
      const existingOrder = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!existingOrder) {
        console.error("❌ Order not found:", orderId);
        return NextResponse.json({ received: true });
      }

      /* =========================
         IDEMPOTENCE
      ========================= */
      if (existingOrder.status === "PAID") {
        console.log("⚠️ Already processed:", orderId);
        return NextResponse.json({ received: true });
      }

      /* =========================
         UPDATE ORDER
      ========================= */
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

      /* =========================
         SAFE PARSE ITEMS
      ========================= */
      let items: any[] = [];

      if (Array.isArray(order.items)) {
        items = order.items;
      } else {
        console.warn("⚠️ Invalid items format:", order.items);
      }

      /* =========================
         UPDATE STOCK
      ========================= */
      try {
        for (const item of items) {
          const cleanId = item.id?.split("-")[0];

          if (!cleanId) continue;

          await prisma.product.update({
            where: { id: cleanId },
            data: {
              stock: {
                decrement: Number(item.quantity) || 1,
              },
            },
          });
        }

        console.log("📦 STOCK UPDATED");
      } catch (err) {
        console.error("❌ STOCK ERROR:", err);
      }

      /* =========================
         FORMAT ITEMS (TS SAFE)
      ========================= */
      const formattedItems = items.map((item: any) => ({
        id: item.id || "",
        name: item.name || "Produit",
        quantity: Number(item.quantity) || 1,
        priceCents: Number(item.priceCents) || 0,
      }));

      /* =========================
         FIX NULL TYPES
      ========================= */
      const trackingNumber =
        order.trackingNumber === null ? undefined : order.trackingNumber;

      const carrier =
        order.carrier === null ? undefined : order.carrier;

      /* =========================
         EMAIL CLIENT
      ========================= */
      const email = session.customer_details?.email;

      if (email && formattedItems.length > 0) {
        try {
          await sendOrderConfirmationEmail({
            to: email,
            orderId: order.id,
            items: formattedItems,
            totalCents: order.totalCents,
            trackingNumber,
            carrier,
          });

          console.log("📧 CLIENT EMAIL SENT:", email);
        } catch (err) {
          console.error("❌ EMAIL CLIENT ERROR:", err);
        }
      }

      /* =========================
         EMAIL ADMIN
      ========================= */
      await sendAdminNotification(order, session);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("🔥 WEBHOOK ERROR:", error);

    return NextResponse.json(
      { error: "Webhook error" },
      { status: 500 }
    );
  }
}

/* =========================
   ADMIN EMAIL
========================= */

async function sendAdminNotification(
  order: any,
  session: Stripe.Checkout.Session
) {
  try {
    const total = (order.totalCents / 100)
      .toFixed(2)
      .replace(".", ",");

    await resend.emails.send({
      from:
        process.env.RESEND_FROM_EMAIL ||
        "Vanille’Or <onboarding@resend.dev>",

      to: process.env.ADMIN_EMAIL || "contact@vanilleor.com",

      subject: `💰 Nouvelle commande — ${order.id.slice(0, 8)}`,

      html: `
        <div style="font-family:Arial;background:#faf7f2;padding:30px;">
          <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:16px;">
            
            <h1 style="color:#a16207;margin-bottom:20px;">
              Vanille’Or
            </h1>

            <h2>Nouvelle commande 💰</h2>

            <p><strong>ID :</strong> ${order.id}</p>
            <p><strong>Total :</strong> ${total} €</p>
            <p><strong>Email :</strong> ${
              session.customer_details?.email || "-"
            }</p>

            <div style="margin-top:20px;padding:15px;background:#fffaf1;border-radius:12px;">
              <p style="margin:0;">Commande prête à traiter</p>
            </div>

          </div>
        </div>
      `,
    });

    console.log("📧 ADMIN EMAIL SENT");

  } catch (error) {
    console.error("❌ ADMIN EMAIL ERROR:", error);
  }
}