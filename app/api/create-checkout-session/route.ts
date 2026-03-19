import Stripe from "stripe";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("🛒 CART:", body.cart);

    // 🔒 Sécurité : vérifier le panier
    if (!body.cart || !Array.isArray(body.cart) || body.cart.length === 0) {
      console.error("❌ CART VIDE");
      return NextResponse.json(
        { error: "Panier vide" },
        { status: 400 }
      );
    }

    // 🔄 Transformer les items pour Stripe
    const lineItems = body.cart.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
        },
        unit_amount: item.priceCents,
      },
      quantity: item.quantity,
    }));

    // 💳 Création session Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",

      // ✅ FIX URL (IMPORTANT)
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/checkout",

      // 💎 BONUS UX
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["FR", "BE", "CH"],
      },
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error("🔥 STRIPE ERROR:", error);

    return NextResponse.json(
      { error: "Erreur Stripe" },
      { status: 500 }
    );
  }
}