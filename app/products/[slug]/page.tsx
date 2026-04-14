import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AddToCart from "@/components/add-to-cart";
import { getImageUrl } from "@/lib/image";
import RecommendedProducts from "@/components/RecommendedProducts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

function normalizeSlug(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const urlSlug = normalizeSlug(params.slug);

  let product = await prisma.product.findFirst({
    where: {
      isActive: true,
      slug: {
        equals: urlSlug,
        mode: "insensitive",
      },
    },
  });

  if (!product) {
    product = await prisma.product.findFirst({
      where: {
        isActive: true,
        slug: {
          contains: urlSlug,
          mode: "insensitive",
        },
      },
    });
  }

  if (!product) {
    product = await prisma.product.findFirst({
      where: {
        isActive: true,
        name: {
          contains: urlSlug.replace(/-/g, " "),
          mode: "insensitive",
        },
      },
    });
  }

  if (!product) return notFound();

  const isOutOfStock = product.stock <= 0;
  const productImageUrl = getImageUrl(product.imageUrl);

  return (
    <div style={page}>
      <div style={breadcrumb}>
        <Link href="/">Accueil</Link> /{" "}
        <Link href="/products">Produits</Link> /{" "}
        <strong>{product.name}</strong>
      </div>

      <div style={heroCard}>
        <div style={layout}>
          <div style={imageBox}>
            <img
              src={productImageUrl}
              alt={product.name}
              style={image}
            />
          </div>

          <div style={contentCol}>
            <p style={category}>{product.category}</p>

            <h1 style={title}>{product.name}</h1>

            <div style={badges}>
              {product.badge && <span style={badge}>{product.badge}</span>}

              {product.stock < 5 && !isOutOfStock && (
                <span style={badgeDanger}>⚠ Stock limité</span>
              )}
            </div>

            <p style={price}>{formatPrice(product.priceCents)}</p>

            <p style={stock}>
              {isOutOfStock
                ? "❌ Rupture de stock"
                : `✅ En stock : ${product.stock}`}
            </p>

            <div style={valueBox}>
              ⭐ Qualité premium Madagascar
              <br />
              🚀 Livraison rapide
              <br />
              👨‍🍳 Idéal pâtisserie & cuisine
            </div>

            <p style={description}>
              {product.description || "Description à venir."}
            </p>

            {!isOutOfStock ? (
              <AddToCart
                product={{
                  id: product.id,
                  name: product.name,
                  priceCents: product.priceCents,
                  imageUrl: productImageUrl,
                }}
              />
            ) : (
              <button type="button" disabled style={ctaDisabled}>
                Produit épuisé
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={recoSection}>
        <RecommendedProducts
          currentProductId={product.id}
          category={product.category || undefined}
        />
      </div>
    </div>
  );
}

const page: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: 40,
};

const breadcrumb: React.CSSProperties = {
  marginBottom: 20,
};

const heroCard: React.CSSProperties = {
  background: "linear-gradient(180deg, #ffffff 0%, #fbf8f3 100%)",
  borderRadius: 24,
  padding: 24,
  boxShadow: "0 18px 40px rgba(20,20,20,0.06)",
  border: "1px solid rgba(180,140,80,0.12)",
};

const layout: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 40,
  alignItems: "start",
};

const imageBox: React.CSSProperties = {
  background: "white",
  padding: 18,
  borderRadius: 18,
  border: "1px solid #efe6d7",
};

const image: React.CSSProperties = {
  width: "100%",
  borderRadius: 16,
  objectFit: "cover",
  display: "block",
};

const contentCol: React.CSSProperties = {
  minWidth: 0,
};

const category: React.CSSProperties = {
  color: "#a16207",
  marginBottom: 8,
  fontWeight: 700,
};

const title: React.CSSProperties = {
  fontSize: 38,
  marginBottom: 14,
};

const badges: React.CSSProperties = {
  display: "flex",
  gap: 10,
  marginBottom: 16,
};

const badge: React.CSSProperties = {
  background: "#f59e0b",
  padding: "6px 10px",
  borderRadius: 10,
  color: "white",
  fontSize: 13,
};

const badgeDanger: React.CSSProperties = {
  background: "#dc2626",
  padding: "6px 10px",
  borderRadius: 10,
  color: "white",
  fontSize: 13,
};

const price: React.CSSProperties = {
  fontSize: 30,
  fontWeight: 800,
  marginBottom: 10,
};

const stock: React.CSSProperties = {
  marginBottom: 16,
  fontWeight: 600,
};

const valueBox: React.CSSProperties = {
  background: "#fff7ed",
  padding: 15,
  borderRadius: 12,
  margin: "15px 0",
};

const description: React.CSSProperties = {
  lineHeight: 1.7,
};

const ctaDisabled: React.CSSProperties = {
  background: "#e5e7eb",
  color: "#9ca3af",
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  fontWeight: 700,
  width: "100%",
};

const recoSection: React.CSSProperties = {
  marginTop: 56,
};