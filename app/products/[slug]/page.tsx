import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ClientProduct from "./product-client";
import { getImageUrl } from "@/lib/image";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ProductPageProps = {
  params: { slug: string };
};

/* =========================
   METADATA
========================= */
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug.toLowerCase() },
    });

    if (!product) {
      return {
        title: "Produit introuvable | Vanille’Or",
        description: "Vanille premium de Madagascar",
      };
    }

    const title = `${product.name} | Vanille’Or`;
    const description =
      product.description?.trim() ||
      `Découvrez ${product.name}, un produit premium Vanille’Or.`;

    const image = getImageUrl(product.imageUrl);

    return {
      metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      ),
      title,
      description,
      openGraph: {
        title,
        description,
        images: [image],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch (error) {
    console.error("❌ METADATA ERROR:", error);

    return {
      title: "Produit | Vanille’Or",
      description: "Vanille premium de Madagascar",
    };
  }
}

/* =========================
   PAGE
========================= */
export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: params.slug.toLowerCase() },
    });

    if (!product || !product.isActive) {
      return notFound();
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        category: product.category,
        id: { not: product.id },
        isActive: true,
      },
      take: 3,
    });

    /* =========================
       🔥 FIX IMPORTANT
       - Ajout flag stock
    ========================= */

    const safeProduct = JSON.parse(
      JSON.stringify({
        ...product,
        relatedProducts,
        isOutOfStock: product.stock <= 0,
      })
    );

    return <ClientProduct product={safeProduct} />;
  } catch (error) {
    console.error("❌ PRODUCT PAGE ERROR:", error);
    return notFound();
  }
}