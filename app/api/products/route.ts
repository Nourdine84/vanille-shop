import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================
   HELPERS
========================= */

function normalizeSlug(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* =========================
   GET PRODUCTS (PUBLIC)
========================= */

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: normalizeSlug(product.slug || product.name),
      priceCents: product.priceCents,
      pricing: product.pricing,
      imageUrl: product.imageUrl,
      stock: product.stock,
      category: product.category,
      subCategory: product.subCategory,
      badge: product.badge,
      isPack: product.isPack,
      packItems: product.packItems,
      createdAt: product.createdAt,
    }));

    return NextResponse.json(safeProducts);
  } catch (error) {
    console.error("❌ GET PRODUCTS ERROR:", error);

    return NextResponse.json(
      { error: "Erreur récupération produits" },
      { status: 500 }
    );
  }
}