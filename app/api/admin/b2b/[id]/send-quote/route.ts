import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendQuoteEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await req.json();

    const existing = await prisma.b2BRequest.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
    }

    const amountEuros =
      body.amountEuros !== undefined && body.amountEuros !== null
        ? Number(body.amountEuros)
        : null;

    await sendQuoteEmail({
      to: existing.email,
      name: existing.name,
      company: existing.company,
      quantity: existing.quantity,
      amountEuros,
      customMessage: body.customMessage || null,
    });

    await prisma.b2BRequest.update({
      where: { id },
      data: {
        quoteSent: true,
        quoteAmount:
          amountEuros !== null && Number.isFinite(amountEuros)
            ? Math.round(amountEuros * 100)
            : existing.quoteAmount,
        status: "CONTACTED",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SEND QUOTE ERROR:", error);
    return NextResponse.json({ error: "Erreur lors de l’envoi du devis" }, { status: 500 });
  }
}