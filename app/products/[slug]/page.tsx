import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ClientProduct from "./product-client";
import { getImageUrl } from "@/lib/image";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function normalizeSlug(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type ProductPageProps = {
  params: { slug: string };
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        category: true,
      },
    });

    const product = products.find(
      (p) => normalizeSlug(p.slug || p.name) === params.slug
    );

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

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
    });

    const product = products.find(
      (p) => normalizeSlug(p.slug || p.name) === params.slug
    );

    if (!product) {
      return notFound();
    }

    const relatedProducts = products
      .filter(
        (p) =>
          p.id !== product.id &&
          p.category === product.category &&
          !p.isPack
      )
      .slice(0, 3);

    const safeProduct = JSON.parse(
      JSON.stringify({
        ...product,
        relatedProducts,
      })
    );

    return <ClientProduct product={safeProduct} />;
  } catch (error) {
    console.error("❌ PRODUCT PAGE ERROR:", error);
    return notFound();
  }
}