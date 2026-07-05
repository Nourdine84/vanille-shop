import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================
   CRON — NETTOYAGE DES COMMANDES EXPIRÉES
=========================

   Filet de sécurité INDÉPENDANT du webhook Stripe. Si Stripe n'envoie jamais
   checkout.session.expired, ce cron annule quand même les commandes PENDING
   dont l'échéance (expiresAt) est dépassée.

   - Auth obligatoire : Authorization: Bearer ${CRON_SECRET}
   - Ne touche QUE les commandes PENDING expirées → CANCELED
   - Aucun email, aucun décrément stock, aucune suppression physique
   - Idempotent : une 2e exécution ne trouve plus rien à annuler
========================= */

export async function GET(req: Request) {
  /* ===== AUTH (fail-closed) ===== */
  // Sans CRON_SECRET configuré, ou header absent/incorrect → 401.
  // Jamais de cron public.
  const secret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();

    const where = {
      status: "PENDING" as const,
      // Les commandes sans expiresAt (créées avant VO-CHECKOUT-004-B) ne
      // matchent pas `lt` → elles sont laissées intactes, par prudence.
      expiresAt: { lt: now },
    };

    const scanned = await prisma.order.count({ where });

    const result = await prisma.order.updateMany({
      where,
      data: { status: "CANCELED" },
    });

    console.log(
      `🧹 ORDERS CLEANUP: scanned=${scanned} canceled=${result.count}`
    );

    return NextResponse.json({
      scanned,
      canceled: result.count,
      now: now.toISOString(),
    });
  } catch (error) {
    console.error("🔥 ORDERS CLEANUP CRON ERROR:", error);
    return NextResponse.json({ error: "cron failed" }, { status: 500 });
  }
}
