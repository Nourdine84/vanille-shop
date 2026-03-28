import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail } from "@/lib/email";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

type OrderItem = {
  id?: string;
  name: string;
  quantity: number;
  priceCents: number;
};

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature!, endpointSecret);
  } catch (err: any) {
    console.error("❌ Signature invalide:", err.message);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId;

        if (!orderId) break;

        const order = await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "PAID",
            email: session.customer_details?.email ?? undefined,
          },
        });

        console.log("✅ ORDER PAID:", orderId);

        // 🔥 STOCK MANAGEMENT
        const items = Array.isArray(order.items)
          ? (order.items as unknown as OrderItem[])
          : [];

        for (const item of items) {
          if (!item.id) continue;

          await prisma.product.update({
            where: { id: item.id },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }

        console.log("📦 STOCK UPDATED");

        // 📧 EMAIL
        if (order.email) {
          await sendOrderConfirmationEmail({
            to: order.email,
            orderId: order.id,
            items,
            totalCents: order.totalCents,
          });
        }

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("🔥 WEBHOOK ERROR:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}