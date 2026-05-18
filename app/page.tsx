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
  category?: string;
};

/* =========================
   HELPERS
========================= */

function formatPrice(priceCents: number) {
  return (priceCents / 100)
    .toFixed(2)
    .replace(".", ",") + " €";
}

/* =========================
   PAGE
========================= */

export default function HomePage() {
  const [best, setBest] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        setBest(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (err) {
        console.error("❌ HOME FETCH ERROR:", err);
        setBest([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div style={page}>
      {/* ================= HERO ================= */}

      <section style={hero}>
        <div style={heroOverlay} />

        <div style={heroContent}>
          <p style={heroTag}>
            VANILLE PREMIUM • MADAGASCAR
          </p>

          <h1 style={heroTitle}>
            L’excellence des épices <br />
            directement de Madagascar
          </h1>

          <p style={heroSubtitle}>
            Vanille gourmet, cacao, poivre sauvage et
            créations premium sélectionnées avec exigence
            pour particuliers et professionnels.
          </p>

          <div style={heroActions}>
            <Link href="/products" style={btnPrimary}>
              Découvrir la collection
            </Link>

            <Link href="/b2b" style={btnGhost}>
              Espace professionnel
            </Link>
          </div>
        </div>
      </section>

      {/* ================= STORY ================= */}

      <section style={section}>
        <div style={storyContainer}>
          <div style={storyTextBox}>
            <p style={sectionEyebrow}>
              L’HISTOIRE VANILLE’OR
            </p>

            <h2 style={sectionTitleLeft}>
              Un héritage rare et précieux
            </h2>

            <p style={storyText}>
              Vanille’Or est née d’un lien familial fort
              avec Madagascar et d’une volonté simple :
              proposer des produits premium accessibles,
              sélectionnés directement auprès de producteurs
              locaux.
            </p>

            <p style={storyText}>
              Notre vanille est issue d’un savoir-faire
              artisanal unique transmis depuis des générations.
              Chaque gousse est récoltée, affinée et préparée
              avec précision afin d’obtenir une intensité
              aromatique exceptionnelle.
            </p>

            <p style={storyText}>
              Inspirée par l’héritage de Raymond Albius,
              figure emblématique de la pollinisation de la
              vanille, Vanille’Or valorise l’authenticité,
              la qualité et la passion du produit.
            </p>
          </div>

          <div style={storyImageBox}>
            <img
              src="/images/hero-vanille.jpg"
              alt="Vanille Madagascar"
              style={storyImage}
            />
          </div>
        </div>
      </section>

      {/* ================= BEST SELLERS ================= */}

      <section style={sectionAlt}>
        <div style={sectionHeader}>
          <div>
            <p style={sectionEyebrow}>
              NOS PRODUITS
            </p>

            <h2 style={sectionTitleLeft}>
              Best Sellers
            </h2>
          </div>

          <Link href="/products" style={sectionLink}>
            Voir tout →
          </Link>
        </div>

        {loading && (
          <div style={center}>
            Chargement des produits...
          </div>
        )}

        {!loading && best.length === 0 && (
          <div style={center}>
            Aucun produit disponible
          </div>
        )}

        <div style={productGrid}>
          {best.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.slug}`}
              style={card}
            >
              <div style={badge}>
                Premium
              </div>

              <img
                src={getImageUrl(p.imageUrl)}
                alt={p.name}
                style={img}
              />

              <div style={cardContent}>
                <p style={cardCategory}>
                  {p.category || "Vanille’Or"}
                </p>

                <h3 style={cardTitle}>
                  {p.name}
                </h3>

                <p style={price}>
                  {formatPrice(p.priceCents)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= PACKS ================= */}

      <section style={section}>
        <div style={packContainer}>
          <div style={packCardLarge}>
            <div style={packOverlay} />

            <div style={packContent}>
              <p style={sectionEyebrowLight}>
                COLLECTIONS
              </p>

              <h2 style={packTitle}>
                Découvrez nos packs premium
              </h2>

              <p style={packText}>
                Packs découverte, professionnels,
                pâtisserie ou cadeaux premium :
                une sélection pensée pour chaque usage.
              </p>

              <Link
                href="/products"
                style={btnPrimary}
              >
                Explorer les packs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= COLLECTIONS ================= */}

      <section style={sectionAlt}>
        <div style={collectionsGrid}>
          <Link
            href="/collections/vanille"
            style={collection}
          >
            <img
              src="/images/vanille.jpg"
              alt="Vanille"
              style={imgFull}
            />

            <div style={overlay} />

            <div style={collectionContent}>
              <p style={collectionTag}>
                Collection
              </p>

              <h3 style={collectionTitle}>
                Vanille
              </h3>
            </div>
          </Link>

          <Link
            href="/collections/epices"
            style={collection}
          >
            <img
              src="/images/epices.jpg"
              alt="Épices"
              style={imgFull}
            />

            <div style={overlay} />

            <div style={collectionContent}>
              <p style={collectionTag}>
                Collection
              </p>

              <h3 style={collectionTitle}>
                Épices
              </h3>
            </div>
          </Link>
        </div>
      </section>

      {/* ================= B2B ================= */}

      <section style={b2b}>
        <div style={b2bContent}>
          <p style={sectionEyebrow}>
            PROFESSIONNELS
          </p>

          <h2 style={b2bTitle}>
            Approvisionnement gros volume
          </h2>

          <p style={b2bText}>
            Restaurants, pâtisseries, laboratoires,
            revendeurs ou distributeurs :
            nous proposons des solutions adaptées aux
            besoins professionnels.
          </p>

          <div style={trustGrid}>
            <div style={trustItem}>
              ✔ Qualité premium
            </div>

            <div style={trustItem}>
              ✔ Fournisseur direct Madagascar
            </div>

            <div style={trustItem}>
              ✔ Volume disponible
            </div>

            <div style={trustItem}>
              ✔ Expédition Europe
            </div>
          </div>

          <Link href="/b2b" style={btnPrimaryLarge}>
            Faire une demande pro
          </Link>
        </div>
      </section>

      {/* ================= CTA ================= */}

      <section style={cta}>
        <h2 style={ctaTitle}>
          Passez à l’expérience Vanille’Or
        </h2>

        <p style={ctaText}>
          Découvrez une sélection premium conçue
          pour révéler toute la richesse aromatique
          de Madagascar.
        </p>

        <Link
          href="/products"
          style={btnPrimaryLarge}
        >
          Voir le catalogue
        </Link>
      </section>

      {/* ================= SIGNATURE ================= */}

      <div style={signature}>
        Site développé par{" "}
        <strong>Akm.Consulting</strong>
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */

const page = {
  background: "#f8f5ef",
  overflowX: "hidden" as const,
};

/* HERO */

const hero = {
  position: "relative" as const,
  minHeight: "92vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center" as const,
  padding: "40px 20px",
  backgroundImage:
    "url('/images/hero-vanille.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const heroOverlay = {
  position: "absolute" as const,
  inset: 0,
  background:
    "linear-gradient(135deg,#000000d9,#2a2117d1)",
};

const heroContent = {
  position: "relative" as const,
  zIndex: 2,
  maxWidth: "900px",
};

const heroTag = {
  color: "#d4af37",
  fontWeight: 700,
  letterSpacing: "0.2em",
  fontSize: "13px",
  marginBottom: "20px",
};

const heroTitle = {
  color: "white",
  fontSize: "clamp(38px,7vw,72px)",
  fontWeight: 800,
  lineHeight: 1.1,
  marginBottom: "24px",
};

const heroSubtitle = {
  color: "#ddd",
  fontSize: "18px",
  lineHeight: 1.7,
  maxWidth: "760px",
  margin: "0 auto 34px",
};

const heroActions = {
  display: "flex",
  flexWrap: "wrap" as const,
  justifyContent: "center",
  gap: "14px",
};

/* BUTTONS */

const btnPrimary = {
  background: "#a16207",
  color: "white",
  padding: "15px 24px",
  borderRadius: "14px",
  textDecoration: "none",
  fontWeight: 700,
  display: "inline-block",
};

const btnGhost = {
  background: "rgba(255,255,255,0.12)",
  color: "white",
  padding: "15px 24px",
  borderRadius: "14px",
  textDecoration: "none",
  fontWeight: 700,
  border: "1px solid rgba(255,255,255,0.2)",
};

const btnPrimaryLarge = {
  background: "#a16207",
  color: "white",
  padding: "18px 30px",
  borderRadius: "16px",
  textDecoration: "none",
  fontWeight: 800,
  display: "inline-block",
};

/* SECTIONS */

const section = {
  padding: "90px 20px",
};

const sectionAlt = {
  padding: "90px 20px",
  background: "white",
};

const sectionEyebrow = {
  color: "#a16207",
  fontWeight: 700,
  letterSpacing: "0.15em",
  fontSize: "12px",
  marginBottom: "12px",
};

const sectionEyebrowLight = {
  color: "#f3d7a1",
  fontWeight: 700,
  letterSpacing: "0.15em",
  fontSize: "12px",
  marginBottom: "12px",
};

const sectionTitleLeft = {
  fontSize: "clamp(28px,5vw,42px)",
  fontWeight: 800,
  marginBottom: "20px",
  lineHeight: 1.2,
};

const sectionHeader = {
  maxWidth: "1200px",
  margin: "0 auto 40px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  flexWrap: "wrap" as const,
};

const sectionLink = {
  color: "#a16207",
  textDecoration: "none",
  fontWeight: 700,
};

/* STORY */

const storyContainer = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(320px,1fr))",
  gap: "50px",
  alignItems: "center",
};

const storyTextBox = {};

const storyText = {
  color: "#5f5f5f",
  lineHeight: 1.8,
  marginBottom: "18px",
  fontSize: "16px",
};

const storyImageBox = {};

const storyImage = {
  width: "100%",
  borderRadius: "24px",
  objectFit: "cover" as const,
  minHeight: "420px",
};

/* PRODUCTS */

const productGrid = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(260px,1fr))",
  gap: "24px",
};

const card = {
  position: "relative" as const,
  background: "white",
  borderRadius: "22px",
  overflow: "hidden",
  textDecoration: "none",
  color: "#111",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.06)",
};

const badge = {
  position: "absolute" as const,
  top: 14,
  left: 14,
  background: "#a16207",
  color: "white",
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  zIndex: 2,
  fontWeight: 700,
};

const img = {
  width: "100%",
  height: 260,
  objectFit: "cover" as const,
};

const cardContent = {
  padding: "18px",
};

const cardCategory = {
  fontSize: "12px",
  color: "#888",
  marginBottom: "8px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
};

const cardTitle = {
  fontSize: "18px",
  fontWeight: 700,
  lineHeight: 1.4,
  marginBottom: "10px",
};

const price = {
  color: "#a16207",
  fontWeight: 800,
  fontSize: "18px",
};

/* PACK */

const packContainer = {
  maxWidth: "1200px",
  margin: "0 auto",
};

const packCardLarge = {
  position: "relative" as const,
  minHeight: "420px",
  borderRadius: "30px",
  overflow: "hidden",
  backgroundImage:
    "url('/images/hero-vanille.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
};

const packOverlay = {
  position: "absolute" as const,
  inset: 0,
  background:
    "linear-gradient(135deg,#000000d9,#2a2117ba)",
};

const packContent = {
  position: "relative" as const,
  zIndex: 2,
  padding: "50px",
  maxWidth: "600px",
};

const packTitle = {
  color: "white",
  fontSize: "clamp(30px,5vw,48px)",
  fontWeight: 800,
  lineHeight: 1.2,
  marginBottom: "20px",
};

const packText = {
  color: "#ddd",
  lineHeight: 1.8,
  marginBottom: "30px",
};

/* COLLECTIONS */

const collectionsGrid = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(320px,1fr))",
  gap: "24px",
};

const collection = {
  position: "relative" as const,
  height: "360px",
  borderRadius: "28px",
  overflow: "hidden",
};

const imgFull = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
};

const overlay = {
  position: "absolute" as const,
  inset: 0,
  background:
    "linear-gradient(to top,#000000d9,#00000030)",
};

const collectionContent = {
  position: "absolute" as const,
  bottom: "28px",
  left: "28px",
  zIndex: 2,
};

const collectionTag = {
  color: "#d4af37",
  marginBottom: "8px",
  fontWeight: 700,
  letterSpacing: "0.12em",
  fontSize: "12px",
};

const collectionTitle = {
  color: "white",
  fontSize: "32px",
  fontWeight: 800,
};

/* B2B */

const b2b = {
  padding: "100px 20px",
  background:
    "linear-gradient(135deg,#16110c,#2a2117)",
};

const b2bContent = {
  maxWidth: "1000px",
  margin: "0 auto",
  textAlign: "center" as const,
};

const b2bTitle = {
  color: "white",
  fontSize: "clamp(32px,5vw,50px)",
  fontWeight: 800,
  marginBottom: "20px",
};

const b2bText = {
  color: "#ddd",
  lineHeight: 1.8,
  maxWidth: "760px",
  margin: "0 auto 40px",
};

const trustGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "16px",
  marginBottom: "40px",
};

const trustItem = {
  background: "rgba(255,255,255,0.06)",
  color: "white",
  padding: "18px",
  borderRadius: "16px",
  border:
    "1px solid rgba(255,255,255,0.08)",
};

/* CTA */

const cta = {
  padding: "100px 20px",
  textAlign: "center" as const,
};

const ctaTitle = {
  fontSize: "clamp(32px,5vw,50px)",
  fontWeight: 800,
  marginBottom: "20px",
};

const ctaText = {
  color: "#666",
  lineHeight: 1.8,
  maxWidth: "700px",
  margin: "0 auto 30px",
};

/* FOOTER */

const signature = {
  textAlign: "center" as const,
  padding: "30px",
  fontSize: "13px",
  color: "#777",
};

const center = {
  textAlign: "center" as const,
  padding: "40px",
};