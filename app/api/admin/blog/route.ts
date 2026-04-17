import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

function normalizeImage(image?: string) {
  if (!image || image.trim() === "") return "default.jpg";

  const clean = image.trim();

  if (clean.startsWith("http")) return clean;

  return clean.replace(/^\/+/, "");
}

/* ================= POST ================= */

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const id = form.get("id")?.toString() || null;
    const title = form.get("title")?.toString().trim() || "";
    const rawSlug = form.get("slug")?.toString() || "";
    const excerpt = form.get("excerpt")?.toString().trim() || "";
    const content = form.get("content")?.toString().trim() || "";
    const coverImageRaw = form.get("coverImage")?.toString() || "";

    const slug = normalizeSlug(rawSlug || title);
    const coverImage = normalizeImage(coverImageRaw);

    /* ================= VALIDATION ================= */

    if (!title || !content) {
      return NextResponse.json(
        { error: "Titre et contenu requis" },
        { status: 400 }
      );
    }

    /* ================= CREATE ================= */

    if (!id) {
      const existing = await prisma.blogPost.findUnique({
        where: { slug },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Slug déjà utilisé" },
          { status: 400 }
        );
      }

      const created = await prisma.blogPost.create({
        data: {
          title,
          slug,
          excerpt,
          content,
          coverImage,
        },
      });

      return NextResponse.json({
        success: true,
        mode: "create",
        post: created,
      });
    }

    /* ================= UPDATE ================= */

    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Article introuvable" },
        { status: 404 }
      );
    }

    if (existingPost.slug !== slug) {
      const slugUsed = await prisma.blogPost.findUnique({
        where: { slug },
      });

      if (slugUsed) {
        return NextResponse.json(
          { error: "Slug déjà utilisé" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
      },
    });

    return NextResponse.json({
      success: true,
      mode: "update",
      post: updated,
    });

  } catch (error) {
    console.error("🔥 BLOG API ERROR:", error);

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}