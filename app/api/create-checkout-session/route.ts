import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getCurrentUser } from "../../../lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

type CheckoutItem = {
  id: string;
  name: string;
  priceCents: number;
  imageUrl?: string;
  quantity: number;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items: CheckoutItem[] = body?.items ?? [];
    const currentUser = await getCurrentUser();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Panier vide" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

    const customerEmail =
      currentUser?.email || "msanourdine@hotmail.com";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customerEmail,

      line_items: items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
          },
          unit_amount: item.priceCents,
        },
        quantity: item.quantity,
      })),

      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,

      metadata: {
        source: "vanille-shop",
        userId: currentUser?.id || "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe error:", error);

    return NextResponse.json(
      { error: "Erreur Stripe" },
      { status: 500 }
    );
  }
}