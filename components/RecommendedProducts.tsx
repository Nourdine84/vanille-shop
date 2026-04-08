"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getImageUrl } from "@/lib/image";

type Product = {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  imageUrl?: string;
  category?: string;
};

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function RecommendedProducts({
  currentProductId,
  category,
}: {
  currentProductId: string;
  category?: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        let filtered = data.filter(
          (p: Product) => p.id !== currentProductId
        );

        if (category) {
          filtered = filtered.filter(
            (p: Product) => p.category === category
          );
        }

        setProducts(filtered.slice(0, 4));
      } catch (err) {
        console.error("❌ RECO ERROR:", err);
      }
    }

    load();
  }, [currentProductId, category]);

  if (!products.length) return null;

  return (
    <div style={container}>
      <h3 style={title}>✨ Vous aimerez aussi</h3>

      <div style={grid}>
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.slug}`}
            style={card}
          >
            <img
              src={getImageUrl(p.imageUrl)}
              alt={p.name}
              style={image}
            />

            <p style={name}>{p.name}</p>
            <p style={price}>{formatPrice(p.priceCents)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */

const container = {
  marginTop: 60,
};

const title = {
  fontSize: 22,
  marginBottom: 20,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
  gap: 20,
};

const card = {
  textDecoration: "none",
  color: "#111",
  background: "white",
  borderRadius: 14,
  padding: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const image = {
  width: "100%",
  height: 140,
  objectFit: "cover" as const,
  borderRadius: 10,
  marginBottom: 10,
};

const name = {
  fontWeight: 600,
};

const price = {
  color: "#a16207",
  fontWeight: 700,
};