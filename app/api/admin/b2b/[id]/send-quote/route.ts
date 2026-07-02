import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendQuoteEmail } from "@/lib/email";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================
   TYPE ALIGNÉ EMAIL
========================= */
type QuotePayload = {
  to: string;
  name: string;
  company?: string | null;
  quantity: string; // ✅ STRING (FIX GLOBAL)
  amountEuros: number | null;
  customMessage?: string | null;
};

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!isAdminRequest(req)) {
      return unauthorizedResponse();
    }

    const id = params.id;

    /* =========================
       SAFE JSON
    ========================= */
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    /* =========================
       FETCH DATA
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
       AMOUNT SAFE
    ========================= */
    const rawAmount =
      body.amountEuros !== undefined && body.amountEuros !== null
        ? Number(body.amountEuros)
        : null;

    const amountEuros =
      rawAmount !== null && Number.isFinite(rawAmount)
        ? rawAmount
        : null;

    /* =========================
       PAYLOAD CLEAN
    ========================= */
    const payload: QuotePayload = {
      to: existing.email,
      name: existing.name,
      company: existing.company || null,
      quantity: String(existing.quantity), // ✅ FIX ICI
      amountEuros,
      customMessage: body.customMessage || null,
    };

    /* =========================
       SEND EMAIL
    ========================= */
    await sendQuoteEmail(payload);

    /* =========================
       UPDATE DB
    ========================= */
    await prisma.b2BRequest.update({
      where: { id },
      data: {
        quoteSent: true,
        quoteAmount:
          amountEuros !== null
            ? Math.round(amountEuros * 100)
            : existing.quoteAmount,
        status: "CONTACTED",
      },
    });

    return NextResponse.json({ success: true });

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