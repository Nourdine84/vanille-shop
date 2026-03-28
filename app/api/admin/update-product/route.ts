import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id, name, priceCents, stock, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    await prisma.product.update({
      where: { id },
      data: {
        name,
        priceCents,
        stock,
        isActive,
      },
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { error: "Erreur update produit" },
      { status: 500 }
    );
  }
}