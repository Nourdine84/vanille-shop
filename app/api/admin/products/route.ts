import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    /**
     * 🔥 ANTI BUILD VERCEL
     */
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return NextResponse.json({ ok: true });
    }

    /**
     * 🔥 IMPORT PRISMA (SAFE)
     */
    const { prisma } = await import("@/lib/prisma");

    /* =========================
       PARSE FORM DATA
    ========================= */
    const formData = await req.formData();

    const id = formData.get("id")?.toString() || null;
    const name = formData.get("name")?.toString() || "";
    const slug = formData.get("slug")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const imageUrl = formData.get("imageUrl")?.toString() || "";
    const category = formData.get("category")?.toString() || "vanille";
    const subCategory = formData.get("subCategory")?.toString() || "";
    const badge = formData.get("badge")?.toString() || null;

    const priceCents = Number(formData.get("priceCents") || 0);
    const stock = Number(formData.get("stock") || 0);

    const isActive = formData.get("isActive") === "on";

    /* =========================
       VALIDATION
    ========================= */
    if (!name.trim() || !slug.trim() || priceCents <= 0) {
      return NextResponse.json(
        { error: "Champs obligatoires invalides" },
        { status: 400 }
      );
    }

    if (isNaN(priceCents)) {
      return NextResponse.json(
        { error: "Prix invalide" },
        { status: 400 }
      );
    }

    /* =========================
       NORMALISATION
    ========================= */
    const cleanSlug = slug.trim().toLowerCase();

    const data = {
      name: name.trim(),
      slug: cleanSlug,
      description: description.trim(),
      priceCents,
      imageUrl: imageUrl.trim(),
      stock,
      category: category.trim().toLowerCase(),
      subCategory: subCategory.trim(),
      badge,
      isActive,
    };

    /* =========================
       CHECK SLUG UNIQUE (CREATE)
    ========================= */
    if (!id) {
      const existing = await prisma.product.findUnique({
        where: { slug: cleanSlug },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Slug déjà utilisé" },
          { status: 400 }
        );
      }
    }

    /* =========================
       UPDATE
    ========================= */
    if (id) {
      const existingProduct = await prisma.product.findUnique({
        where: { id },
      });

      if (!existingProduct) {
        return NextResponse.json(
          { error: "Produit introuvable" },
          { status: 404 }
        );
      }

      const updated = await prisma.product.update({
        where: { id },
        data,
      });

      console.log("✅ PRODUCT UPDATED:", id);

      return NextResponse.json(updated);
    }

    /* =========================
       CREATE
    ========================= */
    const created = await prisma.product.create({
      data,
    });

    console.log("✅ PRODUCT CREATED:", created.id);

    return NextResponse.json(created);

  } catch (error: any) {
    console.error("🔥 PRODUCT API ERROR:", error);

    return NextResponse.json(
      {
        error: "Erreur serveur",
        message: error?.message || "unknown",
      },
      { status: 500 }
    );
  }
}