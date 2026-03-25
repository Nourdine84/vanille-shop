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

export default function EpicesPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((p: Product) =>
          ["cannelle", "cacao", "poivre", "girofle"].some((e) =>
            p.name.toLowerCase().includes(e)
          )
        );
        setProducts(filtered);
      });
  }, []);

  return (
    <div style={container}>
      <h1 style={title}>🌶️ Univers Épices</h1>

      <div style={grid}>
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.slug}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <motion.div whileHover={{ scale: 1.03 }} style={card}>
              <img
                src={product.imageUrl || "/images/product-vanille.jpg"}
                alt={product.name}
                style={img}
              />
              <h3>{product.name}</h3>
              <p style={desc}>{product.description}</p>
              <p style={price}>{formatPrice(product.priceCents)}</p>
            </motion.div>
          </Link>
        ))}
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
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "25px",
};

const card = {
  background: "white",
  padding: "15px",
  borderRadius: "16px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  cursor: "pointer",
};

const img = {
  width: "100%",
  height: "200px",
  objectFit: "cover" as const,
  borderRadius: "12px",
  marginBottom: "10px",
};

const desc = {
  color: "#666",
  fontSize: "14px",
};

const price = {
  marginTop: "10px",
  fontWeight: "600",
  color: "#a16207",
};