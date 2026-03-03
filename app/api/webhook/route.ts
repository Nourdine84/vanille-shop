import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
  console.log("=".repeat(50));
  console.log("🔔 WEBHOOK REÇU");
  console.log("=".repeat(50));

  try {
    // 1. Vérifier les variables d'env
    console.log("1️⃣ STRIPE_SECRET_KEY présent:", !!process.env.STRIPE_SECRET_KEY);
    console.log("1️⃣ STRIPE_WEBHOOK_SECRET présent:", !!process.env.STRIPE_WEBHOOK_SECRET);

    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("Variables d'environnement Stripe manquantes");
    }

    // 2. Initialiser Stripe
    console.log("2️⃣ Initialisation de Stripe...");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    });
    console.log("   ✅ Stripe initialisé");

    // 3. Lire la requête
    console.log("3️⃣ Lecture de la requête...");
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");
    
    console.log("   📦 Body length:", body.length);
    console.log("   📝 Signature présente:", !!sig);

    if (!sig) {
      throw new Error("Pas de signature Stripe");
    }

    // 4. Vérifier la signature
    console.log("4️⃣ Vérification de la signature...");
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      console.log("   ✅ Signature valide !");
      console.log("   📦 Type d'événement:", event.type);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erreur inconnue";
      console.error("   ❌ Erreur signature:", errorMessage);
      console.error("   🔑 Secret utilisé (début):", process.env.STRIPE_WEBHOOK_SECRET.substring(0, 15) + "...");
      throw err;
    }

    // 5. Traiter l'événement
    console.log("5️⃣ Traitement de l'événement...");
    
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log("   ✅ Session complétée:", session.id);
      console.log("   📝 Métadonnées:", session.metadata);

      const userId = session.metadata?.userId || null;
      
      // Récupérer les lignes de la commande
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      console.log(`   📦 ${lineItems.data.length} produits`);

      // Créer la commande
      const order = await (prisma as any).order.create({
        data: {
          userId: userId,
          stripeSessionId: session.id,
          stripePaymentId: session.payment_intent as string,
          totalCents: session.amount_total!,
          currency: session.currency!,
          status: "PAID",
          items: lineItems.data.map((item: any) => ({
            name: item.description,
            quantity: item.quantity,
            priceCents: item.amount_total,
          })),
        },
      });

      console.log("   ✅ Commande créée:", order.id);
    } else {
      console.log(`   ⚠️ Événement ignoré: ${event.type}`);
    }

    console.log("=".repeat(50));
    console.log("✅ WEBHOOK TRAITÉ AVEC SUCCÈS");
    console.log("=".repeat(50));
    
    return NextResponse.json({ received: true });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("❌ ERREUR WEBHOOK:", errorMessage);
    console.error("=".repeat(50));
    return NextResponse.json(
      { error: "Webhook failed", details: errorMessage },
      { status: 400 }
    );
  }
}