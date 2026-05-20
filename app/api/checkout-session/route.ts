import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

/* ================= TYPES ================= */

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

/* ================= HELPERS ================= */

function getBaseUrl(req: Request) {
  const origin = req.headers.get("origin");

  if (origin) return origin;
  if (process.env.NEXT_PUBLIC_URL) return process.env.NEXT_PUBLIC_URL;
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;

  return "http://localhost:3000";
}

function getSafeImageUrl(baseUrl: string, imageUrl?: string) {
  if (!imageUrl || imageUrl.trim() === "") {
    return `${baseUrl}/images/default.jpg`;
  }

  if (imageUrl.startsWith("http")) return imageUrl;
  if (imageUrl.startsWith("/")) return `${baseUrl}${imageUrl}`;

  return `${baseUrl}/images/${imageUrl}`;
}

function isValidCartItem(item: any): item is CartItem {
  return (
    item &&
    typeof item.id === "string" &&
    item.id.trim() !== "" &&
    typeof item.name === "string" &&
    typeof item.priceCents === "number" &&
    Number.isFinite(item.priceCents) &&
    item.priceCents > 0 &&
    typeof item.quantity === "number" &&
    Number.isFinite(item.quantity) &&
    item.quantity > 0
  );
}

/* ================= POST ================= */

export async function POST(req: Request) {
  try {
    let body: CheckoutBody;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "JSON invalide" },
        { status: 400 }
      );
    }

    if (!body.cart || !Array.isArray(body.cart)) {
      return NextResponse.json(
        { error: "Panier invalide" },
        { status: 400 }
      );
    }

    const cart = body.cart.filter(isValidCartItem);

    if (cart.length === 0) {
      return NextResponse.json(
        { error: "Panier vide" },
        { status: 400 }
      );
    }

    console.log("🛒 CART RECEIVED:", cart);

    const baseUrl = getBaseUrl(req);

    /* ================= VALIDATION DB ================= */

    const validatedItems: CartItem[] = [];

    for (const item of cart) {
      try {
        const productId = item.id.split("-")[0];

        const product = await prisma.product.findUnique({
          where: { id: productId },
        });

        if (!product) {
          console.warn("⚠️ Produit introuvable ignoré:", item.id);
          continue;
        }

        if (!product.isActive) {
          console.warn("⚠️ Produit inactif:", item.id);
          continue;
        }

        if (product.stock < item.quantity) {
          console.error("❌ STOCK INSUFFISANT:", {
            productId: product.id,
            stock: product.stock,
            requested: item.quantity,
          });
        
          return NextResponse.json(
            { error: `Stock insuffisant pour ${product.name}` },
            { status: 400 }
          );
        }

        if (product.priceCents !== item.priceCents) {
          console.warn("⚠️ Prix mismatch:", item.id);
          continue;
        }

        validatedItems.push(item);
      } catch (err) {
        console.error("❌ DB ERROR ITEM:", item.id, err);
      }
    }

    if (validatedItems.length === 0) {
      return NextResponse.json(
        { error: "Aucun produit valide" },
        { status: 400 }
      );
    }

    /* ================= PRIX ================= */

    const subtotal = validatedItems.reduce(
      (acc, item) => acc + item.priceCents * item.quantity,
      0
    );

    const shippingCost = subtotal >= 5000 ? 0 : 490;
    const total = subtotal + shippingCost;

    /* ================= USER SESSION ================= */

    const cookieHeader = req.headers.get("cookie") || "";

    const sessionCookie = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("vanille_or_user="));

    const userId = sessionCookie
      ? sessionCookie.split("=")[1]
      : null;

    console.log("👤 USER SESSION:", userId);

    /* ================= ORDER ================= */

    const order = await prisma.order.create({
      data: {
        userId: userId || undefined,

        status: "PENDING",
        totalCents: total,
        currency: "EUR",

        items: JSON.stringify(validatedItems),
      },
    });

    /* ================= STRIPE ================= */

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      validatedItems.map((item) => ({
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
      }));

    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: "Frais de livraison" },
          unit_amount: shippingCost,
        },
        quantity: 1,
      });
    }

    console.log("💳 STRIPE CALL...");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
    
      locale: "fr",
    
      submit_type: "pay",
    
      customer_creation: "always",
    
      payment_method_types: ["card"],
    
      line_items: lineItems,
    
      success_url:
        `${baseUrl}/checkout/success` +
        `?session_id={CHECKOUT_SESSION_ID}` +
        `&order=${order.id}`,
    
      cancel_url:
        `${baseUrl}/checkout?canceled=1`,
    
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

    console.log("✅ STRIPE SESSION:", session.id);

    /* ================= LINK ================= */

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      orderId: order.id,
    });

  } catch (error: any) {
    console.error("🔥 GLOBAL CHECKOUT ERROR:", error);

    return NextResponse.json(
      { error: error?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}

/* ================= DEBUG ================= */

export async function GET() {
  return NextResponse.json({
    ok: true,
    stripe: !!process.env.STRIPE_SECRET_KEY,
  });
}