import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSafeId(id: string | string[] | undefined) {
  if (!id) return "";
  return Array.isArray(id) ? id[0] : id;
}

export async function GET(
  _: Request,
  { params }: { params: { id: string | string[] } }
) {
  try {
    const id = getSafeId(params.id);

    if (!id) {
      return NextResponse.json(
        { error: "ID manquant" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produit introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("🔥 GET PRODUCT ERROR:", error);

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string | string[] } }
) {
  try {
    const id = getSafeId(params.id);

    if (!id) {
      return NextResponse.json(
        { error: "ID manquant" },
        { status: 400 }
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      select: { id: true, name: true },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Produit introuvable" },
        { status: 404 }
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Produit supprimé",
      productId: id,
    });
  } catch (error) {
    console.error("🔥 DELETE PRODUCT ERROR:", error);

    return NextResponse.json(
      { error: "Impossible de supprimer ce produit" },
      { status: 500 }
    );
  }
}