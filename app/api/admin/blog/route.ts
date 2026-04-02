import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const prisma = (await import("@/lib/prisma")).prisma as any;

    const formData = await req.formData();

    const title = formData.get("title")?.toString().trim() || "";
    const slugRaw = formData.get("slug")?.toString().trim() || "";
    const excerpt = formData.get("excerpt")?.toString().trim() || "";
    const content = formData.get("content")?.toString().trim() || "";

    // ✅ FIX IMPORTANT
    const coverImage =
      formData.get("coverImage")?.toString().trim() || null;

    // 🔥 Normalisation slug
    const slug = slugRaw
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    // 🔥 Validation
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    // 🔥 Check unicité slug
    const existing = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Slug déjà utilisé" },
        { status: 400 }
      );
    }

    // 🔥 CREATE
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage, // ✅ maintenant défini
      },
    });

    console.log("✅ BLOG CREATED:", post.id);

    return NextResponse.json(post);

  } catch (error: any) {
    console.error("🔥 BLOG ERROR:", error);

    return NextResponse.json(
      {
        error: "Erreur serveur",
        message: error?.message || "unknown",
      },
      { status: 500 }
    );
  }
}