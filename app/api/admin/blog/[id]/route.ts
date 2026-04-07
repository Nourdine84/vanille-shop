import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSafeId(id: string | string[] | undefined) {
  if (!id) return "";
  return Array.isArray(id) ? id[0] : id;
}

export async function GET(
  _: Request,
  { params }: { params: { id: string | string[] } }
) {
  try {
    const id = getSafeId(params.id);

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Article introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("🔥 GET BLOG POST ERROR:", error);

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string | string[] } }
) {
  try {
    const id = getSafeId(params.id);

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const formData = await req.formData();
    const method = formData.get("_method")?.toString();

    if (method !== "DELETE") {
      return NextResponse.json(
        { error: "Méthode non supportée" },
        { status: 405 }
      );
    }

    const existing = await prisma.blogPost.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Article introuvable" },
        { status: 404 }
      );
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.redirect(new URL("/admin/blog", req.url));
  } catch (error) {
    console.error("🔥 DELETE BLOG POST ERROR:", error);

    return NextResponse.json(
      { error: "Erreur suppression article" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string | string[] } }
) {
  try {
    const id = getSafeId(params.id);

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const existing = await prisma.blogPost.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Article introuvable" },
        { status: 404 }
      );
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Article supprimé",
    });
  } catch (error) {
    console.error("🔥 DELETE BLOG POST ERROR:", error);

    return NextResponse.json(
      { error: "Erreur suppression article" },
      { status: 500 }
    );
  }
}