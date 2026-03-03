import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export async function POST(req: Request) {
  try {
    const { items } = await req.json();
    const session = await getServerSession(authOptions);

    console.log("📦 Création session Stripe pour:", items);
    console.log("👤 Utilisateur connecté:", session?.user?.email || "Anonyme");

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Panier vide" },
        { status: 400 }
      );
    }

    // Récupérer l'utilisateur en base pour avoir son ID
    let userId = null;
    if (session?.user?.email) {
      const user = await (prisma as any).user.findUnique({
        where: { email: session.user.email },
      });
      userId = user?.id || null;
    }

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
          },
          unit_amount: item.priceCents,
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/cart`,
      metadata: {
        userId: userId || "",
      },
    });

    console.log("✅ Session créée:", stripeSession.id);
    return NextResponse.json({ sessionId: stripeSession.id, url: stripeSession.url });
    
  } catch (error) {
    console.error("❌ Erreur Stripe:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session" },
      { status: 500 }
    );
  }
}