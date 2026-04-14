"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getImageUrl } from "@/lib/image";
import { useCart } from "@/lib/cart-context";
import { useUIStore } from "@/components/ui-providers";

type Product = {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  imageUrl?: string;
  stock?: number;
  isPack?: boolean;
  packItems?: string | null;
  category?: string;
};

type PackUpsellProps = {
  currentProductId?: string;
  currentCategory?: string;
};

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

function formatPackItems(items?: string | null) {
  if (!items) return [];
  return items
    .split("+")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getOldPrice(price: number) {
  return Math.round(price * 1.3);
}

function getDiscount(current: number, old: number) {
  return Math.round(((old - current) / old) * 100);
}

export default function PackUpsell({
  currentProductId,
  currentCategory,
}: PackUpsellProps) {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { openCart } = useUIStore();

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json();

        if (!isMounted) return;
        setItems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ PACK UPSELL ERROR:", error);
        if (isMounted) setItems([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const packs = useMemo(() => {
    const allPacks = items.filter((item) => item.isPack && item.id !== currentProductId);

    const sameCategory = allPacks.filter(
      (item) => currentCategory && item.category === currentCategory
    );

    return (sameCategory.length > 0 ? sameCategory : allPacks).slice(0, 3);
  }, [items, currentProductId, currentCategory]);

  function handleAdd(pack: Product) {
    addToCart({
      id: pack.id,
      name: pack.name,
      priceCents: pack.priceCents,
      imageUrl: getImageUrl(pack.imageUrl),
      quantity: 1,
    });

    openCart();
  }

  if (loading || packs.length === 0) return null;

  return (
    <section style={section}>
      <div style={header}>
        <p style={eyebrow}>Suggestion premium</p>
        <h2 style={title}>Complétez votre sélection</h2>
        <p style={subtitle}>
          Nos packs sont pensés pour augmenter la valeur perçue et offrir une
          expérience plus complète autour de VanilleOr.
        </p>
      </div>

      <div style={grid}>
        {packs.map((pack) => {
          const oldPrice = getOldPrice(pack.priceCents);
          const discount = getDiscount(pack.priceCents, oldPrice);
          const isOut = (pack.stock ?? 0) <= 0;
          const list = formatPackItems(pack.packItems);

          return (
            <article key={pack.id} style={card}>
              <div style={imageWrapper}>
                <img
                  src={getImageUrl(pack.imageUrl)}
                  alt={pack.name}
                  style={image}
                />
                <span style={badge}>Pack recommandé</span>
              </div>

              <div style={content}>
                <h3 style={name}>{pack.name}</h3>

                {list.length > 0 && (
                  <ul style={listStyle}>
                    {list.map((item, index) => (
                      <li key={index}>✔ {item}</li>
                    ))}
                  </ul>
                )}

                <div style={priceRow}>
                  <span style={oldPriceStyle}>{formatPrice(oldPrice)}</span>
                  <span style={price}>{formatPrice(pack.priceCents)}</span>
                  <span style={discountStyle}>-{discount}%</span>
                </div>

                <div style={actions}>
                  <Link href={`/products/${pack.slug}`} style={secondaryBtn}>
                    Voir
                  </Link>

                  {isOut ? (
                    <button type="button" disabled style={disabledBtn}>
                      Épuisé
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAdd(pack)}
                      style={primaryBtn}
                    >
                      Ajouter
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

const section: React.CSSProperties = {
  marginTop: 56,
};

const header: React.CSSProperties = {
  textAlign: "center",
  marginBottom: 28,
};

const eyebrow: React.CSSProperties = {
  margin: 0,
  color: "#a16207",
  fontWeight: 800,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  fontSize: 12,
};

const title: React.CSSProperties = {
  margin: "10px 0 0",
  fontSize: 30,
  color: "#1f1f1f",
};

const subtitle: React.CSSProperties = {
  maxWidth: 760,
  margin: "12px auto 0",
  color: "#6b7280",
  lineHeight: 1.6,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
  gap: 24,
};

const card: React.CSSProperties = {
  background: "linear-gradient(180deg, #ffffff 0%, #fbf8f3 100%)",
  borderRadius: 22,
  overflow: "hidden",
  boxShadow: "0 18px 42px rgba(40, 28, 12, 0.08)",
  border: "1px solid rgba(161, 98, 7, 0.16)",
  display: "flex",
  flexDirection: "column",
};

const imageWrapper: React.CSSProperties = {
  position: "relative",
};

const image: React.CSSProperties = {
  width: "100%",
  height: 200,
  objectFit: "cover",
  display: "block",
};

const badge: React.CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  background: "linear-gradient(135deg,#b7791f,#8b5e14)",
  color: "white",
  padding: "7px 12px",
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.04em",
  boxShadow: "0 10px 24px rgba(161,98,7,0.35)",
};

const content: React.CSSProperties = {
  padding: 20,
  display: "flex",
  flexDirection: "column",
  height: "100%",
};

const name: React.CSSProperties = {
  margin: 0,
  fontSize: 22,
  fontWeight: 800,
  color: "#1f1f1f",
};

const listStyle: React.CSSProperties = {
  margin: "14px 0 0",
  paddingLeft: 18,
  color: "#555",
  lineHeight: 1.7,
  fontSize: 14,
  minHeight: 74,
};

const priceRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginTop: 16,
  flexWrap: "wrap",
};

const oldPriceStyle: React.CSSProperties = {
  textDecoration: "line-through",
  color: "#999",
  fontSize: 14,
};

const price: React.CSSProperties = {
  color: "#a16207",
  fontWeight: 900,
  fontSize: 26,
};

const discountStyle: React.CSSProperties = {
  background: "#dc2626",
  color: "white",
  padding: "4px 8px",
  borderRadius: 8,
  fontSize: 12,
  fontWeight: 700,
};

const actions: React.CSSProperties = {
  display: "flex",
  gap: 10,
  marginTop: 18,
};

const secondaryBtn: React.CSSProperties = {
  flex: 1,
  background: "#111",
  color: "white",
  padding: "12px",
  borderRadius: "12px",
  textDecoration: "none",
  textAlign: "center",
  fontWeight: 600,
};

const primaryBtn: React.CSSProperties = {
  flex: 1,
  background: "#a16207",
  color: "white",
  padding: "12px",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: 800,
};

const disabledBtn: React.CSSProperties = {
  flex: 1,
  background: "#e5e7eb",
  color: "#9ca3af",
  padding: "12px",
  border: "none",
  borderRadius: "12px",
  cursor: "not-allowed",
  fontWeight: 700,
};