import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendB2BEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      company,
      quantity,
      message,
    }: {
      name?: string;
      email?: string;
      company?: string;
      quantity?: string;
      message?: string;
    } = body;

    /* 🔒 VALIDATION */
    if (!name || !email || !quantity) {
      return NextResponse.json(
        { error: "Champs manquants" },
        { status: 400 }
      );
    }

    /* 💾 SAVE DB */
    const request = await prisma.B2BRequest.create({
      data: {
        name,
        email,
        company: company || null,
        quantity,
        message: message || null,
      },
    });

    /* 📩 EMAIL */
    try {
      await sendB2BEmail({
        name,
        email,
        company,
        quantity,
        message,
      });
    } catch (emailError) {
      console.error("EMAIL ERROR:", emailError);
      // 👉 on ne bloque pas la requête si email KO
    }

    console.log("✅ B2B CREATED:", request.id);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("🔥 B2B ERROR:", error);

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}