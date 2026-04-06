import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ProductPayload = {
  id?: string | null;
  name?: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  subCategory?: string | null;
  badge?: string | null;
  priceCents?: number | string;
  stock?: number | string;
  isActive?: boolean | string;
};

async function parseBody(req: Request): Promise<ProductPayload> {
  const contentType = req.headers.get("content-type") || "";

  if (
    contentType.includes("multipart/form-data") ||
    contentType.includes("application/x-www-form-urlencoded")
  ) {
    const formData = await req.formData();

    return {
      id: formData.get("id")?.toString() || null,
      name: formData.get("name")?.toString() || "",
      slug: formData.get("slug")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      imageUrl: formData.get("imageUrl")?.toString() || "",
      category: formData.get("category")?.toString() || "vanille",
      subCategory: formData.get("subCategory")?.toString() || null,
      badge: formData.get("badge")?.toString() || null,
      priceCents: formData.get("priceCents")?.toString() || 0,
      stock: formData.get("stock")?.toString() || 0,
      isActive: formData.get("isActive") === "on",
    };
  }

  if (contentType.includes("application/json")) {
    return await req.json();
  }

  throw new Error("Content-Type non supporté");
}

export async function POST(req: Request) {
  try {
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return NextResponse.json({ ok: true });
    }

    const { prisma } = await import("@/lib/prisma");
    const body = await parseBody(req);

    const id = body.id || null;
    const name = body.name?.trim() || "";
    const slug = body.slug?.trim().toLowerCase() || "";

    const priceCents = Number(body.priceCents || 0);
    const stock = Number(body.stock || 0);

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Nom et slug requis" },
        { status: 400 }
      );
    }

    if (!priceCents || isNaN(priceCents) || priceCents <= 0) {
      return NextResponse.json(
        { error: "Prix invalide" },
        { status: 400 }
      );
    }

    const data = {
      name,
      slug,
      description: body.description?.trim() || "",
      priceCents,
      imageUrl: body.imageUrl?.trim() || "/products/default.jpg",
      stock: isNaN(stock) ? 0 : stock,
      category: body.category?.trim().toLowerCase() || "vanille",
      subCategory: body.subCategory?.trim() || null,
      badge: body.badge || null,
      isActive:
        body.isActive === true ||
        body.isActive === "true" ||
        body.isActive === "on",
    };

    // CREATE
    if (!id) {
      const exists = await prisma.product.findUnique({
        where: { slug },
      });

      if (exists) {
        return NextResponse.json(
          { error: "Slug déjà utilisé" },
          { status: 400 }
        );
      }

      const created = await prisma.product.create({ data });

      return NextResponse.json({ success: true, product: created });
    }

    // UPDATE
    const existing = await prisma.product.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json(
        { error: "Produit introuvable" },
        { status: 404 }
      );
    }

    if (existing.slug !== slug) {
      const exists = await prisma.product.findUnique({
        where: { slug },
      });

      if (exists) {
        return NextResponse.json(
          { error: "Slug déjà utilisé" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, product: updated });

  } catch (error: any) {
    console.error("🔥 PRODUCT API ERROR:", error);

    return NextResponse.json(
      { error: "Erreur serveur", message: error?.message },
      { status: 500 }
    );
  }
}