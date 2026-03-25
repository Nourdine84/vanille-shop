import Stripe from "stripe";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// 🔥 URL dynamique (DEV + PROD)
const getBaseUrl = (req: Request) => {
  const origin = req.headers.get("origin");
  return origin || "http://localhost:3001";
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("🛒 CART:", body.cart);

    // 🔒 VALIDATION
    if (!body.cart || !Array.isArray(body.cart) || body.cart.length === 0) {
      console.error("❌ CART VIDE");
      return NextResponse.json(
        { error: "Panier vide" },
        { status: 400 }
      );
    }

    const baseUrl = getBaseUrl(req);

    // 💰 CALCUL TOTAL
    const subtotal = body.cart.reduce(
      (acc: number, item: any) =>
        acc + item.priceCents * item.quantity,
      0
    );

    // 🚚 LIVRAISON
    const freeShippingThreshold = 5000;
    const shippingCost = subtotal >= freeShippingThreshold ? 0 : 490;

    // 🔄 MAPPING PRODUITS
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      body.cart.map((item: any) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            description: "Vanille premium de Madagascar — Vanille’Or",
            images: [
              item.imageUrl || `${baseUrl}/images/product-vanille.jpg`,
            ],
          },
          unit_amount: item.priceCents,
        },
        quantity: item.quantity,
      }));

    // 🚚 AJOUT LIVRAISON (SEULEMENT SI > 0)
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

    // 💳 SESSION STRIPE PREMIUM
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,

      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/checkout`,

      // 💎 UX PREMIUM
      billing_address_collection: "required",

      shipping_address_collection: {
        allowed_countries: ["FR", "BE", "CH"],
      },

      phone_number_collection: {
        enabled: true,
      },

      // 🔥 TRÈS IMPORTANT (future logique backend)
      metadata: {
        source: "vanilleor-shop",
        subtotal: String(subtotal),
        shipping: String(shippingCost),
      },

      custom_text: {
        submit: {
          message: "Paiement sécurisé • Vanille’Or",
        },
      },
    });

    console.log("✅ STRIPE SESSION CREATED");

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error("🔥 STRIPE ERROR:", error);

    return NextResponse.json(
      { error: "Erreur Stripe" },
      { status: 500 }
    );
  }
}