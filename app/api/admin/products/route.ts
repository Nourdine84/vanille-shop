import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

/* =========================
   UTILS
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

function isChecked(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

/* =========================
   POST CREATE PRODUCT
========================= */

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const slugRaw = formData.get("slug");
    const description = formData.get("description");
    const imageUrl = formData.get("imageUrl");
    const stock = formData.get("stock");
    const category = formData.get("category") || "vanille";
    const unit = formData.get("unit") || "g";

    const isPack = formData.get("isPack");
    const packItems = formData.get("packItems");
    const badge = formData.get("badge");

    if (
      typeof name !== "string" ||
      typeof slugRaw !== "string" ||
      typeof imageUrl !== "string" ||
      typeof stock !== "string"
    ) {
      return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
    }

    const parsedStock = Number(stock);

    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      return NextResponse.json({ error: "Stock invalide" }, { status: 400 });
    }

    const slug = normalizeSlug(slugRaw);

    /* =========================
       PRICING DYNAMIQUE
    ========================= */

    const pricing: Record<string, number> = {};

    for (const [key, value] of formData.entries()) {
      if (key.startsWith("price_") && typeof value === "string") {
        const format = key.replace("price_", "");
        const price = Number(value);

        if (!isNaN(price) && price > 0) {
          pricing[format] = price;
        }
      }
    }

    const basePrice =
      pricing["100g"] ||
      pricing["100ml"] ||
      Object.values(pricing)[0] ||
      1000;

    /* =========================
       CREATE
    ========================= */

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug,
        description: typeof description === "string" ? description : "",
        imageUrl: imageUrl.trim(),

        priceCents: basePrice,

        // ✅ FIX PRISMA JSON
        pricing: Object.keys(pricing).length
          ? (pricing as any)
          : undefined,

        unit: unit.toString(),

        stock: parsedStock,
        category: category.toString(),

        badge:
          typeof badge === "string" && badge.trim()
            ? badge
            : null,

        isActive: true,

        isPack: isChecked(isPack),

        packItems:
          typeof packItems === "string" && packItems.trim()
            ? packItems
            : null,
      },
    });

    console.log("✅ PRODUCT CREATED:", product.id);

    return NextResponse.redirect(
      new URL("/admin/products", req.url),
      { status: 303 }
    );

  } catch (error: any) {
    console.error("🔥 CREATE PRODUCT ERROR:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Slug déjà utilisé" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}