import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSafeId(id: string | string[] | undefined) {
  if (!id) return "";
  return Array.isArray(id) ? id[0] : id;
}

function normalizeSlug(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toNumber(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizePricing(raw: unknown) {
  if (!raw || typeof raw !== "object") return {};

  const result: Record<string, number> = {};

  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    const n = Number(value);
    if (Number.isFinite(n) && n > 0) {
      result[key] = n;
    }
  }

  return result;
}

/* =========================
   GET
========================= */
export async function GET(
  req: Request,
  { params }: { params: { id: string | string[] } }
) {
  try {
    if (!isAdminRequest(req)) {
      return unauthorizedResponse();
    }

    const id = getSafeId(params.id);

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produit introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("🔥 GET ERROR:", error);

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

/* =========================
   PUT
========================= */
export async function PUT(
  req: Request,
  { params }: { params: { id: string | string[] } }
) {
  try {
    if (!isAdminRequest(req)) {
      return unauthorizedResponse();
    }

    const id = getSafeId(params.id);

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const body = await req.json();

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const slugInput =
      typeof body?.slug === "string" ? body.slug.trim() : "";
    const slug = normalizeSlug(slugInput || name);
    const description =
      typeof body?.description === "string" ? body.description.trim() : "";
    const imageUrl =
      typeof body?.imageUrl === "string" ? body.imageUrl.trim() : "";
    const category =
      typeof body?.category === "string" ? body.category.trim() : "vanille";
    const badge =
      typeof body?.badge === "string" && body.badge.trim()
        ? body.badge.trim()
        : null;
    const unit = body?.unit === "ml" ? "ml" : "g";

    const stock = toNumber(body?.stock, -1);
    const isActive = Boolean(body?.isActive);
    const isPack = Boolean(body?.isPack);
    const packItems =
      typeof body?.packItems === "string" && body.packItems.trim()
        ? body.packItems.trim()
        : null;

    if (!name) {
      return NextResponse.json(
        { error: "Le nom est requis" },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { error: "Le slug est requis" },
        { status: 400 }
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: "L'image est requise" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(stock) || stock < 0) {
      return NextResponse.json(
        { error: "Le stock est invalide" },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Produit introuvable" },
        { status: 404 }
      );
    }

    const conflictingSlug = await prisma.product.findFirst({
      where: {
        slug,
        NOT: { id },
      },
      select: { id: true },
    });

    if (conflictingSlug) {
      return NextResponse.json(
        { error: "Ce slug est déjà utilisé par un autre produit" },
        { status: 400 }
      );
    }

    let priceCents = toNumber(body?.priceCents, 0);
    let pricing: Record<string, number> = {};

    if (isPack) {
      if (!Number.isFinite(priceCents) || priceCents <= 0) {
        return NextResponse.json(
          { error: "Un prix unique est requis pour le pack" },
          { status: 400 }
        );
      }
    } else {
      pricing = normalizePricing(body?.pricing);

      if (Object.keys(pricing).length === 0) {
        return NextResponse.json(
          { error: "Au moins un prix par format est requis" },
          { status: 400 }
        );
      }

      priceCents =
        pricing["100g"] ||
        pricing["100ml"] ||
        Object.values(pricing)[0] ||
        0;

      if (!Number.isFinite(priceCents) || priceCents <= 0) {
        return NextResponse.json(
          { error: "Le prix principal est invalide" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        imageUrl,
        category,
        badge,
        unit,
        stock,
        isActive,
        isPack,
        packItems: isPack ? packItems : null,
        priceCents,
        pricing: isPack ? undefined : (pricing as any),
      },
    });

    return NextResponse.json({
      success: true,
      product: updated,
    });
  } catch (error) {
    console.error("🔥 PUT ERROR:", error);

    return NextResponse.json(
      { error: "Erreur mise à jour produit" },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE
========================= */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string | string[] } }
) {
  try {
    if (!isAdminRequest(req)) {
      return unauthorizedResponse();
    }

    const id = getSafeId(params.id);

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Produit introuvable" },
        { status: 404 }
      );
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("🔥 DELETE ERROR:", error);

    return NextResponse.json(
      { error: "Erreur suppression" },
      { status: 500 }
    );
  }
}