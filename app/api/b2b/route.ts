import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendB2BEmail, sendB2BDevisEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================
   POST B2B REQUEST
========================= */
export async function POST(req: Request) {
  try {
    /* =========================
       SAFE JSON PARSE
    ========================= */
    let body: any;

    try {
      body = await req.json();
    } catch {
      console.error("❌ Invalid JSON");
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    const { name, email, company, quantity, message } = body;

    /* =========================
       VALIDATION
    ========================= */
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof quantity !== "string"
    ) {
      return NextResponse.json(
        { error: "Champs invalides" },
        { status: 400 }
      );
    }

    if (!name.trim() || !email.trim() || !quantity.trim()) {
      return NextResponse.json(
        { error: "Champs manquants" },
        { status: 400 }
      );
    }

    /* =========================
       CREATE B2B REQUEST
    ========================= */
    const lead = await prisma.b2BRequest.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        company:
          typeof company === "string" && company.trim()
            ? company.trim()
            : null,
        quantity: quantity.trim(),
        message:
          typeof message === "string" && message.trim()
            ? message.trim()
            : null,
      },
    });

    console.log("📩 B2B LEAD CREATED:", lead.id);

    /* =========================
       EMAILS (NON BLOQUANT)
    ========================= */
    try {
      // email interne
      await sendB2BEmail({
        name,
        email,
        company,
        quantity,
        message,
      });

      console.log("📧 ADMIN B2B EMAIL SENT");
    } catch (err) {
      console.error("❌ ADMIN EMAIL ERROR:", err);
    }

    try {
      // email client (devis auto)
      await sendB2BDevisEmail({
        name,
        email,
        company,
        quantity,
      });

      console.log("📧 CLIENT DEVIS EMAIL SENT");
    } catch (err) {
      console.error("❌ CLIENT EMAIL ERROR:", err);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("🔥 B2B ERROR:", error);

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}