"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  stock?: number;
};

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

// 🔥 mots clés épices
const SPICES_KEYWORDS = [
  "cannelle",
  "poivre",
  "girofle",
  "épice",
  "epice",
];

export default function EpicesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Erreur API");

        const data = await res.json();

        const filtered = data.filter((p: Product) =>
          SPICES_KEYWORDS.some((keyword) =>
            p.name.toLowerCase().includes(keyword)
          )
        );

        setProducts(filtered);
      } catch (error) {
        console.error("❌ FETCH EPICES ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div style={container}>
      <h1 style={title}>🌶️ Univers Épices</h1>

      {/* LOADING */}
      {loading && <div style={center}>Chargement des épices...</div>}

      {/* EMPTY */}
      {!loading && products.length === 0 && (
        <div style={center}>Aucune épice disponible</div>
      )}

      {/* GRID */}
      <div style={grid}>
        {products.map((product, index) => {
          const isOutOfStock = product.stock === 0;

          return (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <motion.div
                whileHover={{ scale: 1.04 }}
                style={{
                  ...card,
                  opacity: isOutOfStock ? 0.6 : 1,
                }}
              >
                {/* ⭐ BEST SELLER */}
                {index === 0 && !isOutOfStock && (
                  <div style={bestSeller}>⭐ Best seller</div>
                )}

                {/* 🔴 ÉPUISÉ */}
                {isOutOfStock && (
                  <div style={outOfStock}>ÉPUISÉ</div>
                )}

                {/* IMAGE */}
                <div style={{ position: "relative" }}>
                  <img
                    src={product.imageUrl || "/images/product-default.jpg"}
                    alt={product.name}
                    style={img}
                  />

                  {/* HOVER CTA */}
                  <div style={overlay}>Voir produit →</div>
                </div>

                {/* INFOS */}
                <h3 style={name}>{product.name}</h3>

                <p style={desc}>
                  {product.description?.slice(0, 80)}...
                </p>

                <p style={price}>
                  {formatPrice(product.priceCents)}
                </p>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* 🎨 STYLES */

const container = {
  background: "#faf7f2",
  minHeight: "100vh",
  padding: "40px 20px",
  maxWidth: "1100px",
  margin: "0 auto",
};

const title = {
  textAlign: "center" as const,
  marginBottom: "40px",
  fontSize: "32px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "25px",
};

const card = {
  background: "white",
  padding: "15px",
  borderRadius: "16px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
  cursor: "pointer",
  position: "relative" as const,
  overflow: "hidden",
};

const img = {
  width: "100%",
  height: "220px",
  objectFit: "cover" as const,
  borderRadius: "12px",
  marginBottom: "10px",
};

const overlay = {
  position: "absolute" as const,
  bottom: "10px",
  right: "10px",
  background: "#a16207",
  color: "white",
  padding: "6px 10px",
  borderRadius: "8px",
  fontSize: "12px",
  opacity: 0,
  transition: "0.3s",
};

const name = {
  fontSize: "18px",
  fontWeight: 700,
};

const desc = {
  color: "#666",
  fontSize: "14px",
};

const price = {
  marginTop: "10px",
  fontWeight: "700",
  color: "#a16207",
};

const bestSeller = {
  position: "absolute" as const,
  top: "12px",
  left: "12px",
  background: "#a16207",
  color: "white",
  padding: "5px 10px",
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
  padding: "5px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  zIndex: 2,
};

const center = {
  textAlign: "center" as const,
  marginBottom: "20px",
};