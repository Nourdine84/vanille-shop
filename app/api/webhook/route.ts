import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
  console.log("=".repeat(50));
  console.log("🔔 WEBHOOK REÇU");
  console.log("=".repeat(50));

  try {
    // 🔐 Vérification ENV
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("Variables Stripe manquantes");
    }

    // 🧱 Init Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // 📦 Lecture body + signature
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      throw new Error("Signature Stripe absente");
    }

    // 🔒 Vérification webhook
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("📦 Event reçu :", event.type);

    // 🎯 Traitement paiement
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log("✅ PAYMENT CONFIRMED:", session.id);

      // 🔒 Anti doublon
      const existingOrder = await prisma.order.findUnique({
        where: { stripeSessionId: session.id },
      });

      if (existingOrder) {
        console.log("⚠️ Commande déjà existante → skip");
        return NextResponse.json({ received: true });
      }

      // 📦 Récupération des produits
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      console.log("🧾 Produits Stripe:", lineItems.data.length);

      // 🧠 Mapping propre
      const items = lineItems.data.map((item) => ({
        name: item.description,
        quantity: item.quantity,
        priceCents: item.amount_subtotal, // ✅ FIX IMPORTANT
      }));

      // 💾 Création commande
      const order = await prisma.order.create({
        data: {
          stripeSessionId: session.id,
          stripePaymentId: session.payment_intent as string,
          totalCents: session.amount_total || 0,
          currency: session.currency || "EUR",
          status: "PAID",
          items: items,
        },
      });

      console.log("✅ Commande créée:", order.id);
    } else {
      console.log("ℹ️ Event ignoré:", event.type);
    }

    console.log("=".repeat(50));
    console.log("✅ WEBHOOK OK");
    console.log("=".repeat(50));

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("❌ ERREUR WEBHOOK:", error);
    console.log("=".repeat(50));

    return NextResponse.json(
      { error: "Webhook failed" },
      { status: 400 }
    );
  }
}