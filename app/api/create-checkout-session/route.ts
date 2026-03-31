import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/* =========================
   INIT STRIPE (SAFE)
========================= */
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("❌ STRIPE_SECRET_KEY manquante");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* =========================
   BASE URL SAFE
========================= */
function getBaseUrl(req: Request) {
  const origin = req.headers.get("origin");

  if (origin) return origin;

  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL;
  }

  return "http://localhost:3000";
}

/* =========================
   POST CHECKOUT
========================= */
export async function POST(req: Request) {
  try {
    /* =========================
       SAFE JSON PARSE
    ========================= */
    let body: any;

    try {
      body = await req.json();
    } catch {
      console.error("❌ JSON invalide");
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    console.log("🧾 BODY:", body);

    /* =========================
       VALIDATION PANIER
    ========================= */
    if (!body.cart || !Array.isArray(body.cart) || body.cart.length === 0) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    const baseUrl = getBaseUrl(req);

    /* =========================
       VALIDATION PRODUITS
    ========================= */
    for (const item of body.cart) {
      if (!item.id || !item.priceCents || !item.quantity) {
        return NextResponse.json(
          { error: "Produit invalide" },
          { status: 400 }
        );
      }

      const cleanId = item.id.split("-")[0]; // 🔥 gestion variantes

      const product = await prisma.product.findUnique({
        where: { id: cleanId },
      });

      if (!product) {
        console.error("❌ Produit introuvable:", cleanId);
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
    }

    /* =========================
       CALCUL PRIX
    ========================= */
    const subtotal = body.cart.reduce(
      (acc: number, item: any) =>
        acc + item.priceCents * item.quantity,
      0
    );

    const freeShippingThreshold = 5000;
    const shippingCost = subtotal >= freeShippingThreshold ? 0 : 490;
    const total = subtotal + shippingCost;

    console.log("💰 TOTAL:", total);

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

    console.log("🧾 ORDER CREATED:", order.id);

    /* =========================
       STRIPE LINE ITEMS (FIX IMAGE URL)
    ========================= */
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      body.cart.map((item: any) => {
        const imageUrl = item.imageUrl?.startsWith("http")
          ? item.imageUrl
          : `${baseUrl}${item.imageUrl || "/images/product-vanille.jpg"}`;

        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: item.name,
              description: "Vanille premium de Madagascar — Vanille’Or",
              images: [imageUrl], // 🔥 FIX CRITIQUE STRIPE
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

    console.log("💳 STRIPE SESSION:", session.id);

    /* =========================
       LINK ORDER
    ========================= */
    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripeSessionId: session.id,
      },
    });

    console.log("✅ READY TO PAY:", session.url);

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("🔥 STRIPE FULL ERROR:");
    console.error(error);
    console.error("MESSAGE:", error?.message);
    console.error("TYPE:", error?.type);

    return NextResponse.json(
      { error: error?.message || "Erreur Stripe" },
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