import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      priceCents: true,
      imageUrl: true,
    },
  });

  const safe = products.map((p) => ({
    ...p,
    priceCents: Number(p.priceCents),
  }));

  return NextResponse.json(safe);
}