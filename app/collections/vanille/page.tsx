import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getImageUrl } from "@/lib/image";
import type { CSSProperties } from "react";

export const dynamic = "force-dynamic";

/* ================= UTILS ================= */

function formatPrice(price: number) {
  return (price / 100).toFixed(2).replace(".", ",") + " €";
}

/* ================= BADGE LOGIC ================= */

function getProductBadge(p: any) {
  if ((p.stock ?? 0) <= 0) {
    return { label: "Épuisé", color: "#dc2626" };
  }

  if (p.badge) {
    return { label: p.badge, color: "#a16207" };
  }

  return null;
}

function getPackBadge(name: string) {
  const n = name.toLowerCase();
  if (n.includes("pro")) return "Best Seller";
  if (n.includes("premium")) return "Promo";
  if (n.includes("decouverte")) return "Découverte";
  return "Pack";
}

/* ================= PAGE ================= */

export default async function VanillePage() {
  const allProducts = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  const products = allProducts.filter(
    (p) =>
      !p.isPack &&
      (p.category === "vanille" ||
        p.name.toLowerCase().includes("vanille"))
  );

  const packs = allProducts.filter((p) => p.isPack);

  return (
    <div style={page}>
      {/* HERO */}
      <section style={hero}>
        <div style={overlay} />
        <div style={heroContent}>
          <p style={heroTag}>VanilleOr</p>

          <h1 style={heroTitle}>
            Vanille d’Exception de Madagascar
          </h1>

          <p style={heroSubtitle}>
            Une sélection premium aux arômes intenses
          </p>
        </div>
      </section>

      <div style={container}>
        {/* PACKS */}
        {packs.length > 0 && (
          <>
            <h2 style={sectionTitle}>Nos Packs Premium</h2>

            <div style={packGrid}>
              {packs.map((p) => (
                <Link key={p.id} href={`/products/${p.slug}`} style={card}>
                  <div style={imgWrap}>
                    <img src={getImageUrl(p.imageUrl)} style={img} />
                    <span style={badge}>
                      {getPackBadge(p.name)}
                    </span>
                  </div>

                  <div style={content}>
                    <h3>{p.name}</h3>
                    <p style={price}>{formatPrice(p.priceCents)}</p>

                    <div style={actions}>
                      <span style={link}>Voir</span>
                      <span style={buyBtn}>Acheter</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* PRODUITS */}
        <h2 style={sectionTitle}>Nos Produits</h2>

        <div style={grid}>
          {products.map((p) => {
            const badgeData = getProductBadge(p);
            const isOut = (p.stock ?? 0) <= 0;

            return (
              <Link key={p.id} href={`/products/${p.slug}`} style={card}>
                <div style={imgWrap}>
                  <img src={getImageUrl(p.imageUrl)} style={img} />

                  {/* BADGE */}
                  {badgeData && (
                    <span
                      style={{
                        ...badge,
                        background: badgeData.color,
                      }}
                    >
                      {badgeData.label}
                    </span>
                  )}

                  {/* OVERLAY RUPTURE */}
                  {isOut && (
                    <div style={overlayOut}>
                      Rupture de stock
                    </div>
                  )}
                </div>

                <div style={content}>
                  <h3>{p.name}</h3>
                  <p style={price}>{formatPrice(p.priceCents)}</p>

                  <div style={actions}>
                    <span style={link}>Voir</span>

                    <span
                      style={{
                        ...buyBtn,
                        background: isOut ? "#ccc" : "#a16207",
                        pointerEvents: isOut ? "none" : "auto",
                      }}
                    >
                      {isOut ? "Épuisé" : "Acheter"}
                    </span>
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

const overlayOut: CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 800,
  fontSize: 16,
};

const page: CSSProperties = {
  background: "#f8f5ef",
};

const hero: CSSProperties = {
  height: 280,
  background: "url('/images/hero-vanille.jpg') center/cover",
  position: "relative",
};

const overlay: CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(135deg,#000000cc,#2a2117cc)",
};

const heroContent: CSSProperties = {
  position: "relative",
  textAlign: "center",
  color: "white",
  paddingTop: 80,
};

const heroTag: CSSProperties = {
  color: "#d4af37",
  fontWeight: 700,
};

const heroTitle: CSSProperties = {
  fontSize: 34,
};

const heroSubtitle: CSSProperties = {
  color: "#ddd",
};

const container: CSSProperties = {
  maxWidth: 1100,
  margin: "auto",
  padding: 40,
};

const sectionTitle: CSSProperties = {
  fontSize: 22,
};

const grid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: 20,
};

const packGrid: CSSProperties = {
  ...grid,
  marginBottom: 40,
};

const card: CSSProperties = {
  background: "white",
  borderRadius: 16,
  overflow: "hidden",
  textDecoration: "none",
  color: "#111",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
};

const imgWrap: CSSProperties = {
  position: "relative",
};

const img: CSSProperties = {
  width: "100%",
  height: 200,
  objectFit: "cover",
};

const badge: CSSProperties = {
  position: "absolute",
  top: 10,
  left: 10,
  color: "white",
  padding: "5px 12px",
  borderRadius: 999,
  fontSize: 12,
};

const content: CSSProperties = {
  padding: 15,
};

const price: CSSProperties = {
  color: "#a16207",
  fontWeight: 700,
};

const actions: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 10,
};

const link: CSSProperties = {
  fontWeight: 600,
};

const buyBtn: CSSProperties = {
  background: "#a16207",
  color: "white",
  padding: "6px 14px",
  borderRadius: 8,
  fontWeight: 600,
};