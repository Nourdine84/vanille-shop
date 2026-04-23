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
   SAFE CLOUDINARY
========================= */

async function uploadFileToCloudinary(file: File) {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "vanilleor",
          resource_type: "image",
        },
        (error, uploaded) => {
          if (error) {
            console.error("❌ CLOUDINARY ERROR:", error);
            reject(error);
            return;
          }
          resolve(uploaded);
        }
      );

      stream.end(buffer);
    });

    return result?.secure_url as string;

  } catch (err) {
    console.error("❌ UPLOAD FAILED:", err);
    return "";
  }
}

/* =========================
   CREATE PRODUCT
========================= */

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name")?.toString().trim() || "";
    const slugRaw = formData.get("slug")?.toString().trim() || "";
    const description = formData.get("description")?.toString().trim() || "";
    const stock = Number(formData.get("stock"));
    const category = formData.get("category")?.toString().trim() || "vanille";
    const unit = formData.get("unit")?.toString().trim() || "g";

    const isPack = isChecked(formData.get("isPack"));
    const isActive = isChecked(formData.get("isActive"));
    const packItems = formData.get("packItems")?.toString().trim() || null;
    const badge = formData.get("badge")?.toString().trim() || null;

    /* =========================
       IMAGE (SAFE)
    ========================= */

    let imageUrl = formData.get("imageUrl")?.toString().trim() || "";

    const file = formData.get("image");

    // upload uniquement si URL vide
    if (!imageUrl && file && typeof file !== "string" && file.size > 0) {
      imageUrl = await uploadFileToCloudinary(file);
    }

    if (!imageUrl) {
      console.error("❌ IMAGE MISSING");
      return NextResponse.json(
        { error: "Image requise" },
        { status: 400 }
      );
    }

    if (!name || !slugRaw) {
      return NextResponse.json(
        { error: "Nom et slug requis" },
        { status: 400 }
      );
    }

    const slug = normalizeSlug(slugRaw);

    /* =========================
       PRICING (SAFE)
    ========================= */

    const pricing: Record<string, number> = {};

    for (const [key, value] of formData.entries()) {
      if (!key.startsWith("price_")) continue;

      const format = key.replace("price_", "").trim();
      const price = Number(value);

      if (format && Number.isFinite(price) && price > 0) {
        pricing[format] = price;
      }
    }

    const rawPriceCents = Number(formData.get("priceCents"));
    const hasSimplePrice = Number.isFinite(rawPriceCents) && rawPriceCents > 0;

    // fallback simple
    if (Object.keys(pricing).length === 0 && hasSimplePrice) {
      const defaultFormat = unit === "ml" ? "100ml" : "100g";
      pricing[defaultFormat] = rawPriceCents;
    }

    if (Object.keys(pricing).length === 0) {
      return NextResponse.json(
        { error: "Prix requis" },
        { status: 400 }
      );
    }

    const basePrice =
      pricing["100g"] ||
      pricing["100ml"] ||
      rawPriceCents ||
      Object.values(pricing)[0];

    if (!Number.isFinite(basePrice) || basePrice <= 0) {
      return NextResponse.json(
        { error: "Prix invalide" },
        { status: 400 }
      );
    }

    /* =========================
       CREATE (SAFE DB)
    ========================= */

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
        priceCents: Number(basePrice),
        pricing: pricing as any,
        unit,
        stock: Number.isFinite(stock) ? stock : 0,
        category,
        badge,
        isActive,
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

    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Slug déjà utilisé" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}