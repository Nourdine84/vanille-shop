import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    let body: any;

    try {
      body = await req.json();
    } catch {
      console.error("❌ JSON invalide");
      return NextResponse.json(
        { error: "Invalid JSON" },
        { status: 400 }
      );
    }

    const {
      id,
      name,
      slug,
      description,
      priceCents,
      imageUrl,
      stock,
      category,
      subCategory,
      isActive,
    } = body;

    /* =========================
       VALIDATION
    ========================= */
    if (!name || !slug || !priceCents) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    const parsedPrice = Number(priceCents);
    const parsedStock = Number(stock ?? 0);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json(
        { error: "Prix invalide" },
        { status: 400 }
      );
    }

    /* =========================
       NORMALISATION DATA
    ========================= */
    const safeData = {
      name: String(name).trim(),
      slug: String(slug).trim().toLowerCase(),
      description: description?.trim() || "",
      priceCents: parsedPrice,
      imageUrl: imageUrl?.trim() || "",
      stock: parsedStock,
      category: category?.trim().toLowerCase() || "vanille",
      subCategory: subCategory?.trim() || "",
      isActive: isActive ?? true,
    };

    /* =========================
       CHECK SLUG UNIQUE (CREATE)
    ========================= */
    if (!id) {
      const existing = await prisma.product.findUnique({
        where: { slug: safeData.slug },
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
      const updated = await prisma.product.update({
        where: { id },
        data: safeData,
      });

      console.log("✅ PRODUCT UPDATED:", id);

      return NextResponse.json(updated);
    }

    /* =========================
       CREATE
    ========================= */
    const created = await prisma.product.create({
      data: safeData,
    });

    console.log("✅ PRODUCT CREATED:", created.id);

    return NextResponse.json(created);

  } catch (error: any) {
    console.error("🔥 PRODUCT API ERROR:", error);

    // 🔥 DEBUG PROPRE (ULTRA IMPORTANT)
    return NextResponse.json(
      {
        error: "Erreur serveur",
        message: error?.message || "unknown",
      },
      { status: 500 }
    );
  }
}