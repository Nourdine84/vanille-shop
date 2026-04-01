import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================
   POST CREATE / UPDATE PRODUCT
========================= */
export async function POST(req: Request) {
  try {
    const { prisma } = await import("@/lib/prisma"); // ✅ FIX CRITIQUE

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
    const parsedStock = Number(stock || 0);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json(
        { error: "Prix invalide" },
        { status: 400 }
      );
    }

    /* =========================
       UPDATE
    ========================= */
    if (id) {
      const updated = await prisma.product.update({
        where: { id },
        data: {
          name,
          slug,
          description,
          priceCents: parsedPrice,
          imageUrl,
          stock: parsedStock,
          category,
          subCategory,
          isActive,
        },
      });

      console.log("✅ PRODUCT UPDATED:", id);

      return NextResponse.json(updated);
    }

    /* =========================
       CREATE
    ========================= */
    const created = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        priceCents: parsedPrice,
        imageUrl,
        stock: parsedStock,
        category,
        subCategory,
        isActive: isActive ?? true,
      },
    });

    console.log("✅ PRODUCT CREATED:", created.id);

    return NextResponse.json(created);

  } catch (error) {
    console.error("🔥 PRODUCT API ERROR:", error);

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}