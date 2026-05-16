"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getImageUrl } from "@/lib/image";
import { useCart } from "@/lib/cart-context";
import { useUIStore } from "@/components/ui-providers";

type Product = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl?: string;
  stock?: number;
  badge?: string | null;
  description?: string;
  isPack?: boolean;
};

function formatPrice(price: number) {
  return (price / 100).toFixed(2).replace(".", ",") + " €";
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { openCart } = useUIStore();

  useEffect(() => {
    let mounted = true;

    fetch("/api/products", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;

        const safe = Array.isArray(data)
          ? data.filter(Boolean)
          : [];

        setProducts(safe);
      })
      .catch(() => {
        if (mounted) setProducts([]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const visibleProducts = useMemo(
    () => products.filter((p) => !p?.isPack),
    [products]
  );

  function handleAdd(product: Product) {
    const isOut = (product.stock ?? 0) <= 0;

    if (isOut) return;

    addToCart({
      id: product.id,
      name: product.name,
      priceCents: product.priceCents,
      imageUrl: getImageUrl(product.imageUrl),
      quantity: 1,
    });

    openCart();
  }

  function getBadgeStyle(badgeName?: string | null) {
    switch (badgeName) {
      case "Promo":
        return {
          ...badge,
          background: "#dc2626",
          boxShadow: "0 4px 12px rgba(220,38,38,0.35)",
        };

      case "Best Seller":
        return {
          ...badge,
          background: "#16a34a",
          boxShadow: "0 4px 12px rgba(22,163,74,0.35)",
        };

      case "Nouveau":
        return {
          ...badge,
          background: "#2563eb",
          boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
        };

      case "Premium":
        return {
          ...badge,
          background: "#111",
          color: "#d4af37",
          boxShadow: "0 4px 12px rgba(0,0,0,0.35)",
        };

      case "Top Vente":
      default:
        return {
          ...badge,
          background: "#a16207",
          boxShadow: "0 4px 12px rgba(161,98,7,0.35)",
        };
    }
  }

  return (
    <div style={page}>
      {/* ================= HERO ================= */}

      <section style={hero}>
        <div style={overlay} />

        <div style={heroContent}>
          <p style={heroTag}>VanilleOr</p>

          <h1 style={heroTitle}>
            Nos produits d’exception
          </h1>

          <p style={heroSubtitle}>
            Découvrez notre sélection premium de
            vanille et d’épices.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}

      <div style={container}>
        {loading && (
          <p style={center}>Chargement...</p>
        )}

        {!loading && visibleProducts.length === 0 && (
          <p style={center}>
            Aucun produit disponible
          </p>
        )}

        <div style={grid}>
          {visibleProducts.map((p) => {
            if (!p?.id || !p?.slug) return null;

            const isOut = (p.stock ?? 0) <= 0;

            const isLowStock =
              (p.stock ?? 0) > 0 &&
              (p.stock ?? 0) <= 5;

            return (
              <div
                key={p.id}
                style={{
                  ...card,
                  opacity: isOut ? 0.92 : 1,
                }}
                data-testid="product-card"
              >
                {/* ================= IMAGE ================= */}

                <div style={mediaWrapper}>
                  {/* PRIORITÉ RUPTURE */}
                  {isOut ? (
                    <span style={out}>
                      RUPTURE
                    </span>
                  ) : p.badge ? (
                    <span style={getBadgeStyle(p.badge)}>
                      {p.badge}
                    </span>
                  ) : null}

                  <Link
                    href={`/products/${p.slug}`}
                    style={mediaLink}
                  >
                    <img
                      src={getImageUrl(p.imageUrl)}
                      alt={p.name}
                      style={{
                        ...img,
                        filter: isOut
                          ? "grayscale(40%)"
                          : "none",
                      }}
                    />
                  </Link>
                </div>

                {/* ================= CONTENT ================= */}

                <div style={content}>
                  <h3 style={name}>
                    {p.name}
                  </h3>

                  <p style={desc}>
                    {p.description
                      ? `${p.description.slice(0, 90)}${
                          p.description.length > 90
                            ? "..."
                            : ""
                        }`
                      : "Produit premium sélectionné"}
                  </p>

                  {/* STOCK LIMITÉ */}

                  {isLowStock && !isOut && (
                    <p
                      style={stockLimited}
                      data-testid="stock-limited"
                    >
                      ⚠ Stock limité
                    </p>
                  )}

                  {/* RUPTURE */}

                  {isOut && (
                    <p style={outText}>
                      Produit actuellement indisponible
                    </p>
                  )}

                  <p style={price}>
                    {formatPrice(p.priceCents)}
                  </p>
                </div>

                {/* ================= CTA ================= */}

                <div style={ctaRow}>
                  <Link
                    href={`/products/${p.slug}`}
                    style={btnView}
                  >
                    Voir
                  </Link>

                  {isOut ? (
                    <button
                      type="button"
                      disabled
                      style={btnDisabled}
                    >
                      Épuisé
                    </button>
                  ) : (
                    <button
                      type="button"
                      style={btnAdd}
                      onClick={() => handleAdd(p)}
                    >
                      Ajouter
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page: React.CSSProperties = {
  background: "#f8f5ef",
  minHeight: "100vh",
};

const hero: React.CSSProperties = {
  position: "relative",
  height: "300px",
  backgroundImage:
    "url('/images/hero-vanille.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const overlay: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(135deg,#000000cc,#2a2117cc)",
};

const heroContent: React.CSSProperties = {
  position: "relative",
  textAlign: "center",
  color: "white",
  paddingTop: "85px",
  paddingInline: "20px",
};

const heroTag: React.CSSProperties = {
  color: "#d4af37",
  letterSpacing: "0.3em",
  fontWeight: 800,
};

const heroTitle: React.CSSProperties = {
  fontSize: "32px",
  marginTop: "10px",
  marginBottom: "10px",
};

const heroSubtitle: React.CSSProperties = {
  color: "#ddd",
  maxWidth: "700px",
  margin: "0 auto",
};

const container: React.CSSProperties = {
  padding: "40px 20px",
  maxWidth: "1200px",
  margin: "0 auto",
};

const center: React.CSSProperties = {
  textAlign: "center",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(260px,1fr))",
  gap: "24px",
};

const card: React.CSSProperties = {
  background: "white",
  borderRadius: "18px",
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.25s ease",
};

const mediaWrapper: React.CSSProperties = {
  position: "relative",
};

const mediaLink: React.CSSProperties = {
  display: "block",
  textDecoration: "none",
  color: "#111",
};

const img: React.CSSProperties = {
  width: "100%",
  height: "220px",
  objectFit: "cover",
  display: "block",
};

const content: React.CSSProperties = {
  padding: "15px",
  flex: 1,
};

const name: React.CSSProperties = {
  margin: 0,
  fontWeight: 700,
  marginBottom: "8px",
};

const desc: React.CSSProperties = {
  color: "#666",
  fontSize: "14px",
  margin: "0 0 12px",
  lineHeight: 1.5,
};

const stockLimited: React.CSSProperties = {
  color: "#dc2626",
  fontSize: "13px",
  fontWeight: 700,
  margin: "0 0 10px",
};

const outText: React.CSSProperties = {
  color: "#dc2626",
  fontSize: "13px",
  fontWeight: 700,
  margin: "0 0 10px",
};

const price: React.CSSProperties = {
  color: "#a16207",
  fontWeight: 700,
  fontSize: "22px",
  margin: 0,
};

const ctaRow: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  padding: "10px 15px 15px",
};

const btnView: React.CSSProperties = {
  flex: 1,
  background: "#111",
  color: "white",
  padding: "10px",
  textAlign: "center",
  textDecoration: "none",
  borderRadius: "8px",
  fontWeight: 600,
};

const btnAdd: React.CSSProperties = {
  flex: 1,
  background: "#a16207",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 600,
};

const btnDisabled: React.CSSProperties = {
  flex: 1,
  background: "#e5e5e5",
  border: "none",
  borderRadius: "8px",
  color: "#777",
  cursor: "not-allowed",
  fontWeight: 600,
};

const badge: React.CSSProperties = {
  position: "absolute",
  top: 12,
  left: 12,
  color: "white",
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  zIndex: 2,
  fontWeight: 700,
  letterSpacing: "0.3px",
};

const out: React.CSSProperties = {
  position: "absolute",
  top: 12,
  right: 12,
  background: "#dc2626",
  color: "white",
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  zIndex: 3,
  fontWeight: 800,
  boxShadow: "0 4px 12px rgba(220,38,38,0.35)",
};