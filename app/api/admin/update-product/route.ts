import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ✅ FIX CRITIQUE

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================
   UPDATE PRODUCT
========================= */
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const id = formData.get("id");
    const name = formData.get("name");
    const slug = formData.get("slug");
    const description = formData.get("description");
    const imageUrl = formData.get("imageUrl");
    const priceCents = formData.get("priceCents");
    const stock = formData.get("stock");
    const category = formData.get("category");
    const subCategory = formData.get("subCategory");
    const isActive = formData.get("isActive");

    /* =========================
       VALIDATION
    ========================= */
    if (
      typeof id !== "string" ||
      typeof name !== "string" ||
      typeof slug !== "string" ||
      typeof description !== "string" ||
      typeof imageUrl !== "string" ||
      typeof priceCents !== "string" ||
      typeof stock !== "string" ||
      typeof category !== "string"
    ) {
      console.error("❌ Invalid payload");

      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    const parsedPrice = Number(priceCents);
    const parsedStock = Number(stock);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json(
        { error: "Prix invalide" },
        { status: 400 }
      );
    }

    /* =========================
       UPDATE
    ========================= */
    const updated = await prisma.product.update({
      where: { id },
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        priceCents: parsedPrice,
        stock: parsedStock,
        category: category.trim(),

        subCategory:
          typeof subCategory === "string" && subCategory.trim()
            ? subCategory.trim()
            : null,

        isActive: isActive === "on",
      },
    });

    console.log("✅ PRODUCT UPDATED:", updated.id);

    return NextResponse.redirect(
      new URL("/admin/products", req.url),
      { status: 303 }
    );

  } catch (error: any) {
    console.error("🔥 UPDATE PRODUCT ERROR:", error);

    if (error?.code === "P2025") {
      return NextResponse.json(
        { error: "Produit introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}