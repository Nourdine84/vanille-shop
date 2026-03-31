import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendB2BEmail, sendB2BDevisEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();

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

    // 🔥 EMAIL INTERNE (toi)
    await sendB2BEmail({
      name,
      email,
      company,
      quantity,
      message,
    });

    // 🔥 EMAIL CLIENT AUTO (DEVIS)
    await sendB2BDevisEmail({
      name,
      email,
      company,
      quantity,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("B2B ERROR:", error);

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}