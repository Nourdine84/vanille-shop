"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getImageUrl } from "@/lib/image";
import AddToCart from "@/components/add-to-cart";

type Product = {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  imageUrl?: string;
  badge?: string;
  stock?: number;
};

function formatPrice(price: number) {
  return (price / 100).toFixed(2).replace(".", ",") + " €";
}

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
      <section style={hero}>
        <div style={overlay} />
        <div style={heroContent}>
          <p style={heroTag}>VanilleOr</p>
          <h1 style={heroTitle}>Nos produits d’exception</h1>
          <p style={heroSubtitle}>
            Découvrez notre sélection premium de vanille et d’épices,
            directement issue de Madagascar.
          </p>
        </div>
      </section>

      <div style={container}>
        {loading && <p style={center}>Chargement...</p>}

        {!loading && products.length === 0 && (
          <p style={center}>Aucun produit disponible</p>
        )}

        <div style={grid}>
          {products.map((p) => {
            const isOut = p.stock === 0;

            return (
              <div key={p.id} style={card}>
                <Link
                  href={`/products/${p.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {p.badge && !isOut && (
                    <span style={badge}>{p.badge}</span>
                  )}

                  {isOut && <span style={out}>ÉPUISÉ</span>}

                  <img
                    src={getImageUrl(p.imageUrl)}
                    alt={p.name}
                    style={img}
                  />

                  <div style={content}>
                    <h3 style={name}>{p.name}</h3>

                    <p style={price}>
                      {formatPrice(p.priceCents)}
                    </p>
                  </div>
                </Link>

                {/* CTA ZONE */}
                <div style={ctaContainer}>
                  <Link href={`/products/${p.slug}`} style={ctaVoir}>
                    Voir
                  </Link>

                  {isOut ? (
                    <button disabled style={ctaDisabled}>
                      Épuisé
                    </button>
                  ) : (
                    <AddToCart product={p} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={signature}>
        Site développé par <strong>Akm.Consulting</strong>
      </div>
    </div>
  );
}

/* ========================= STYLES ========================= */

const page = {
  background: "#f8f5ef",
  minHeight: "100vh",
};

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

const container = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "40px 20px",
};

const center = {
  textAlign: "center" as const,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: "24px",
};

const card = {
  background: "white",
  borderRadius: "18px",
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
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

/* CTA */

const ctaContainer = {
  display: "flex",
  gap: "10px",
  padding: "0 15px 15px",
};

const baseBtn = {
  flex: 1,
  padding: "12px",
  borderRadius: "10px",
  fontWeight: 600,
  textAlign: "center" as const,
  fontSize: "14px",
};

const ctaVoir = {
  ...baseBtn,
  background: "#111",
  color: "white",
  textDecoration: "none",
};

const ctaDisabled = {
  ...baseBtn,
  background: "#e5e7eb",
  color: "#9ca3af",
  border: "none",
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

const signature = {
  textAlign: "center" as const,
  padding: "20px",
  fontSize: "12px",
  color: "#777",
};