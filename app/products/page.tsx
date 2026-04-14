"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // 🔥 IMPORTANT
import { getImageUrl } from "@/lib/image";
import { useCart } from "@/lib/cart-context";
import { useUIStore } from "@/components/ui-providers";

/* ================= TYPES ================= */

type Product = {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  imageUrl?: string;
  badge?: string | null;
  stock?: number;
  isPack?: boolean;
  packItems?: string | null;
  category?: string;
};

/* ================= UTILS ================= */

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

function formatPackItems(items?: string | null) {
  if (!items) return [];
  return items.split("+").map((i) => i.trim());
}

function getOldPrice(price: number) {
  return Math.round(price * 1.3);
}

function getDiscount(current: number, old: number) {
  return Math.round(((old - current) / old) * 100);
}

/* ================= PAGE ================= */

export default function ProductsPage() {
  const pathname = usePathname(); // 🔥 récupération URL

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { openCart } = useUIStore();

  /* ================= LOAD ================= */

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json();

        if (!isMounted) return;
        setItems(Array.isArray(data) ? data : []);
      } catch {
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

  /* ================= CATEGORY DETECTION ================= */

  const currentCategory = useMemo(() => {
    if (pathname.includes("vanille")) return "vanille";
    if (pathname.includes("epices")) return "epices";
    return null;
  }, [pathname]);

  /* ================= FILTER ================= */

  const products = useMemo(() => {
    return items.filter(
      (item) =>
        !item.isPack &&
        (!currentCategory || item.category === currentCategory)
    );
  }, [items, currentCategory]);

  // 🔥 PACKS TOUJOURS VISIBLES (STRATÉGIE CONVERSION)
  const packs = useMemo(() => {
    return items.filter((item) => item.isPack);
  }, [items]);

  /* ================= ACTION ================= */

  function handleAdd(product: Product) {
    addToCart({
      id: product.id,
      name: product.name,
      priceCents: product.priceCents,
      imageUrl: getImageUrl(product.imageUrl),
      quantity: 1,
    });

    openCart();
  }

  /* ================= RENDER ================= */

  return (
    <div style={page}>
      <div style={container}>
        {loading && <p style={center}>Chargement...</p>}

        {/* PRODUITS */}
        {!loading && products.length > 0 && (
          <div style={grid}>
            {products.map((product) => {
              const isOut = (product.stock ?? 0) <= 0;

              return (
                <div key={product.id} style={card}>
                  <Link href={`/products/${product.slug}`} style={mediaLink}>
                    <img src={getImageUrl(product.imageUrl)} style={img} />
                    <div style={content}>
                      <h3>{product.name}</h3>
                      <p style={priceStyle}>
                        {formatPrice(product.priceCents)}
                      </p>
                    </div>
                  </Link>

                  <div style={ctaContainer}>
                    <Link href={`/products/${product.slug}`} style={ctaVoir}>
                      Voir
                    </Link>

                    {isOut ? (
                      <button disabled style={ctaDisabled}>
                        Épuisé
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAdd(product)}
                        style={ctaAdd}
                      >
                        Ajouter
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 🔥 PACKS TOUJOURS EN BAS */}
        {!loading && packs.length > 0 && (
          <div style={packSection}>
            <h2 style={packTitle}>🔥 Offres recommandées</h2>

            <div style={packGrid}>
              {packs.map((pack) => {
                const oldPrice = getOldPrice(pack.priceCents);
                const discount = getDiscount(
                  pack.priceCents,
                  oldPrice
                );

                return (
                  <div key={pack.id} style={packCard}>
                    <img src={getImageUrl(pack.imageUrl)} style={packImg} />

                    <h3>{pack.name}</h3>

                    <ul style={packList}>
                      {formatPackItems(pack.packItems).map((item, i) => (
                        <li key={i}>✔ {item}</li>
                      ))}
                    </ul>

                    <div style={priceBox}>
                      <span style={oldPriceStyle}>
                        {formatPrice(oldPrice)}
                      </span>

                      <span style={packPrice}>
                        {formatPrice(pack.priceCents)}
                      </span>

                      <span style={discountBadge}>
                        -{discount}%
                      </span>
                    </div>

                    <button
                      style={packBtn}
                      onClick={() => handleAdd(pack)}
                    >
                      Ajouter
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page = { background: "#f8f5ef" };
const container = { padding: 40 };
const center = { textAlign: "center" as const };

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: 20,
};

const card = { background: "white", borderRadius: 12 };
const mediaLink = { textDecoration: "none", color: "inherit" };

const img = {
  width: "100%",
  height: 200,
  objectFit: "cover" as const,
};

const content = { padding: 15 };

const priceStyle = {
  color: "#a16207",
  fontWeight: 800,
};

const ctaContainer = {
  display: "flex",
  gap: 10,
  padding: 10,
};

const ctaVoir = {
  flex: 1,
  background: "#111",
  color: "white",
  padding: 10,
  textAlign: "center" as const,
};

const ctaAdd = {
  flex: 1,
  background: "#a16207",
  color: "white",
  border: "none",
};

const ctaDisabled = {
  flex: 1,
  background: "#eee",
};

/* PACKS */

const packSection = { marginTop: 60 };

const packTitle = {
  textAlign: "center" as const,
  fontSize: 24,
};

const packGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
  gap: 20,
};

const packCard = {
  background: "white",
  padding: 20,
  borderRadius: 16,
  textAlign: "center" as const,
};

const packImg = {
  width: "100%",
  height: 160,
  objectFit: "cover" as const,
};

const packList = {
  textAlign: "left" as const,
  marginTop: 10,
};

const priceBox = {
  display: "flex",
  justifyContent: "center",
  gap: 10,
};

const oldPriceStyle = {
  textDecoration: "line-through",
  color: "#999",
};

const packPrice = {
  color: "#a16207",
  fontWeight: 800,
};

const discountBadge = {
  background: "#dc2626",
  color: "white",
  padding: "2px 6px",
  borderRadius: 6,
};

const packBtn = {
  marginTop: 10,
  background: "#a16207",
  color: "white",
  padding: 10,
  border: "none",
};