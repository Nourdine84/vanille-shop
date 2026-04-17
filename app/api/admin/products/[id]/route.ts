import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSafeId(id: string | string[] | undefined) {
  if (!id) return "";
  return Array.isArray(id) ? id[0] : id;
}

/* GET */
export async function GET(
  _: Request,
  { params }: { params: { id: string | string[] } }
) {
  try {
    const id = getSafeId(params.id);

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
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
    console.error("🔥 GET ERROR:", error);

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/* DELETE */
export async function DELETE(
  _: Request,
  { params }: { params: { id: string | string[] } }
) {
  try {
    const id = getSafeId(params.id);

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("🔥 DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Erreur suppression" },
      { status: 500 }
    );
  }
}