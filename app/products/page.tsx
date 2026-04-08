"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getImageUrl } from "@/lib/image";

/* =========================
   TYPES
========================= */

type Product = {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  imageUrl?: string;
  badge?: string;
  stock?: number;
};

/* =========================
   HELPERS
========================= */

function formatPrice(price: number) {
  return (price / 100).toFixed(2).replace(".", ",") + " €";
}

/* =========================
   PAGE
========================= */

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => console.error("Erreur chargement produits"))
      .finally(() => setLoading(false));
  }, []);

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
            Découvrez notre sélection premium de vanille et d’épices,
            directement issue de Madagascar.
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <div style={container}>
        {loading && <p style={center}>Chargement...</p>}

        {!loading && products.length === 0 && (
          <p style={center}>Aucun produit disponible</p>
        )}

        <div style={grid}>
          {products.map((p) => {
            const isOut = p.stock === 0;

            return (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                style={card}
              >
                {/* BADGES */}
                {p.badge && !isOut && (
                  <span style={badge}>{p.badge}</span>
                )}

                {isOut && <span style={out}>ÉPUISÉ</span>}

                {/* IMAGE */}
                <img
                  src={getImageUrl(p.imageUrl)}
                  alt={p.name}
                  style={img}
                />

                {/* CONTENT */}
                <div style={content}>
                  <h3 style={name}>{p.name}</h3>

                  <p style={price}>
                    {formatPrice(p.priceCents)}
                  </p>

                  <span style={ctaMini}>Voir →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ================= SIGNATURE ================= */}
      <div style={signature}>
        Site développé par <strong>Akm.Consulting</strong>
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */

const page = {
  background: "#f8f5ef",
  minHeight: "100vh",
};

/* HERO */

const hero = {
  position: "relative" as const,
  height: "320px",
  backgroundImage: "url('/images/hero-vanille.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
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

const heroTag = {
  color: "#d4af37",
  fontSize: "22px",
  fontWeight: 800,
  letterSpacing: "0.3em",
};

const heroTitle = {
  fontSize: "32px",
  marginTop: "10px",
};

const heroSubtitle = {
  color: "#ddd",
  marginTop: "10px",
};

/* CONTENT */

const container = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "40px 20px",
};

const center = {
  textAlign: "center" as const,
};

/* GRID */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: "24px",
};

/* CARD */

const card = {
  position: "relative" as const,
  background: "white",
  borderRadius: "18px",
  overflow: "hidden",
  textDecoration: "none",
  color: "#111",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  transition: "0.2s",
};

const img = {
  width: "100%",
  height: "220px",
  objectFit: "cover" as const,
};

const content = {
  padding: "15px",
};

const name = {
  fontWeight: 700,
  marginBottom: "6px",
};

const price = {
  color: "#a16207",
  fontWeight: 700,
};

const ctaMini = {
  display: "block",
  marginTop: "8px",
  fontSize: "13px",
  fontWeight: 600,
};

/* BADGES */

const badge = {
  position: "absolute" as const,
  top: "10px",
  left: "10px",
  background: "#a16207",
  color: "white",
  padding: "5px 10px",
  borderRadius: "999px",
  fontSize: "12px",
};

const out = {
  position: "absolute" as const,
  top: "10px",
  right: "10px",
  background: "#dc2626",
  color: "white",
  padding: "5px 10px",
  borderRadius: "999px",
  fontSize: "12px",
};

/* SIGNATURE */

const signature = {
  textAlign: "center" as const,
  padding: "20px",
  fontSize: "12px",
  color: "#777",
};