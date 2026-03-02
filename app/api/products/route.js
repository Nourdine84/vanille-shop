import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🔥 SAFE ROUTE ACTIVE");

    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" }
    });

    const safeProducts = products.map((p) => ({
      id: String(p.id),
      slug: p.slug,
      name: p.name,
      description: p.description ?? null,
      priceCents: Number(p.priceCents),
      imageUrl: p.imageUrl ?? null,
    }));

    return NextResponse.json(safeProducts);

  } catch (error) {
    console.error("API ERROR:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { 
status: 500 });
  }
}
