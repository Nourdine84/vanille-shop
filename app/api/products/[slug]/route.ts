
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_
  : Request,
  { params }: { params: { slug: string } }
) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    return NextResponse.json(
      { error: "Produit introuvable" },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}
