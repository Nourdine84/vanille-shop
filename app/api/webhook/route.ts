import Stripe from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { Resend } from "resend";

export const runtime = "nodejs";

/* =========================
   INIT
========================= */

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
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

    /* =========================
       ✅ CHECKOUT SUCCESS
    ========================= */
    if (event.type === "checkout.session.completed") {
      const { prisma } = await import("@/lib/prisma"); // ✅ FIX CRITIQUE

      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        console.error("❌ Missing orderId in metadata");
        return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
      }

      /* =========================
         🔒 ID EMPOTENCE
      ========================= */
      const existingOrder = await prisma.order.findUnique({
        where: { id: orderId },
      });

      if (!existingOrder) {
        console.error("❌ Order not found:", orderId);
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      if (existingOrder.status === "PAID") {
        console.log("⚠️ Order already processed:", orderId);
        return NextResponse.json({ received: true });
      }

      /* =========================
         🔄 UPDATE ORDER
      ========================= */
      const order = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          stripePaymentId: session.payment_intent as string,
        },
      });

      console.log("✅ ORDER PAID:", order.id);

      /* =========================
         📧 EMAIL CLIENT
      ========================= */
      const email = session.customer_details?.email;

      if (email && order.items) {
        await sendOrderConfirmationEmail({
          to: email,
          orderId: order.id,
          items: order.items as any,
          totalCents: order.totalCents,
        });

        console.log("📧 CLIENT EMAIL SENT:", email);
      } else {
        console.warn("⚠️ No email or items for order:", order.id);
      }

      /* =========================
         📧 EMAIL ADMIN
      ========================= */
      await sendAdminNotification(order, session);
    } else {
      console.log("ℹ️ Ignored event:", event.type);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("🔥 WEBHOOK ERROR:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}

/* =========================
   📧 ADMIN EMAIL
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
        <div style="font-family:Arial,Helvetica,sans-serif;background:#faf7f2;padding:30px;">
          <div style="max-width:600px;margin:auto;background:white;padding:30px;border-radius:16px;">

            <h1 style="margin:0 0 20px 0;color:#a16207;">
              Vanille’Or
            </h1>

            <h2 style="margin:0 0 15px 0;">
              Nouvelle commande 💰
            </h2>

            <p><strong>ID :</strong> ${order.id}</p>

            <p><strong>Total :</strong> ${total} €</p>

            <p><strong>Email client :</strong> ${
              session.customer_details?.email || "-"
            }</p>

            <div style="margin-top:20px;padding:15px;background:#fffaf1;border-radius:12px;">
              <p style="margin:0;">Commande prête à être traitée</p>
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