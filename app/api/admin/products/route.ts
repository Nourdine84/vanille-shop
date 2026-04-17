import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ================= TYPES ================= */

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
  unit?: string;
  isPack?: boolean | string;
  packItems?: string | null;
};

/* ================= HELPERS ================= */

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
  if (!image || image.trim() === "") return "default.jpg";

  const clean = image
    .trim()
    .replace(/^\/+/, "")
    .replace(/^products\//, "")
    .replace(/^images\//, "");

  if (clean.startsWith("http")) return clean;

  return clean;
}

/* 🔥 AJOUT ML + NORMALISATION PRO */
function normalizeUnit(unit?: string) {
  const value = (unit || "g").trim().toLowerCase();

  const allowed = ["g", "kg", "ml", "cl", "l"];
  return allowed.includes(value) ? value : "g";
}

function toNumber(value: any, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/* ================= BODY ================= */

async function parseBody(req: Request): Promise<ProductPayload> {
  const contentType = req.headers.get("content-type") || "";

  if (contentType.includes("form")) {
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
      priceCents: formData.get("priceCents")?.toString() || "0",
      stock: formData.get("stock")?.toString() || "0",
      isActive: formData.get("isActive") === "on",
      unit: formData.get("unit")?.toString() || "g",
      isPack: formData.get("isPack") === "on",
      packItems: formData.get("packItems")?.toString() || null,
    };
  }

  if (contentType.includes("application/json")) {
    return await req.json();
  }

  throw new Error("Content-Type non supporté");
}

/* ================= GET ================= */

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("🔥 ADMIN GET:", error);

    return NextResponse.json(
      { error: "Erreur récupération produits" },
      { status: 500 }
    );
  }
}

/* ================= POST ================= */

export async function POST(req: Request) {
  try {
    const body = await parseBody(req);

    const id = body.id || null;
    const name = body.name?.trim() || "";
    const slug = normalizeSlug(body.slug || name);

    const data = {
      name,
      slug,
      description: body.description?.trim() || "",
      imageUrl: normalizeImageUrl(body.imageUrl),
      priceCents: toNumber(body.priceCents),
      stock: toNumber(body.stock),
      category: (body.category || "vanille").toLowerCase(),
      subCategory: body.subCategory || null,
      badge: body.badge || null,
      isActive: !!body.isActive,
      isPack: !!body.isPack,
      packItems: body.packItems || null,
    };

    /* VALIDATION */
    if (!name) {
      return NextResponse.json(
        { error: "Nom requis" },
        { status: 400 }
      );
    }

    if (data.priceCents <= 0) {
      return NextResponse.json(
        { error: "Prix invalide" },
        { status: 400 }
      );
    }

    if (data.stock < 0) {
      return NextResponse.json(
        { error: "Stock invalide" },
        { status: 400 }
      );
    }

    /* CREATE */
    if (!id) {
      const exists = await prisma.product.findFirst({
        where: { slug },
      });

      if (exists) {
        return NextResponse.json(
          { error: "Slug déjà utilisé" },
          { status: 400 }
        );
      }

      const product = await prisma.product.create({ data });

      return NextResponse.json({ success: true, product });
    }

    /* UPDATE */
    const product = await prisma.product.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, product });

  } catch (error: any) {
    console.error("🔥 ADMIN POST:", error);

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}