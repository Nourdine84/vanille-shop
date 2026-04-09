import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================
   TOGGLE ACTIVE
========================= */

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID manquant" },
        { status: 400 }
      );
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { isActive: !!isActive },
    });

    return NextResponse.json({
      success: true,
      product: updated,
    });

  } catch (error) {
    console.error("🔥 TOGGLE PRODUCT ERROR:", error);

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}