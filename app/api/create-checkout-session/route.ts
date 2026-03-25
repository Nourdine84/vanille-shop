import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const getBaseUrl = (req: Request) => {
  const origin = req.headers.get("origin");
  return origin || "http://localhost:3000";
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cart = body.cart;
    const shippingCost = body.shippingCost || 0;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "Panier vide" }, { status: 400 });
    }

    const baseUrl = getBaseUrl(req);

    // 🔥 LINE ITEMS PRODUITS
    const productItems = cart.map((item: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.name,
          description: "Vanille premium — Vanille’Or",
          images: [
            item.imageUrl || `${baseUrl}/images/product-vanille.jpg`,
          ],
        },
        unit_amount: item.priceCents,
      },
      quantity: item.quantity,
    }));

    // 🚚 LIVRAISON
    const shippingItem =
      shippingCost > 0
        ? [
            {
              price_data: {
                currency: "eur",
                product_data: {
                  name: "Frais de livraison",
                },
                unit_amount: shippingCost,
              },
              quantity: 1,
            },
          ]
        : [];

    const lineItems = [...productItems, ...shippingItem];

    // 💳 STRIPE SESSION
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,

      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/checkout`,

      billing_address_collection: "required",

      shipping_address_collection: {
        allowed_countries: ["FR", "BE", "CH"],
      },

      phone_number_collection: {
        enabled: true,
      },

      metadata: {
        source: "vanilleor-shop",
      },
    });

    // 💾 SAVE ORDER EN DB (PENDING)
    await prisma.order.create({
      data: {
        stripeSessionId: session.id,
        status: "PENDING",
        totalCents:
          cart.reduce(
            (acc: number, item: any) =>
              acc + item.priceCents * item.quantity,
            0
          ) + shippingCost,
        currency: "EUR",
        items: cart,
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