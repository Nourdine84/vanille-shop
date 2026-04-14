"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useUIStore } from "@/components/ui-providers";
import RecommendedProducts from "@/components/RecommendedProducts";
import PackUpsell from "@/components/PackUpsell";

type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  stock: number;
  category: string;
  badge?: string | null;
  unit?: string;
};

type QuantityOption = {
  label: string;
  multiplier: number;
};

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

function getQuantityOptions(unit?: string): QuantityOption[] {
  switch ((unit || "g").toLowerCase()) {
    case "cl":
      return [
        { label: "10cl", multiplier: 1 },
        { label: "25cl", multiplier: 2.5 },
        { label: "50cl", multiplier: 5 },
        { label: "1L", multiplier: 10 },
      ];
    case "l":
      return [
        { label: "0.5L", multiplier: 0.5 },
        { label: "1L", multiplier: 1 },
        { label: "2L", multiplier: 2 },
        { label: "5L", multiplier: 5 },
      ];
    case "g":
    default:
      return [
        { label: "10g", multiplier: 1 },
        { label: "50g", multiplier: 5 },
        { label: "100g", multiplier: 10 },
        { label: "200g", multiplier: 20 },
        { label: "500g", multiplier: 50 },
        { label: "1kg", multiplier: 100 },
      ];
  }
}

export default function ProductDetailClient({
  product,
}: {
  product: ProductDetail;
}) {
  const { addToCart } = useCart();
  const { openCart } = useUIStore();

  const quantities = useMemo(
    () => getQuantityOptions(product.unit),
    [product.unit]
  );

  const defaultIndex =
    product.unit === "g" ? 2 : 0;

  const [selectedQty, setSelectedQty] = useState<QuantityOption>(
    quantities[Math.min(defaultIndex, quantities.length - 1)]
  );

  const dynamicPrice = Math.round(product.priceCents * selectedQty.multiplier);
  const isOutOfStock = product.stock <= 0;

  function handleAddToCart() {
    addToCart({
      id: `${product.id}-${selectedQty.label}`,
      name: `${product.name} (${selectedQty.label})`,
      priceCents: dynamicPrice,
      imageUrl: product.imageUrl,
      quantity: 1,
    });

    openCart();
  }

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
              src={product.imageUrl}
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

            <p style={price}>{formatPrice(dynamicPrice)}</p>

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

            <div style={qtyRow}>
              {quantities.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => setSelectedQty(q)}
                  style={{
                    ...qtyBtn,
                    background:
                      selectedQty.label === q.label ? "#a16207" : "#ececec",
                    color:
                      selectedQty.label === q.label ? "white" : "#333",
                    border:
                      selectedQty.label === q.label
                        ? "2px solid #8b5e14"
                        : "2px solid transparent",
                  }}
                >
                  {q.label}
                </button>
              ))}
            </div>

            {!isOutOfStock ? (
              <button type="button" onClick={handleAddToCart} style={ctaBtn}>
                Ajouter au panier
              </button>
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

      <div style={upsellSection}>
        <PackUpsell
          currentProductId={product.id}
          currentCategory={product.category || undefined}
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
  flexWrap: "wrap",
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
  marginBottom: 18,
};

const qtyRow: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginBottom: 18,
};

const qtyBtn: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "2px solid transparent",
  cursor: "pointer",
  fontWeight: 700,
};

const ctaBtn: React.CSSProperties = {
  background: "#a16207",
  color: "white",
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  fontWeight: 700,
  width: "100%",
  cursor: "pointer",
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

const upsellSection: React.CSSProperties = {
  marginTop: 32,
};