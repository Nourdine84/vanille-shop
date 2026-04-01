import { NextResponse } from "next/server";
import { sendB2BEmail, sendB2BDevisEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { prisma } = await import("@/lib/prisma"); // ✅ FIX

    let body: any;

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    const { name, email, company, quantity, message } = body;

    if (!name || !email || !quantity) {
      return NextResponse.json(
        { error: "Champs manquants" },
        { status: 400 }
      );
    }

    await prisma.b2BRequest.create({
      data: {
        name,
        email,
        company,
        quantity,
        message,
      },
    });

    /* =========================
       EMAILS
    ========================= */
    await sendB2BEmail({
      name,
      email,
      company,
      quantity,
      message,
    });

    await sendB2BDevisEmail({
      name,
      email,
      company,
      quantity,
    });

    console.log("✅ B2B REQUEST CREATED:", email);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("🔥 B2B ERROR:", error);

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}