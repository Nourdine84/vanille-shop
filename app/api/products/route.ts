import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return NextResponse.json({ ok: true });
    }

    const { prisma } = await import("@/lib/prisma");

    const formData = await req.formData();

    const id = formData.get("id")?.toString() || null;
    const name = formData.get("name")?.toString() || "";
    const slug = formData.get("slug")?.toString() || "";
    const description = formData.get("description")?.toString() || "";
    const imageUrl = formData.get("imageUrl")?.toString() || "";
    const category = formData.get("category")?.toString() || "vanille";
    const subCategory = formData.get("subCategory")?.toString() || "";
    const badge = formData.get("badge")?.toString() || null;

    const priceCents = Number(formData.get("priceCents") || 0);
    const stock = Number(formData.get("stock") || 0);

    const isActive = formData.get("isActive") === "on";

    if (!name.trim() || !slug.trim() || priceCents <= 0) {
      return NextResponse.redirect(
        new URL("/admin/products?error=1", req.url)
      );
    }

    const cleanSlug = slug.trim().toLowerCase();

    const data = {
      name: name.trim(),
      slug: cleanSlug,
      description: description.trim(),
      priceCents,
      imageUrl: imageUrl.trim(),
      stock,
      category: category.trim().toLowerCase(),
      subCategory: subCategory.trim(),
      badge,
      isActive,
    };

    if (!id) {
      const existing = await prisma.product.findUnique({
        where: { slug: cleanSlug },
      });

      if (existing) {
        return NextResponse.redirect(
          new URL("/admin/products?error=slug", req.url)
        );
      }
    }

    if (id) {
      await prisma.product.update({
        where: { id },
        data,
      });

      return NextResponse.redirect(
        new URL("/admin/products?success=update", req.url)
      );
    }

    await prisma.product.create({
      data,
    });

    return NextResponse.redirect(
      new URL("/admin/products?success=create", req.url)
    );

  } catch (error: any) {
    console.error("🔥 PRODUCT API ERROR:", error);

    return NextResponse.redirect(
      new URL("/admin/products?error=server", req.url)
    );
  }
}