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
};

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 FETCH PRODUITS (client side = pas d'erreur URL)
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 🔥 TRACK LIST VIEW
  useEffect(() => {
    if (!products.length) return;

    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "view_item_list", {
        item_list_name: "Produits",
        items: products.map((p) => ({
          item_id: p.id,
          item_name: p.name,
          price: p.priceCents / 100,
        })),
      });
    }
  }, [products]);

  if (loading) {
    return <div style={{ padding: 40 }}>Chargement...</div>;
  }

  return (
    <div style={{ background: "#faf7f2", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        {/* TITLE */}
        <h1 style={{ textAlign: "center", marginBottom: "40px" }}>
          Nos produits
        </h1>

        {/* GRID */}
        <div style={grid}>
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <motion.div
                whileHover={{ scale: 1.03 }}
                style={cardStyle}
              >
                <img
                  src={product.imageUrl || "/images/product-vanille.jpg"}
                  alt={product.name}
                  style={imgStyle}
                />

                <h3 style={{ marginBottom: "5px" }}>
                  {product.name}
                </h3>

                <p style={{ color: "#666", fontSize: "14px" }}>
                  {product.description}
                </p>

                <p style={priceStyle}>
                  {formatPrice(product.priceCents)}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* EMPTY */}
        {products.length === 0 && (
          <p style={{ textAlign: "center" }}>
            Aucun produit disponible.
          </p>
        )}
      </div>
    </div>
  );
}

// 🎨 STYLES
const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "25px",
};

const cardStyle = {
  background: "white",
  borderRadius: "16px",
  overflow: "hidden",
  padding: "15px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  cursor: "pointer",
};

const imgStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover" as const,
  borderRadius: "12px",
  marginBottom: "10px",
};

const priceStyle = {
  marginTop: "10px",
  fontWeight: "600",
  color: "#a16207",
};