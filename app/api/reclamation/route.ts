import { NextResponse } from "next/server";
import {
  sendB2BAdminEmail,
  sendB2BCustomerAckEmail,
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
    const message = body.message?.trim();

    /* ================= VALIDATION ================= */

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Champs requis manquants" },
        { status: 400 }
      );
    }

    console.log("\n📩 ===== SAV REQUEST =====");
    console.log("👤 Name:", name);
    console.log("📧 Email:", email);
    console.log("🧾 Order:", orderId);
    console.log("💬 Message:", message);
    console.log("📩 ======================\n");

    /* ================= EMAIL ADMIN ================= */

    await sendB2BAdminEmail({
      name,
      email,
      company: "Client VanilleOr",
      quantity: orderId ? `Commande: ${orderId}` : "-",
      message,
    });

    /* ================= EMAIL CLIENT ================= */

    await sendB2BCustomerAckEmail({
      name,
      email,
      message,
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("🔥 SAV API ERROR:", error);

    return NextResponse.json(
      { error: "Erreur serveur SAV" },
      { status: 500 }
    );
  }
}