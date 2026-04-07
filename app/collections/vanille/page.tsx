"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getImageUrl } from "@/lib/image";

/* =========================
   TYPES
========================= */

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl?: string;
  stock?: number;
  badge?: string | null;
  category?: string;
};

/* =========================
   HELPERS
========================= */

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

/* =========================
   PAGE
========================= */

export default function VanillePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Erreur API");

        const data = await res.json();

        // 🔥 FILTRE VANILLE INTELLIGENT
        const filtered = data.filter((p: Product) =>
          (p.category || "").toLowerCase() === "vanille" ||
           p.name.toLowerCase().includes("vanille")
        );

        setProducts(filtered);
      } catch (error) {
        console.error("❌ FETCH VANILLE ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div style={container}>
      {/* HERO */}
      <div style={hero}>
        <p style={heroEyebrow}>Vanille’Or</p>
        <h1 style={title}>🌿 Univers Vanille</h1>
        <p style={heroText}>
          Découvrez notre sélection de vanille de Madagascar, reconnue pour sa richesse aromatique exceptionnelle et sa qualité premium.
        </p>
      </div>

      {/* LOADING */}
      {loading && <div style={center}>Chargement de la vanille...</div>}

      {/* EMPTY */}
      {!loading && products.length === 0 && (
        <div style={center}>Aucun produit vanille disponible</div>
      )}

      {/* GRID */}
      <div style={grid}>
        {products.map((product, index) => {
          const isOutOfStock = product.stock === 0;

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <motion.div
                whileHover={{ y: -5 }}
                style={{
                  ...card,
                  opacity: isOutOfStock ? 0.7 : 1,
                }}
              >
                {/* BADGE ADMIN */}
                {product.badge && (
                  <div style={badge}>
                    {product.badge}
                  </div>
                )}

                {/* BEST SELLER AUTO */}
                {index === 0 && !product.badge && !isOutOfStock && (
                  <div style={bestSeller}>⭐ Best seller</div>
                )}

                {/* STOCK */}
                {isOutOfStock && (
                  <div style={outOfStock}>ÉPUISÉ</div>
                )}

                {/* IMAGE */}
                <img
                  src={getImageUrl(product.imageUrl)}
                  alt={product.name}
                  style={img}
                />

                {/* CONTENT */}
                <div style={content}>
                  <h3 style={name}>{product.name}</h3>

                  <p style={desc}>
                    {product.description?.slice(0, 90)}...
                  </p>

                  {/* VALUE PROPOSITION */}
                  <div style={valueBox}>
                    🌿 Qualité Madagascar  
                    <br />
                    ⭐ Arôme intense  
                    <br />
                    🚀 Livraison rapide
                  </div>

                  <div style={bottomRow}>
                    <span style={price}>
                      {formatPrice(product.priceCents)}
                    </span>
                    <span style={ctaMini}>Voir →</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ================= STYLE ================= */

const container = {
  background: "#faf7f2",
  minHeight: "100vh",
  padding: "40px 20px 60px",
  maxWidth: "1140px",
  margin: "0 auto",
};

const hero = {
  textAlign: "center" as const,
  marginBottom: "42px",
};

const heroEyebrow = {
  color: "#a16207",
  fontWeight: 700,
  marginBottom: "8px",
};

const title = {
  margin: "0 0 12px 0",
  fontSize: "34px",
};

const heroText = {
  color: "#666",
  maxWidth: "720px",
  margin: "0 auto",
  lineHeight: 1.7,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "24px",
};

const card = {
  background: "white",
  borderRadius: "18px",
  overflow: "hidden",
  boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
  position: "relative" as const,
};

const img = {
  width: "100%",
  height: "260px",
  objectFit: "cover" as const,
};

const content = {
  padding: "18px",
};

const name = {
  fontSize: "18px",
  fontWeight: 700,
  marginBottom: "8px",
};

const desc = {
  color: "#666",
  fontSize: "14px",
};

const valueBox = {
  background: "#fff7ed",
  padding: "10px",
  borderRadius: "10px",
  fontSize: "13px",
  marginTop: "10px",
};

const bottomRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "16px",
};

const price = {
  fontWeight: 700,
  color: "#a16207",
};

const ctaMini = {
  color: "#111",
  fontWeight: 600,
};

/* BADGES */

const badge = {
  position: "absolute" as const,
  top: "12px",
  left: "12px",
  background: "#f59e0b",
  color: "white",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  zIndex: 2,
};

const bestSeller = {
  position: "absolute" as const,
  top: "12px",
  left: "12px",
  background: "#a16207",
  color: "white",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  zIndex: 2,
};

const outOfStock = {
  position: "absolute" as const,
  top: "12px",
  right: "12px",
  background: "#dc2626",
  color: "white",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  zIndex: 2,
};

const center = {
  textAlign: "center" as const,
  marginBottom: "20px",
};