import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
   CLOUDINARY
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
    console.error("❌ CLOUDINARY ERROR:", err);
    return "";
  }
}

/* =========================
   GET PRODUCTS (ADMIN)
========================= */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") || "1");

    const search =
      searchParams.get("search")?.trim() || "";

    const category =
      searchParams.get("category")?.trim() || "";

    const status =
      searchParams.get("status")?.trim() || "";

    const stock =
      searchParams.get("stock")?.trim() || "";

    const take = 12;
    const skip = (page - 1) * take;

    const where: any = {};

    /* ================= SEARCH ================= */

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          slug: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    /* ================= CATEGORY ================= */

    if (category && category !== "all") {
      where.category = category;
    }

    /* ================= STATUS ================= */

    if (status === "active") {
      where.isActive = true;
    }

    if (status === "inactive") {
      where.isActive = false;
    }

    /* ================= STOCK ================= */

    if (stock === "low") {
      where.stock = {
        lte: 5,
      };
    }

    if (stock === "out") {
      where.stock = {
        lte: 0,
      };
    }

    /* ================= QUERY ================= */

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take,
      }),

      prisma.product.count({
        where,
      }),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / take),
    });

  } catch (error) {
    console.error("🔥 ADMIN PRODUCTS GET ERROR:", error);

    return NextResponse.json(
      {
        products: [],
        total: 0,
        page: 1,
        totalPages: 1,
      },
      { status: 500 }
    );
  }
}

/* =========================
   CREATE PRODUCT
========================= */

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name =
      formData.get("name")?.toString().trim() || "";

    const slugRaw =
      formData.get("slug")?.toString().trim() || "";

    const description =
      formData.get("description")?.toString().trim() || "";

    const stockRaw = Number(formData.get("stock"));

    const stock =
      Number.isFinite(stockRaw) && stockRaw >= 0
        ? stockRaw
        : 0;

    const category =
      formData.get("category")?.toString().trim() ||
      "vanille";

    const unitRaw =
      formData.get("unit")?.toString().trim();

    const unit = unitRaw === "ml" ? "ml" : "g";

    const isPack = isChecked(formData.get("isPack"));

    const isActiveRaw = formData.get("isActive");

    const isActive =
      isActiveRaw === null
        ? true
        : isChecked(isActiveRaw);

    const packItems =
      formData.get("packItems")?.toString().trim() ||
      null;

    const badgeRaw =
      formData.get("badge")?.toString().trim();

    const badge = badgeRaw ? badgeRaw : null;

    /* ================= IMAGE ================= */

    let imageUrl =
      formData.get("imageUrl")?.toString().trim() || "";

    const file = formData.get("image");

    if (
      !imageUrl &&
      file &&
      typeof file !== "string" &&
      file.size > 0
    ) {
      imageUrl = await uploadFileToCloudinary(file);
    }

    if (!imageUrl) {
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

    /* ================= PRICING ================= */

    const pricing: Record<string, number> = {};

    for (const [key, value] of formData.entries()) {
      if (!key.startsWith("price_")) continue;

      const format = key.replace("price_", "").trim();

      const price = Number(value);

      if (
        format &&
        Number.isFinite(price) &&
        price > 0
      ) {
        pricing[format] = price;
      }
    }

    const rawPriceCents = Number(
      formData.get("priceCents")
    );

    const hasSimplePrice =
      Number.isFinite(rawPriceCents) &&
      rawPriceCents > 0;

    /* ================= PACK FIX ================= */

    if (isPack) {
      Object.keys(pricing).forEach((k) => {
        delete pricing[k];
      });
    }

    /* ================= FALLBACK ================= */

    if (
      !isPack &&
      Object.keys(pricing).length === 0 &&
      hasSimplePrice
    ) {
      const defaultFormat =
        unit === "ml" ? "100ml" : "100g";

      pricing[defaultFormat] = rawPriceCents;
    }

    if (
      !isPack &&
      Object.keys(pricing).length === 0
    ) {
      return NextResponse.json(
        { error: "Prix requis" },
        { status: 400 }
      );
    }

    /* ================= BASE PRICE ================= */

    const basePrice =
      (unit === "ml"
        ? pricing["100ml"]
        : pricing["100g"]) ||
      rawPriceCents ||
      Object.values(pricing)[0];

    if (
      !Number.isFinite(basePrice) ||
      basePrice <= 0
    ) {
      return NextResponse.json(
        { error: "Prix invalide" },
        { status: 400 }
      );
    }

    /* ================= CREATE ================= */

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
        priceCents: Number(basePrice),
        pricing: isPack
          ? undefined
          : (pricing as any),
        unit,
        stock,
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
      {
        error:
          error?.message || "Erreur serveur",
      },
      { status: 500 }
    );
  }
}