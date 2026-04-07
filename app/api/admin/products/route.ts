import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================
   TYPES
========================= */

type ProductPayload = {
  id?: string | null;
  name?: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  subCategory?: string | null;
  badge?: string | null;
  priceCents?: number | string;
  stock?: number | string;
  isActive?: boolean | string;
};

/* =========================
   UTILS
========================= */

function normalizeSlug(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeImageUrl(image?: string) {
  if (!image || image.trim() === "") {
    return "default.jpg";
  }

  const clean = image
    .trim()
    .replace(/^\/+/, "")
    .replace(/^products\//, "")
    .replace(/^images\//, "")
    .replace(/^image\//, "")
    .replace(/^imae\//, "");

  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    return clean;
  }

  return clean;
}

/* =========================
   PARSE BODY SAFE
========================= */

async function parseBody(req: Request): Promise<ProductPayload> {
  const contentType = req.headers.get("content-type") || "";

  if (
    contentType.includes("multipart/form-data") ||
    contentType.includes("application/x-www-form-urlencoded")
  ) {
    const formData = await req.formData();

    return {
      id: formData.get("id")?.toString() || null,
      name: formData.get("name")?.toString() || "",
      slug: formData.get("slug")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      imageUrl: formData.get("imageUrl")?.toString() || "",
      category: formData.get("category")?.toString() || "vanille",
      subCategory: formData.get("subCategory")?.toString() || null,
      badge: formData.get("badge")?.toString() || null,
      priceCents: formData.get("priceCents")?.toString() || 0,
      stock: formData.get("stock")?.toString() || 0,
      isActive: formData.get("isActive") === "on",
    };
  }

  if (contentType.includes("application/json")) {
    return await req.json();
  }

  throw new Error("Content-Type non supporté");
}

/* =========================
   POST (CREATE + UPDATE)
========================= */

export async function POST(req: Request) {
  try {
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return NextResponse.json({ ok: true });
    }

    const { prisma } = await import("@/lib/prisma");
    const body = await parseBody(req);

    const id = body.id || null;
    const name = body.name?.trim() || "";
    const slug = normalizeSlug(body.slug || name);

    const priceCents = Number(body.priceCents || 0);
    const stock = Number(body.stock || 0);
    const imageUrl = normalizeImageUrl(body.imageUrl);
    const category = body.category?.trim().toLowerCase() || "vanille";

    const subCategory =
      body.subCategory && body.subCategory.trim() !== ""
        ? body.subCategory.trim()
        : null;

    const badge =
      body.badge && body.badge.trim() !== ""
        ? body.badge.trim()
        : null;

    const isActive =
      body.isActive === true ||
      body.isActive === "true" ||
      body.isActive === "on";

    /* =========================
       VALIDATION
    ========================= */

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Nom et slug requis" },
        { status: 400 }
      );
    }

    if (!priceCents || isNaN(priceCents) || priceCents <= 0) {
      return NextResponse.json(
        { error: "Prix invalide" },
        { status: 400 }
      );
    }

    /* =========================
       DATA
    ========================= */

    const data = {
      name,
      slug,
      description: body.description?.trim() || "",
      priceCents,
      imageUrl,
      stock: isNaN(stock) ? 0 : stock,
      category,
      subCategory,
      badge,
      isActive,
    };

    /* =========================
       CREATE
    ========================= */

    if (!id) {
      const exists = await prisma.product.findUnique({
        where: { slug },
      });

      if (exists) {
        return NextResponse.json(
          { error: "Slug déjà utilisé" },
          { status: 400 }
        );
      }

      const created = await prisma.product.create({ data });

      console.log("✅ PRODUCT CREATED:", created.id);

      return NextResponse.json({
        success: true,
        product: created,
      });
    }

    /* =========================
       UPDATE
    ========================= */

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Produit introuvable" },
        { status: 404 }
      );
    }

    if (existing.slug !== slug) {
      const exists = await prisma.product.findUnique({
        where: { slug },
      });

      if (exists) {
        return NextResponse.json(
          { error: "Slug déjà utilisé" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data,
    });

    console.log("✏️ PRODUCT UPDATED:", updated.id);

    return NextResponse.json({
      success: true,
      product: updated,
    });
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