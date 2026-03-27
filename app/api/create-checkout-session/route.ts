import Stripe from "stripe";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const getBaseUrl = (req: Request) => {
  const origin = req.headers.get("origin");
  return origin || process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.cart || !Array.isArray(body.cart) || body.cart.length === 0) {
      return NextResponse.json(
        { error: "Panier vide" },
        { status: 400 }
      );
    }

    const baseUrl = getBaseUrl(req);

    const subtotal = body.cart.reduce(
      (acc: number, item: any) =>
        acc + item.priceCents * item.quantity,
      0
    );

    const freeShippingThreshold = 5000;
    const shippingCost = subtotal >= freeShippingThreshold ? 0 : 490;

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

      // ✅ FIX PRO
      success_url: `${baseUrl}/checkout/success`,
      cancel_url: `${baseUrl}/checkout?error=1`,

      billing_address_collection: "required",

      shipping_address_collection: {
        allowed_countries: ["FR", "BE", "CH"],
      },

      phone_number_collection: {
        enabled: true,
      },

      metadata: {
        source: "vanilleor-shop",
        subtotal: String(subtotal),
        shipping: String(shippingCost),
      },
    });

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error("STRIPE ERROR:", error);

    return NextResponse.json(
      { error: "Erreur Stripe" },
      { status: 500 }
    );
  }
}