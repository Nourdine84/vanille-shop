import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ClientProduct from "./product-client";
import { getImageUrl } from "@/lib/image";

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
        description: "Découvrez notre sélection premium de vanille et d’épices.",
      };
    }

    const title = `${product.name} | Vanille’Or`;
    const description =
      product.description?.trim() ||
      `Découvrez ${product.name}, un produit premium sélectionné par Vanille’Or.`;

    const image = getImageUrl(product.imageUrl);

    const keywords =
      product.category === "epices"
        ? [
            "épices premium",
            "épices de Madagascar",
            "acheter épices en ligne",
            product.name.toLowerCase(),
            "Vanille’Or",
          ]
        : [
            "vanille premium",
            "vanille de Madagascar",
            "acheter vanille en ligne",
            product.name.toLowerCase(),
            "Vanille’Or",
          ];

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        images: [image],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch {
    return {
      title: "Produit | Vanille’Or",
      description: "Découvrez notre sélection premium de vanille et d’épices.",
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const products = await prisma.product.findMany({
    where: { isActive: true },
  });

  const product = products.find(
    (p) => normalizeSlug(p.slug || p.name) === params.slug
  );

  if (!product) {
    notFound();
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
}