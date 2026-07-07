import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sendSupportAdminEmail,
  sendSupportCustomerEmail,
} from "@/lib/email";

export const runtime = "nodejs";

/* =========================
   POST /api/reclamation
========================= */

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = body.name?.trim();
    const email = body.email?.trim();
    const orderId = body.orderId?.trim() || "";
    const subject = "Demande SAV / Réclamation";
    const message = body.message?.trim();

    /* ================= VALIDATION ================= */

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    /* ================= DB ================= */
    // Persiste la réclamation pour qu'elle apparaisse dans /admin/reclamations
    // (aligné sur /api/support). Sans cela, les réclamations client étaient
    // uniquement envoyées par email et invisibles côté admin.
    const reclamation = await prisma.reclamation.create({
      data: {
        name,
        email,
        orderId: orderId || null,
        subject,
        message,
      },
    });

    console.log("📩 RECLAMATION CREATED:", reclamation.id);

    /* ================= EMAIL ADMIN (non bloquant) ================= */

    try {
      await sendSupportAdminEmail({
        name,
        email,
        orderId,
        subject,
        message,
      });
    } catch (err) {
      console.error("❌ ADMIN EMAIL ERROR:", err);
    }

    /* ================= EMAIL CLIENT (non bloquant) ================= */

    try {
      await sendSupportCustomerEmail({
        to: email,
        name,
        subject,
        orderId,
      });
    } catch (err) {
      console.error("❌ CUSTOMER EMAIL ERROR:", err);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("🔥 SAV API ERROR:", error);

    return NextResponse.json(
      { error: "Erreur serveur SAV" },
      { status: 500 }
    );
  }
}