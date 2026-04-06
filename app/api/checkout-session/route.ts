import Stripe from "stripe";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/* =========================
   INIT STRIPE
========================= */

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("❌ STRIPE_SECRET_KEY manquante");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20" as any,
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

type CheckoutBody = {
  cart?: CartItem[];
  items?: CartItem[];
};

/* =========================
   HELPERS
========================= */

function getBaseUrl(req: Request) {
  const origin = req.headers.get("origin");

  if (origin) return origin;
  if (process.env.NEXT_PUBLIC_URL) return process.env.NEXT_PUBLIC_URL;
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;

  return "http://localhost:3000";
}

function isValidCartItem(item: unknown): item is CartItem {
  if (!item || typeof item !== "object") return false;

  const candidate = item as Partial<CartItem>;

  return (
    typeof candidate.id === "string" &&
    candidate.id.trim().length > 0 &&
    typeof candidate.name === "string" &&
    candidate.name.trim().length > 0 &&
    typeof candidate.priceCents === "number" &&
    Number.isFinite(candidate.priceCents) &&
    candidate.priceCents > 0 &&
    typeof candidate.quantity === "number" &&
    Number.isFinite(candidate.quantity) &&
    candidate.quantity > 0
  );
}

function normalizeCart(rawItems: unknown): CartItem[] {
  if (!Array.isArray(rawItems)) return [];

  return rawItems
    .filter(isValidCartItem)
    .map((item) => ({
      id: item.id,
      name: item.name.trim(),
      priceCents: Math.round(item.priceCents),
      quantity: Math.max(1, Math.floor(item.quantity)),
      imageUrl:
        typeof item.imageUrl === "string" && item.imageUrl.trim()
          ? item.imageUrl.trim()
          : undefined,
    }));
}

/* =========================
   POST
========================= */

export async function POST(req: Request) {
  try {
    /* 🔥 SAFE BUILD VERCEL */
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return NextResponse.json({ ok: true });
    }

    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type invalide. JSON requis." },
        { status: 400 }
      );
    }

    const prisma = (await import("@/lib/prisma")).prisma;

    const body = (await req.json()) as CheckoutBody;

    const cart = normalizeCart(body.cart ?? body.items);

    if (cart.length === 0) {
      return NextResponse.json(
        { error: "Panier vide ou invalide" },
        { status: 400 }
      );
    }

    const baseUrl = getBaseUrl(req);

    /* =========================
       TOTALS
    ========================= */

    const subtotal = cart.reduce(
      (acc, item) => acc + item.priceCents * item.quantity,
      0
    );

    const shippingCost = subtotal >= 5000 ? 0 : 490;
    const total = subtotal + shippingCost;

    /* =========================
       CREATE ORDER (FIX JSON)
    ========================= */

    const order = await prisma.order.create({
      data: {
        status: "PENDING",
        totalCents: total,
        currency: "EUR",
        items: JSON.parse(JSON.stringify(cart)), // ✅ FIX CRITIQUE
      },
    });

    /* =========================
       STRIPE LINE ITEMS (FIX PAYLOAD)
    ========================= */

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      cart.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name, // ✅ PAS D'IMAGE → FIX 500
          },
          unit_amount: item.priceCents,
        },
        quantity: item.quantity,
      }));

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
       STRIPE SESSION
    ========================= */

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,

      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?error=1`,

      metadata: {
        orderId: order.id,
      },
    });

    /* =========================
       UPDATE ORDER
    ========================= */

    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripeSessionId: session.id,
      },
    });

    return NextResponse.json({
      url: session.url,
      orderId: order.id,
    });

  } catch (error: any) {
    console.error("🔥 STRIPE ERROR:", error);

    return NextResponse.json(
      {
        error: "Erreur Stripe",
        message: error?.message || "unknown",
      },
      { status: 500 }
    );
  }
}