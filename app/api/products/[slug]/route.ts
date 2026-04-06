import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { prisma } = await import("@/lib/prisma");

    const slug = params.slug?.toLowerCase();

    if (!slug) {
      return NextResponse.json(
        { error: "Slug manquant" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { slug },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "Produit introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);

  } catch (error: any) {
    console.error("❌ GET PRODUCT ERROR:", error);

    return NextResponse.json(
      { error: "Erreur récupération produit" },
      { status: 500 }
    );
  }
}