import type Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import {
  sendCustomerOrderEmail,
  sendAdminOrderEmail,
} from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================
   GARDE ENV (au chargement)
========================= */
// `stripe` (lib/stripe.ts) lève déjà si STRIPE_SECRET_KEY manque et fixe
// l'apiVersion partagée. On garde ici le secret de webhook.
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("STRIPE_WEBHOOK_SECRET manquant");
}

/* =========================
   HELPERS
========================= */

function parseItems(items: unknown): any[] {
  try {
    if (!items) return [];
    if (typeof items === "string") return JSON.parse(items);
    if (Array.isArray(items)) return items;
    return [];
  } catch {
    return [];
  }
}

/* =========================
   WEBHOOK
========================= */

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Signature manquante" },
        { status: 400 }
      );
    }

    /* ===== VÉRIFICATION SIGNATURE ===== */
    // constructEvent est hors-ligne (HMAC local) : ne dépend pas de la
    // validité de la clé API Stripe.
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err: any) {
      console.error("❌ STRIPE WEBHOOK SIGNATURE ERROR:", err?.message);
      return NextResponse.json(
        { error: "Signature invalide" },
        { status: 400 }
      );
    }

    const session = event.data.object as Stripe.Checkout.Session;

    /* ===== SESSION EXPIRÉE ===== */
    // Stripe signale une session Checkout expirée (délai dépassé). On annule
    // la commande UNIQUEMENT si elle est encore PENDING. Aucun stock n'a été
    // décrémenté à ce stade, aucun email. Tout autre statut (PAID, CANCELED,
    // FAILED, SHIPPED, DELIVERED) est laissé intact.
    if (event.type === "checkout.session.expired") {
      const expiredOrderId = session.metadata?.orderId;

      if (!expiredOrderId) {
        console.warn("⚠️ WEBHOOK expired: orderId manquant dans la session");
        return NextResponse.json({ received: true, skipped: "missing_orderId" });
      }

      const res = await prisma.order.updateMany({
        where: { id: expiredOrderId, status: "PENDING" },
        data: { status: "CANCELED" },
      });

      if (res.count === 1) {
        console.log("⌛ ORDER EXPIRED → CANCELED:", expiredOrderId);
        return NextResponse.json({ received: true, expired: "canceled" });
      }

      console.log(
        "⌛ WEBHOOK expired ignoré (commande absente ou statut non PENDING):",
        expiredOrderId
      );
      return NextResponse.json({ received: true, expired: "noop" });
    }

    /* ===== ÉVÉNEMENTS NON PERTINENTS ===== */
    if (event.type !== "checkout.session.completed") {
      return NextResponse.json({ received: true, ignored: event.type });
    }

    const orderId = session.metadata?.orderId;

    if (!orderId) {
      return NextResponse.json(
        { error: "orderId manquant" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      // Commande absente : rien à traiter. On accuse réception pour éviter
      // des retries infinis côté Stripe.
      console.warn("⚠️ WEBHOOK: commande introuvable:", orderId);
      return NextResponse.json({
        received: true,
        skipped: "order_not_found",
      });
    }

    /* ===== FILTRE DE STATUT ===== */
    // Seule une commande PENDING peut être promue en PAID. Tout autre statut
    // est acquitté (200) sans aucun effet :
    //  - PAID              → déjà traité (idempotence)
    //  - CANCELED / FAILED / SHIPPED / DELIVERED → on n'y touche pas, ce qui
    //    empêche la "résurrection" d'une commande annulée/échouée par un
    //    événement completed tardif.
    if (order.status === "PAID") {
      return NextResponse.json({ received: true, alreadyProcessed: true });
    }

    if (order.status !== "PENDING") {
      return NextResponse.json({
        received: true,
        ignoredStatus: order.status,
      });
    }

    const customerEmail =
      session.customer_details?.email || order.email || null;

    const paymentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id || null;

    const items = parseItems(order.items);

    /* ===== CLAIM ATOMIQUE + STOCK (MÊME TRANSACTION) ===== */
    // Un seul webhook peut faire passer la commande de PENDING à PAID :
    // `updateMany` avec `status: "PENDING"` ne matche qu'une fois (et jamais
    // une commande CANCELED/FAILED/…). Le décrément stock vit dans la MÊME
    // transaction → soit tout réussit, soit tout est annulé (rejouable sans
    // double effet).
    const claimed = await prisma.$transaction(async (tx) => {
      const claim = await tx.order.updateMany({
        where: { id: orderId, status: "PENDING" },
        data: {
          status: "PAID",
          paidAt: new Date(),
          email: customerEmail,
          stripePaymentId: paymentId,
        },
      });

      // Une autre exécution (rejeu / livraison concurrente) a déjà pris la main.
      if (claim.count === 0) return false;

      for (const item of items) {
        const productId = item?.id?.split("-")[0];
        if (!productId) continue;

        // updateMany : ne lève pas si le produit a été supprimé (count 0),
        // ce qui éviterait de faire rollback un paiement déjà encaissé.
        await tx.product.updateMany({
          where: { id: productId },
          data: {
            stock: { decrement: Math.max(1, Number(item?.quantity) || 1) },
          },
        });
      }

      return true;
    });

    if (!claimed) {
      return NextResponse.json({ received: true, alreadyProcessed: true });
    }

    console.log("✅ STRIPE ORDER PAID:", orderId);

    /* ===== EMAILS : NON BLOQUANTS ===== */
    // La commande est payée et le stock décrémenté : un échec Resend ne doit
    // jamais invalider le webhook (un 500 déclencherait un retry qui, la
    // commande étant PAID, sauterait le stock).
    const formattedItems = items.map((item: any) => ({
      id: item?.id || "",
      name: item?.name || "Produit",
      quantity: Number(item?.quantity) || 1,
      priceCents: Number(item?.priceCents) || 0,
      imageUrl: item?.imageUrl || "",
      description: item?.description || "",
      format: item?.format || "",
    }));

    if (customerEmail) {
      try {
        await sendCustomerOrderEmail({
          to: customerEmail,
          orderId,
          totalCents: order.totalCents,
          items: formattedItems,
        });
      } catch (err) {
        console.error("❌ CLIENT EMAIL ERROR:", err);
      }
    } else {
      console.warn("⚠️ Aucun email client détecté");
    }

    try {
      await sendAdminOrderEmail({
        orderId,
        customerEmail,
        totalCents: order.totalCents,
        items: formattedItems,
      });
    } catch (err) {
      console.error("❌ ADMIN EMAIL ERROR:", err);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("🔥 STRIPE WEBHOOK ERROR:", error);
    return NextResponse.json(
      { error: "Erreur webhook Stripe" },
      { status: 500 }
    );
  }
}
