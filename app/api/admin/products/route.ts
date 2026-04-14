import { NextResponse } from "next/server";

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
  pricing?: any; // 🔥 NEW
};

/* ================= UTILS ================= */

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

  const clean = image.trim();

  if (clean.startsWith("http")) return clean;

  return clean
    .replace(/^.*[\\/]/, "")
    .replace(/^images\//, "")
    .replace(/^products\//, "");
}

function normalizeUnit(unit?: string) {
  const u = (unit || "g").toLowerCase();
  if (["g", "cl", "l"].includes(u)) return u;
  return "g";
}

/* ================= PARSE ================= */

async function parseBody(req: Request): Promise<ProductPayload> {
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
    unit: formData.get("unit")?.toString() || "g",
    isPack: formData.get("isPack") === "on",
    packItems: formData.get("packItems")?.toString() || null,

    // 🔥 NEW PRICING
    pricing: formData.get("pricing")
      ? JSON.parse(formData.get("pricing")!.toString())
      : null,
  };
}

/* ================= POST ================= */

export async function POST(req: Request) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const body = await parseBody(req);

    const id = body.id || null;
    const name = body.name?.trim() || "";
    const slug = normalizeSlug(body.slug || name);

    const priceCents = Number(body.priceCents || 0);
    const stock = Number(body.stock || 0);

    const data = {
      name,
      slug,
      description: body.description?.trim() || "",
      priceCents,
      imageUrl: normalizeImageUrl(body.imageUrl),
      stock,
      category: body.category || "vanille",
      subCategory: body.subCategory,
      badge: body.badge,
      isActive: body.isActive === true,
      unit: normalizeUnit(body.unit),
      isPack: body.isPack === true,
      packItems: body.packItems,

      // 🔥 PRICING
      pricing: body.pricing,
    };

    if (!name || !slug) {
      return NextResponse.json({ error: "Nom requis" }, { status: 400 });
    }

    if (priceCents <= 0) {
      return NextResponse.json({ error: "Prix invalide" }, { status: 400 });
    }

    if (!id) {
      const created = await prisma.product.create({ data });
      return NextResponse.json({ success: true, product: created });
    }

    const updated = await prisma.product.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, product: updated });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}