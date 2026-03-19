import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items = body.items;

    console.log("🛒 CART:", JSON.stringify(items, null, 2));

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Panier vide" },
        { status: 400 }
      );
    }

    const line_items = items.map((item: any) => {
      if (!item.priceCents || item.priceCents <= 0) {
        throw new Error("Produit invalide");
      }

      return {
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name || "Produit",
            images: [
              item.imageUrl && item.imageUrl.startsWith("/images/")
                ? `${process.env.NEXT_PUBLIC_URL}${item.imageUrl}`
                : "https://via.placeholder.com/300",
            ],
          },
          unit_amount: item.priceCents,
        },
        quantity: item.quantity || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
    });

    return NextResponse.json({ url: session.url });

  } catch (error: any) {
    console.error("❌ STRIPE ERROR:", error.message);

    return NextResponse.json(
      { error: "Erreur création session Stripe" },
      { status: 400 }
    );
  }
}