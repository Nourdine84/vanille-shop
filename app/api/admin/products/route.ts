import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

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
   CREATE PRODUCT
========================= */

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name")?.toString();
    const slugRaw = formData.get("slug")?.toString();
    const description = formData.get("description")?.toString() || "";
    const stock = Number(formData.get("stock"));
    const category = formData.get("category")?.toString() || "vanille";
    const unit = formData.get("unit")?.toString() || "g";

    const isPack = isChecked(formData.get("isPack"));
    const packItems = formData.get("packItems")?.toString() || null;
    const badge = formData.get("badge")?.toString() || null;

    /* =========================
       IMAGE UPLOAD
    ========================= */

    let imageUrl = "";

    const file = formData.get("image");

    if (file && typeof file !== "string") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const upload = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: "vanilleor" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      imageUrl = upload.secure_url;
    }

    if (!name || !slugRaw || !imageUrl) {
      return NextResponse.json({ error: "Champs requis" }, { status: 400 });
    }

    const slug = normalizeSlug(slugRaw);

    /* =========================
       PRICING
    ========================= */

    const pricing: Record<string, number> = {};

    for (const [key, value] of formData.entries()) {
      if (key.startsWith("price_")) {
        const format = key.replace("price_", "");
        const price = Number(value);

        if (Number.isFinite(price) && price > 0) {
          pricing[format] = price;
        }
      }
    }

    if (Object.keys(pricing).length === 0) {
      return NextResponse.json(
        { error: "Au moins un prix requis" },
        { status: 400 }
      );
    }

    const basePrice =
      pricing["100g"] ||
      pricing["100ml"] ||
      Object.values(pricing)[0];

    /* =========================
       CREATE
    ========================= */

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
        priceCents: basePrice,
        pricing: pricing as any,
        unit,
        stock: Number.isFinite(stock) ? stock : 0,
        category,
        badge: badge || null,
        isActive: true,
        isPack,
        packItems: isPack ? packItems : null,
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