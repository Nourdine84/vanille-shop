import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("❌ STRIPE_SECRET_KEY manquante");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
  imageUrl?: string;
};

function getBaseUrl(req: Request) {
  const origin = req.headers.get("origin");

  if (origin) return origin;

  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL;
  }

  return "http://localhost:3000";
}

function normalizeProductId(rawId: string) {
  if (!rawId) return "";
  return rawId.split("-")[0];
}

export async function POST(req: Request) {
  try {
    let body: { cart?: CartItem[] };

    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const cart = body.cart;

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    const baseUrl = getBaseUrl(req);

    const validatedCart: CartItem[] = [];

    for (const item of cart) {
      if (
        !item ||
        typeof item.id !== "string" ||
        typeof item.name !== "string" ||
        typeof item.priceCents !== "number" ||
        typeof item.quantity !== "number"
      ) {
        return NextResponse.json(
          { error: "Produit invalide" },
          { status: 400 }
        );
      }

      if (item.quantity <= 0 || item.priceCents <= 0) {
        return NextResponse.json(
          { error: `Valeurs invalides pour ${item.name}` },
          { status: 400 }
        );
      }

      const cleanId = normalizeProductId(item.id);

      const product = await prisma.product.findUnique({
        where: { id: cleanId },
      });

      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: `Produit introuvable: ${item.name}` },
          { status: 404 }
        );
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuffisant pour ${item.name}` },
          { status: 400 }
        );
      }

      validatedCart.push({
        id: product.id,
        name: product.name,
        priceCents: product.priceCents,
        quantity: item.quantity,
        imageUrl: item.imageUrl || product.imageUrl,
      });
    }

    const subtotal = validatedCart.reduce(
      (acc, item) => acc + item.priceCents * item.quantity,
      0
    );

    const freeShippingThreshold = 5000;
    const shippingCost = subtotal >= freeShippingThreshold ? 0 : 490;
    const total = subtotal + shippingCost;

    const order = await prisma.order.create({
      data: {
        status: "PENDING",
        totalCents: total,
        currency: "EUR",
        items: validatedCart,
      },
    });

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      validatedCart.map((item) => {
        const resolvedImageUrl =
          item.imageUrl && item.imageUrl.startsWith("http")
            ? item.imageUrl
            : `${baseUrl}${item.imageUrl || "/images/product-vanille.jpg"}`;

        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: item.name,
              description: "Vanille premium de Madagascar — Vanille’Or",
              images: [resolvedImageUrl],
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

    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripeSessionId: session.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("🔥 STRIPE FULL ERROR:", error);

    return NextResponse.json(
      { error: error?.message || "Erreur Stripe" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "API checkout OK",
    env: !!process.env.STRIPE_SECRET_KEY,
  });
}