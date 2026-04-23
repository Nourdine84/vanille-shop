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

function isNonEmptyString(value: FormDataEntryValue | null): value is string {
  return typeof value === "string" && value.trim() !== "";
}

async function uploadFileToCloudinary(file: File) {
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
          reject(error);
          return;
        }
        resolve(uploaded);
      }
    );

    stream.end(buffer);
  });

  return result?.secure_url as string;
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
       IMAGE SUPPORT
       - imageUrl (current admin form)
       - image file upload (future-ready)
    ========================= */

    let imageUrl = formData.get("imageUrl")?.toString().trim() || "";

    const file = formData.get("image");

    if (!imageUrl && file && typeof file !== "string" && file.size > 0) {
      imageUrl = await uploadFileToCloudinary(file);
    }

    if (!name || !slugRaw || !imageUrl) {
      return NextResponse.json(
        { error: "Champs requis" },
        { status: 400 }
      );
    }

    const slug = normalizeSlug(slugRaw);

    /* =========================
       PRICING SUPPORT
       - current admin form: priceCents
       - advanced future form: price_100g, price_250g, etc.
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

    if (Object.keys(pricing).length === 0 && !hasSimplePrice) {
      return NextResponse.json(
        { error: "Au moins un prix requis" },
        { status: 400 }
      );
    }

    // Si aucun pricing avancé n'est fourni, on génère une base minimale
    if (Object.keys(pricing).length === 0 && hasSimplePrice) {
      const defaultFormat = unit === "ml" ? "100ml" : "100g";
      pricing[defaultFormat] = rawPriceCents;
    }

    const basePrice =
      (pricing["100g"] && Number(pricing["100g"])) ||
      (pricing["100ml"] && Number(pricing["100ml"])) ||
      (hasSimplePrice ? rawPriceCents : 0) ||
      Number(Object.values(pricing)[0]);

    if (!Number.isFinite(basePrice) || basePrice <= 0) {
      return NextResponse.json(
        { error: "Prix invalide" },
        { status: 400 }
      );
    }

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
        isActive,
        isPack,
        packItems: isPack ? packItems : null,
      },
    });

    console.log("✅ PRODUCT CREATED:", product.id);

    return NextResponse.redirect(new URL("/admin/products", req.url), {
      status: 303,
    });
  } catch (error: any) {
    console.error("🔥 CREATE PRODUCT ERROR:", error);

    if (error?.code === "P2002") {
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