import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================
   GET REVIEWS
========================= */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId")?.trim();

    if (!productId) {
      return NextResponse.json([], { status: 200 });
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error("❌ GET REVIEWS ERROR:", error);

    return NextResponse.json(
      { error: "Erreur récupération avis" },
      { status: 500 }
    );
  }
}

/* =========================
   CREATE REVIEW
========================= */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const productId =
      typeof body?.productId === "string" ? body.productId.trim() : "";
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const comment =
      typeof body?.comment === "string" ? body.comment.trim() : "";
    const rating = Number(body?.rating);

    if (!productId || !name || !comment || !Number.isFinite(rating)) {
      return NextResponse.json(
        { error: "Champs requis" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "La note doit être comprise entre 1 et 5" },
        { status: 400 }
      );
    }

    const productExists = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });

    if (!productExists) {
      return NextResponse.json(
        { error: "Produit introuvable" },
        { status: 404 }
      );
    }

    const review = await prisma.review.create({
      data: {
        productId,
        name,
        rating,
        comment,
      },
    });

    return NextResponse.json(
      { success: true, review },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ CREATE REVIEW ERROR:", error);

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}