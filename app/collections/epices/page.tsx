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

const SPICES_KEYWORDS = [
  "cannelle",
  "poivre",
  "girofle",
  "épice",
  "epice",
  "cacao",
];

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

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
      <div style={hero}>
        <p style={heroEyebrow}>Vanille’Or</p>
        <h1 style={title}>🌶️ Univers Épices</h1>
        <p style={heroText}>
          Explorez notre sélection d’épices et produits aromatiques pour enrichir
          vos créations culinaires avec intensité et caractère.
        </p>
      </div>

      {loading && <div style={center}>Chargement des épices...</div>}

      {!loading && products.length === 0 && (
        <div style={center}>Aucune épice disponible</div>
      )}

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
                whileHover={{ y: -4 }}
                style={{
                  ...card,
                  opacity: isOutOfStock ? 0.7 : 1,
                }}
              >
                {index === 0 && !isOutOfStock && (
                  <div style={bestSeller}>⭐ Best seller</div>
                )}

                {isOutOfStock && <div style={outOfStock}>ÉPUISÉ</div>}

                <img
                  src={product.imageUrl || "/images/product-default.jpg"}
                  alt={product.name}
                  style={img}
                />

                <h3 style={name}>{product.name}</h3>

                <p style={desc}>
                  {product.description?.slice(0, 90)}...
                </p>

                <div style={bottomRow}>
                  <span style={price}>{formatPrice(product.priceCents)}</span>
                  <span style={ctaMini}>Voir →</span>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* STYLES */

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
  padding: "16px",
  borderRadius: "18px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
  position: "relative" as const,
};

const img = {
  width: "100%",
  height: "230px",
  objectFit: "cover" as const,
  borderRadius: "14px",
  marginBottom: "12px",
};

const name = {
  fontSize: "18px",
  fontWeight: 700,
  marginBottom: "8px",
};

const desc = {
  color: "#666",
  fontSize: "14px",
  minHeight: "44px",
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