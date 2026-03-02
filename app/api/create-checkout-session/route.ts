import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    console.log("📦 Création session Stripe pour:", items);

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Panier vide" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            // ⚠️ Solution temporaire: pas d'images pour éviter l'erreur URL
            // Plus tard, on utilisera: images: item.imageUrl ? [`${process.env.NEXT_PUBLIC_URL}${item.imageUrl}`] : [],
          },
          unit_amount: item.priceCents,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/cart`,
    });

    console.log("✅ Session créée:", session.id);
    return NextResponse.json({ sessionId: session.id, url: session.url });
    
  } catch (error) {
    console.error("❌ Erreur Stripe:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session" },
      { status: 500 }
    );
  }
}