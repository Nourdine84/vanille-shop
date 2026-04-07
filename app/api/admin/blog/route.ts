import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const id = form.get("id")?.toString();
    const title = form.get("title")?.toString().trim() || "";
    const rawSlug = form.get("slug")?.toString() || "";
    const excerpt = form.get("excerpt")?.toString().trim() || "";
    const content = form.get("content")?.toString().trim() || "";
    const coverImage = form.get("coverImage")?.toString().trim() || "";

    const slug = normalizeSlug(rawSlug || title);

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Champs requis" },
        { status: 400 }
      );
    }

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

      await prisma.blogPost.create({
        data: {
          title,
          slug,
          excerpt,
          content,
          coverImage,
        },
      });

      return NextResponse.redirect(new URL("/admin/blog", req.url));
    }

    const currentPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!currentPost) {
      return NextResponse.json(
        { error: "Article introuvable" },
        { status: 404 }
      );
    }

    if (currentPost.slug !== slug) {
      const slugAlreadyUsed = await prisma.blogPost.findUnique({
        where: { slug },
      });

      if (slugAlreadyUsed) {
        return NextResponse.json(
          { error: "Slug déjà utilisé" },
          { status: 400 }
        );
      }
    }

    await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
      },
    });

    return NextResponse.redirect(new URL("/admin/blog", req.url));
  } catch (error) {
    console.error("BLOG API ERROR:", error);

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}