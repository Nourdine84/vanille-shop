import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import ClientProduct from "./product-client";
import { getImageUrl } from "@/lib/image";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ProductPageProps = {
  params: {
    slug: string;
  };
};

/* =========================
   METADATA PREMIUM
========================= */

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  try {
    const product =
      await prisma.product.findUnique({
        where: {
          slug: params.slug.toLowerCase(),
        },
      });

    if (!product) {
      return {
        title:
          "Produit introuvable | Vanille’Or",

        description:
          "Vanille premium de Madagascar",
      };
    }

    const title = `${product.name} | Vanille’Or`;

    const description =
      product.description?.trim() ||
      `Découvrez ${product.name}, un produit premium Vanille’Or.`;

    const image = getImageUrl(
      product.imageUrl ||
        "/images/product-placeholder.jpg"
    );

    return {
      metadataBase: new URL(
        process.env
          .NEXT_PUBLIC_SITE_URL ||
          "http://localhost:3000"
      ),

      title,

      description,

      keywords: [
        "vanille de Madagascar",
        "vanille premium",
        "gousse de vanille",
        "épices premium",
        "Vanille’Or",
        product.name,
      ],

      robots: {
        index: true,
        follow: true,
      },

      alternates: {
        canonical: `/product/${product.slug}`,
      },

      openGraph: {
        title,
        description,

        type: "website",

        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
      },

      twitter: {
        card: "summary_large_image",

        title,

        description,

        images: [image],
      },
    };
  } catch (error) {
    console.error(
      "❌ METADATA ERROR:",
      error
    );

    return {
      title: "Produit | Vanille’Or",

      description:
        "Vanille premium de Madagascar",
    };
  }
}

/* =========================
   PAGE
========================= */

export default async function ProductPage({
  params,
}: ProductPageProps) {
  try {
    const product =
      await prisma.product.findUnique({
        where: {
          slug: params.slug.toLowerCase(),
        },
      });

    if (
      !product ||
      !product.isActive
    ) {
      return notFound();
    }

    /* =========================
       RELATED PRODUCTS
    ========================= */

    const relatedProducts =
      await prisma.product.findMany({
        where: {
          category:
            product.category,

          id: {
            not: product.id,
          },

          isActive: true,
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 3,
      });

    /* =========================
       JSON SAFE
    ========================= */

    const safeProduct = JSON.parse(
      JSON.stringify({
        ...product,

        relatedProducts,

        isOutOfStock:
          product.stock <= 0,
      })
    );

    /* =========================
       JSON LD SEO
    ========================= */

    const jsonLd = {
      "@context":
        "https://schema.org",

      "@type": "Product",

      name: product.name,

      image: [
        getImageUrl(
          product.imageUrl ||
            "/images/product-placeholder.jpg"
        ),
      ],

      description:
        product.description ||
        `${product.name} - Vanille premium de Madagascar`,

      brand: {
        "@type": "Brand",

        name: "Vanille’Or",
      },

      offers: {
        "@type": "Offer",

        priceCurrency: "EUR",

        price: (
          product.priceCents / 100
        ).toFixed(2),

        availability:
          product.stock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",

        url: `${
          process.env
            .NEXT_PUBLIC_SITE_URL ||
          "http://localhost:3000"
        }/product/${product.slug}`,
      },
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html:
              JSON.stringify(jsonLd),
          }}
        />

        <ClientProduct
          product={safeProduct}
        />
      </>
    );
  } catch (error) {
    console.error(
      "❌ PRODUCT PAGE ERROR:",
      error
    );

    return notFound();
  }
}