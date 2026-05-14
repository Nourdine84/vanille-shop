import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendQuoteEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: {
    id: string;
  };
}

export async function POST(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const id = context.params.id;
    const body = await req.json();

    /* =========================
       GET LEAD
    ========================= */
    const existing = await prisma.b2BRequest.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Demande introuvable" },
        { status: 404 }
      );
    }

    /* =========================
       SAFE PARSING
    ========================= */
    const amountEuros =
      body?.amountEuros !== undefined &&
      body?.amountEuros !== null
        ? Number(body.amountEuros)
        : null;

    const quantity =
      typeof existing.quantity === "string"
        ? existing.quantity
        : String(existing.quantity ?? "");

    /* =========================
       SEND EMAIL
    ========================= */
    await sendQuoteEmail({
      to: existing.email,
      name: existing.name || "Client",
      quantity,
      amountEuros,
      customMessage: body?.customMessage || null,
    });

    /* =========================
       UPDATE DB
    ========================= */
    await prisma.b2BRequest.update({
      where: { id },
      data: {
        quoteSent: true,
        quoteAmount:
          amountEuros !== null &&
          Number.isFinite(amountEuros)
            ? Math.round(amountEuros * 100)
            : existing.quoteAmount,
        status: "CONTACTED",
      },
    });

    console.log("📨 QUOTE SENT:", id);

    return NextResponse.json({
      success: true,
    });

  } catch (error: any) {
    console.error("🔥 SEND QUOTE ERROR:", error);

    return NextResponse.json(
      {
        error: "Erreur lors de l’envoi du devis",
        message: error?.message || "unknown",
      },
      { status: 500 }
    );
  }
}