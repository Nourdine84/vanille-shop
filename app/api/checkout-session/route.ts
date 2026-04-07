import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/* =========================
   INIT STRIPE
========================= */

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("❌ STRIPE_SECRET_KEY manquante");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
};

/* =========================
   HELPERS
========================= */

function getBaseUrl(req: Request) {
  const origin = req.headers.get("origin");

  if (origin) return origin;

  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL;
  }

  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  return "http://localhost:3000";
}

function getSafeProductId(rawId: string) {
  return rawId.trim();
}

function getSafeImageUrl(baseUrl: string, imageUrl?: string) {
  if (!imageUrl || imageUrl.trim() === "") {
    return `${baseUrl}/images/default.jpg`;
  }

  const clean = imageUrl.trim();

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  if (clean.startsWith("/")) {
    return `${baseUrl}${clean}`;
  }

  return `${baseUrl}/images/${clean}`;
}

function isValidCartItem(item: any): item is CartItem {
  return (
    item &&
    typeof item.id === "string" &&
    item.id.trim() !== "" &&
    typeof item.name === "string" &&
    item.name.trim() !== "" &&
    typeof item.priceCents === "number" &&
    Number.isFinite(item.priceCents) &&
    item.priceCents > 0 &&
    typeof item.quantity === "number" &&
    Number.isFinite(item.quantity) &&
    item.quantity > 0
  );
}

/* =========================
   POST CHECKOUT
========================= */

export async function POST(req: Request) {
  try {
    let body: CheckoutBody;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
    }

    if (!body.cart || !Array.isArray(body.cart) || body.cart.length === 0) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    const cart = body.cart.filter(isValidCartItem);

    if (cart.length === 0) {
      return NextResponse.json(
        { error: "Panier invalide" },
        { status: 400 }
      );
    }

    const baseUrl = getBaseUrl(req);

    /* =========================
       VALIDATION PRODUITS DB
    ========================= */

    for (const item of cart) {
      const productId = getSafeProductId(item.id);

      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Produit introuvable : ${item.name}` },
          { status: 404 }
        );
      }

      if (!product.isActive) {
        return NextResponse.json(
          { error: `Produit inactif : ${item.name}` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuffisant pour ${item.name}` },
          { status: 400 }
        );
      }

      if (product.priceCents !== item.priceCents) {
        return NextResponse.json(
          { error: `Prix invalide pour ${item.name}` },
          { status: 400 }
        );
      }
    }

    /* =========================
       CALCUL PRIX
    ========================= */

    const subtotal = cart.reduce(
      (acc, item) => acc + item.priceCents * item.quantity,
      0
    );

    const freeShippingThreshold = 5000;
    const shippingCost = subtotal >= freeShippingThreshold ? 0 : 490;
    const total = subtotal + shippingCost;

    /* =========================
       CREATE ORDER
    ========================= */

    const order = await prisma.order.create({
      data: {
        status: "PENDING",
        totalCents: total,
        currency: "EUR",
        items: cart,
      },
    });

    /* =========================
       STRIPE LINE ITEMS
    ========================= */

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.map(
      (item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            description: "Vanille premium de Madagascar — Vanille’Or",
            images: [getSafeImageUrl(baseUrl, item.imageUrl)],
          },
          unit_amount: item.priceCents,
        },
        quantity: item.quantity,
      })
    );

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
       CREATE STRIPE SESSION
    ========================= */

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout?error=1`,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["FR", "BE", "CH"],
      },
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        orderId: order.id,
        source: "vanilleor-shop",
      },
    });

    /* =========================
       LINK ORDER TO SESSION
    ========================= */

    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripeSessionId: session.id,
      },
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      orderId: order.id,
    });
  } catch (error: any) {
    console.error("🔥 STRIPE FULL ERROR:", error);

    return NextResponse.json(
      {
        error: error?.message || "Erreur Stripe",
      },
      { status: 500 }
    );
  }
}

/* =========================
   GET DEBUG
========================= */

export async function GET() {
  return NextResponse.json({
    message: "API checkout OK",
    env: !!process.env.STRIPE_SECRET_KEY,
  });
}