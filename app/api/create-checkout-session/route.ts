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

    // 🔄 MAPPING PRODUITS
    const lineItems = body.cart.map((item: any) => ({
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

    // 💳 SESSION STRIPE PREMIUM
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,

      // 🔥 REDIRECTION DYNAMIQUE (clé)
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

      // 💰 MARQUE
      custom_text: {
        submit: {
          message: "Paiement sécurisé • Vanille’Or",
        },
      },

      // 📦 FUTUR TRACKING
      metadata: {
        source: "vanilleor-shop",
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