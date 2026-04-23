import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getImageUrl } from "@/lib/image";
import type { CSSProperties } from "react";
export const dynamic = "force-dynamic";

function formatPrice(price: number) {
  return (price / 100).toFixed(2).replace(".", ",") + " €";
}

function getPackBadge(name: string) {
  const n = name.toLowerCase();
  if (n.includes("pro")) return "Best Seller";
  if (n.includes("premium")) return "Promo";
  if (n.includes("decouverte")) return "Découverte";
  return "Pack";
}

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
      {/* HERO PREMIUM */}
      <section style={hero}>
        <div style={overlay} />
        <div style={heroContent}>
          <p style={heroTag}>VanilleOr</p>

          <h1 style={heroTitle}>
            Vanille d’Exception de Madagascar
          </h1>

          <p style={heroSubtitle}>
            Une sélection premium aux arômes intenses,
            destinée aux passionnés et aux professionnels exigeants.
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
                    <span style={badge}>{getPackBadge(p.name)}</span>
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

        {/* PRODUCTS */}
        <h2 style={sectionTitle}>Nos Produits</h2>

        <div style={grid}>
          {products.map((p) => (
            <Link key={p.id} href={`/products/${p.slug}`} style={card}>
              <img src={getImageUrl(p.imageUrl)} style={img} />

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
      </div>
    </div>
  );
}

/* ================= STYLE ================= */

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
  letterSpacing: "0.3em",
  textTransform: "uppercase",
};

const heroTitle: CSSProperties = {
  fontSize: 34,
  marginTop: 10,
};

const heroSubtitle: CSSProperties = {
  color: "#ddd",
  maxWidth: 700,
  margin: "10px auto",
  lineHeight: 1.6,
};

const container: CSSProperties = {
  maxWidth: 1100,
  margin: "auto",
  padding: 40,
};

const sectionTitle: CSSProperties = {
  fontSize: 22,
  marginBottom: 15,
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
  transition: "transform 0.2s",
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
  background: "#a16207",
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
  alignItems: "center",
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