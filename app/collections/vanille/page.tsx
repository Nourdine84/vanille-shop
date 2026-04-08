"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getImageUrl } from "@/lib/image";

/* ========================= */

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

function formatPrice(price: number) {
  return (price / 100).toFixed(2).replace(".", ",") + " €";
}

/* ========================= */

export default function VanillePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((p: Product) =>
          (p.category || "").toLowerCase() === "vanille" ||
          p.name.toLowerCase().includes("vanille")
        );
        setProducts(filtered);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={page}>
      {/* HERO */}
      <section style={hero}>
        <div style={overlay} />
        <div style={heroContent}>
          <p style={heroTag}>VanilleOr</p>
          <h1 style={heroTitle}>L’univers Vanille</h1>
          <p style={heroSubtitle}>
            L’essence précieuse de Madagascar, sélectionnée pour une qualité et
            un arôme incomparables.
          </p>
        </div>
      </section>

      <div style={container}>
        {loading && <p style={center}>Chargement...</p>}

        <div style={grid}>
          {products.map((p) => {
            const isOut = p.stock === 0;

            return (
              <Link key={p.id} href={`/products/${p.slug}`} style={card}>
                {p.badge && <span style={badge}>{p.badge}</span>}
                {isOut && <span style={out}>ÉPUISÉ</span>}

                <img src={getImageUrl(p.imageUrl)} style={img} />

                <div style={content}>
                  <h3>{p.name}</h3>
                  <p style={desc}>
                    {p.description?.slice(0, 90) || "Vanille premium"}...
                  </p>

                  <div style={bottomRow}>
                    <span style={price}>
                      {formatPrice(p.priceCents)}
                    </span>
                    <span style={cta}>Voir →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ================= STYLE ================= */

const page = { background: "#f8f5ef" };

const hero = {
  position: "relative" as const,
  height: "300px",
  backgroundImage: "url('/images/hero-vanille.jpg')",
  backgroundSize: "cover",
};

const overlay = {
  position: "absolute" as const,
  inset: 0,
  background: "linear-gradient(135deg,#000000cc,#2a2117cc)",
};

const heroContent = {
  position: "relative" as const,
  zIndex: 2,
  textAlign: "center" as const,
  color: "white",
  paddingTop: "80px",
};

const heroTag = { color: "#d4af37", letterSpacing: "0.3em" };
const heroTitle = { fontSize: "30px" };
const heroSubtitle = { color: "#ddd" };

const container = { padding: "40px", maxWidth: "1100px", margin: "0 auto" };

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: "24px",
};

const card = {
  background: "white",
  borderRadius: "18px",
  overflow: "hidden",
  textDecoration: "none",
  color: "#111",
  position: "relative" as const,
};

const img = {
  width: "100%",
  height: 220,
  objectFit: "cover" as const,
};

const content = { padding: 15 };

const desc = { color: "#666", fontSize: 14 };

const bottomRow = {
  display: "flex",
  justifyContent: "space-between",
};

const price = { color: "#a16207", fontWeight: 700 };

const cta = { fontWeight: 600 };

const badge = {
  position: "absolute" as const,
  top: 10,
  left: 10,
  background: "#a16207",
  color: "white",
  padding: "5px 10px",
  borderRadius: 999,
};

const out = {
  position: "absolute" as const,
  top: 10,
  right: 10,
  background: "#dc2626",
  color: "white",
  padding: "5px 10px",
  borderRadius: 999,
};

const center = { textAlign: "center" as const };