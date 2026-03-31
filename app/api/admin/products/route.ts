import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

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

    // 🔒 VALIDATION
    if (!name || !slug || !priceCents) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    // 🔄 UPDATE
    if (id) {
      const updated = await prisma.product.update({
        where: { id },
        data: {
          name,
          slug,
          description,
          priceCents: Number(priceCents),
          imageUrl,
          stock: Number(stock),
          category,
          subCategory,
          isActive,
        },
      });

      return NextResponse.json(updated);
    }

    // ➕ CREATE
    const created = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        priceCents: Number(priceCents),
        imageUrl,
        stock: Number(stock || 0),
        category,
        subCategory,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(created);

  } catch (error) {
    console.error("🔥 PRODUCT API ERROR:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}