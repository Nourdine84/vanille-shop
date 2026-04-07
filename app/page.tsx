"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

export default function HomePage() {
  const [best, setBest] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setBest(data.slice(0, 3)));
  }, []);

  return (
    <div style={page}>
      {/* ================= HERO ================= */}
      <section style={hero}>
        <div style={heroOverlay} />

        <div style={heroContent}>
          <p style={heroTag}>VanilleOr</p>

          <h1 style={heroTitle}>
            La vanille d’exception <br /> venue de Madagascar
          </h1>

          <p style={heroSubtitle}>
            Une expérience sensorielle unique, utilisée par les chefs et
            passionnés de gastronomie.
          </p>

          <div style={heroActions}>
            <Link href="/products" style={btnPrimary}>
              Découvrir
            </Link>

            <Link href="/collections/vanille" style={btnGhost}>
              Explorer
            </Link>
          </div>
        </div>
      </section>

      {/* ================= STORY ================= */}
      <section style={section}>
        <div style={storyBox}>
          <h2 style={sectionTitle}>Une histoire, un savoir-faire</h2>

          <p style={storyText}>
            Originaire de Madagascar, la vanille est aujourd’hui considérée comme
            l’une des épices les plus précieuses au monde, prisée pour son arôme
            intense et sa richesse exceptionnelle.
          </p>

          <p style={storyText}>
            En <strong>1841</strong>, un jeune esclave réunionnais nommé{" "}
            <strong>Raymond Albius</strong> découvre la méthode permettant de
            polliniser manuellement la fleur de vanille. Cette avancée majeure
            révolutionne la production mondiale et rend enfin sa culture
            maîtrisable.
          </p>

          <p style={storyText}>
            Aujourd’hui encore, ce savoir-faire artisanal perdure à Madagascar,
            donnant naissance à une vanille d’une qualité incomparable — celle que
            nous avons choisi de vous proposer avec exigence et passion.
          </p>
        </div>
      </section>

      {/* ================= BEST SELLERS ================= */}
      <section style={sectionAlt}>
        <h2 style={sectionTitle}>Best Sellers</h2>

        <div style={grid}>
          {best.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.slug}`}
              style={card}
            >
              <img
                src={getImageUrl(p.imageUrl)}
                alt={p.name}
                style={img}
              />

              <div style={cardContent}>
                <h3 style={cardTitle}>{p.name}</h3>
                <p style={price}>{formatPrice(p.priceCents)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= COLLECTION ================= */}
      <section style={section}>
        <div style={grid2}>
          <Link href="/collections/vanille" style={collection}>
            <img src="/images/vanille.jpg" style={imgFull} />
            <div style={overlay} />
            <h3 style={collectionTitle}>Vanille</h3>
          </Link>

          <Link href="/collections/epices" style={collection}>
            <img src="/images/epices.jpg" style={imgFull} />
            <div style={overlay} />
            <h3 style={collectionTitle}>Épices</h3>
          </Link>
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section style={trust}>
        <div style={trustGrid}>
          <div>✔ Qualité premium</div>
          <div>✔ Livraison rapide</div>
          <div>✔ Sélection rigoureuse</div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section style={cta}>
        <h2 style={ctaTitle}>Passez à l’expérience VanilleOr</h2>

        <p style={ctaText}>
          Découvrez nos produits et transformez votre cuisine en expérience
          gastronomique.
        </p>

        <Link href="/products" style={btnPrimaryLarge}>
          Voir le catalogue
        </Link>
      </section>

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
};

/* HERO */

const hero = {
  position: "relative" as const,
  height: "90vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center" as const,
  color: "white",
  backgroundImage: "url('/images/hero-vanille.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const heroOverlay = {
  position: "absolute" as const,
  inset: 0,
  background: "linear-gradient(135deg,#000000cc,#2a2117cc)",
};

const heroContent = {
  position: "relative" as const,
  zIndex: 2,
  maxWidth: 800,
};

const heroTag = {
  color: "#d4af37",
  letterSpacing: 2,
  fontWeight: 700,
};

const heroTitle = {
  fontSize: "48px",
  fontWeight: 800,
  margin: "20px 0",
};

const heroSubtitle = {
  color: "#ddd",
  marginBottom: 30,
};

const heroActions = {
  display: "flex",
  gap: 12,
  justifyContent: "center",
};

const btnPrimary = {
  background: "#a16207",
  color: "white",
  padding: "14px 22px",
  borderRadius: 12,
  textDecoration: "none",
  fontWeight: 700,
};

const btnGhost = {
  background: "white",
  color: "#111",
  padding: "14px 22px",
  borderRadius: 12,
  textDecoration: "none",
  fontWeight: 700,
};

/* SECTIONS */

const section = { padding: "60px 20px" };
const sectionAlt = { padding: "60px 20px", background: "white" };

const sectionTitle = {
  textAlign: "center" as const,
  fontSize: 28,
  marginBottom: 30,
};

const storyBox = {
  maxWidth: 750,
  margin: "0 auto",
};

const storyText = {
  color: "#555",
  lineHeight: 1.7,
  marginBottom: 16,
};

/* GRID */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: 20,
};

const grid2 = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 20,
};

/* CARDS */

const card = {
  background: "white",
  borderRadius: 16,
  overflow: "hidden",
  textDecoration: "none",
  color: "#111",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const img = {
  width: "100%",
  height: 220,
  objectFit: "cover" as const,
};

const imgFull = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
};

const cardContent = {
  padding: 15,
};

const cardTitle = {
  fontWeight: 700,
};

const price = {
  color: "#a16207",
  fontWeight: 700,
};

/* COLLECTION */

const collection = {
  position: "relative" as const,
  height: 250,
  borderRadius: 20,
  overflow: "hidden",
};

const overlay = {
  position: "absolute" as const,
  inset: 0,
  background: "rgba(0,0,0,0.4)",
};

const collectionTitle = {
  position: "absolute" as const,
  bottom: 20,
  left: 20,
  color: "white",
  fontSize: 22,
  fontWeight: 700,
};

/* TRUST */

const trust = {
  padding: 40,
  textAlign: "center" as const,
};

const trustGrid = {
  display: "flex",
  justifyContent: "center",
  gap: 40,
};

/* CTA */

const cta = {
  textAlign: "center" as const,
  padding: 60,
};

const ctaTitle = {
  fontSize: 28,
  marginBottom: 10,
};

const ctaText = {
  color: "#666",
  marginBottom: 20,
};

const btnPrimaryLarge = {
  background: "#a16207",
  color: "white",
  padding: "16px 30px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 800,
};

/* SIGNATURE */

const signature = {
  textAlign: "center" as const,
  padding: 20,
  fontSize: 12,
  color: "#777",
};