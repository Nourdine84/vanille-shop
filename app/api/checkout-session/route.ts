import Stripe from "stripe";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/* =========================
   INIT STRIPE FIXED
========================= */

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("❌ STRIPE_SECRET_KEY manquante");
}

// ✅ FIX VERSION (IMPORTANT)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20" as any, // ← FIX TS ERROR
});

/* =========================
   TYPES
========================= */

type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
  imageUrl?: string;
};

/* =========================
   BASE URL
========================= */

function getBaseUrl(req: Request) {
  const origin = req.headers.get("origin");

  if (origin) return origin;
  if (process.env.NEXT_PUBLIC_URL) return process.env.NEXT_PUBLIC_URL;

  return "http://localhost:3000";
}

/* =========================
   POST
========================= */

export async function POST(req: Request) {
  try {
    const prisma = (await import("@/lib/prisma")).prisma;

    const body = await req.json();

    if (!body.cart || body.cart.length === 0) {
      return NextResponse.json(
        { error: "Panier vide" },
        { status: 400 }
      );
    }

    const baseUrl = getBaseUrl(req);

    /* =========================
       TOTAL
    ========================= */

    const subtotal = body.cart.reduce(
      (acc: number, item: CartItem) =>
        acc + item.priceCents * item.quantity,
      0
    );

    const shippingCost = subtotal >= 5000 ? 0 : 490;
    const total = subtotal + shippingCost;

    /* =========================
       CREATE ORDER
    ========================= */

    const order = await prisma.order.create({
      data: {
        status: "PENDING",
        totalCents: total,
        currency: "EUR",
        items: body.cart,
      },
    });

    /* =========================
       STRIPE ITEMS
    ========================= */

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      body.cart.map((item: CartItem) => {
        const imageUrl =
          item.imageUrl?.startsWith("http")
            ? item.imageUrl
            : `${baseUrl}${item.imageUrl || "/images/product-vanille.jpg"}`;

        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: item.name,
              images: [imageUrl],
            },
            unit_amount: item.priceCents,
          },
          quantity: item.quantity,
        };
      });

    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: "Frais de livraison",
          },
          unit_amount: shippingCost,
        },
        quantity: 1,
      });
    }

    /* =========================
       SESSION
    ========================= */

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,

      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,

      metadata: {
        orderId: order.id,
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("🔥 STRIPE ERROR:", error);

    return NextResponse.json(
      { error: error?.message || "Erreur Stripe" },
      { status: 500 }
    );
  }
}
