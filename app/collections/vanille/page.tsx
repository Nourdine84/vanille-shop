import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getImageUrl } from "@/lib/image";

/* ================= UTILS ================= */

function formatPrice(price: number) {
  return (price / 100).toFixed(2).replace(".", ",") + " €";
}

function getPackBadge(name: string) {
  const normalized = name.toLowerCase();

  if (normalized.includes("pro")) return "Best Seller";
  if (normalized.includes("premium")) return "Promo";
  if (normalized.includes("decouverte")) return "Découverte";

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
      <section style={hero}>
        <div style={overlay} />
        <div style={heroContent}>
          <p style={heroTag}>VanilleOr</p>
          <h1 style={heroTitle}>L’univers Vanille</h1>
          <p style={heroSubtitle}>
            L’essence précieuse de Madagascar, sélectionnée pour une qualité
            exceptionnelle.
          </p>
        </div>
      </section>

      <div style={container}>
        <div style={grid}>
          {products.map((p) => (
            <Link key={p.id} href={`/products/${p.slug}`} style={card}>
              <img
                src={getImageUrl(p.imageUrl)}
                style={img}
                alt={p.name}
              />

              <div style={content}>
                <h3 style={productName}>{p.name}</h3>
                <p style={price}>{formatPrice(p.priceCents)}</p>
                <span style={cta}>Voir →</span>
              </div>
            </Link>
          ))}
        </div>

        {packs.length > 0 && (
          <section style={packSection}>
            <div style={packSectionHeader}>
              <h2 style={packTitle}>Nos Packs Premium</h2>
              <p style={packSubtitle}>
                Des compositions pensées pour offrir une expérience complète,
                élégante et prête à découvrir.
              </p>
            </div>

            <div style={packGrid}>
              {packs.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  style={packCard}
                >
                  <div style={packImageWrapper}>
                    <img
                      src={getImageUrl(p.imageUrl)}
                      style={packImg}
                      alt={p.name}
                    />
                    <span style={packBadge}>{getPackBadge(p.name)}</span>
                  </div>

                  <div style={packContent}>
                    <h3 style={packName}>{p.name}</h3>

                    <p style={packDesc}>
                      Sélection premium VanilleOr pensée pour offrir ou découvrir
                      l’univers de la marque.
                    </p>

                    <div style={packBottom}>
                      <span style={packPrice}>
                        {formatPrice(p.priceCents)}
                      </span>

                      <span style={packCta}>Voir →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ================= STYLE ================= */

const page: React.CSSProperties = {
  background: "#f8f5ef",
};

const hero: React.CSSProperties = {
  position: "relative",
  height: "300px",
  background: "url('/images/hero-vanille.jpg') center/cover",
};

const overlay: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(135deg,#000000cc,#2a2117cc)",
};

const heroContent: React.CSSProperties = {
  position: "relative",
  textAlign: "center",
  color: "white",
  paddingTop: 80,
};

const heroTag: React.CSSProperties = {
  color: "#d4af37",
  fontWeight: 700,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
};

const heroTitle: React.CSSProperties = {
  fontSize: 32,
  marginTop: 10,
  marginBottom: 10,
};

const heroSubtitle: React.CSSProperties = {
  color: "#ddd",
  maxWidth: 760,
  margin: "0 auto",
  lineHeight: 1.6,
};

const container: React.CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "40px 20px 70px",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: 24,
};

const card: React.CSSProperties = {
  background: "white",
  borderRadius: 18,
  overflow: "hidden",
  textDecoration: "none",
  color: "#111",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
};

const img: React.CSSProperties = {
  width: "100%",
  height: 220,
  objectFit: "cover",
};

const content: React.CSSProperties = {
  padding: 15,
};

const productName: React.CSSProperties = {
  margin: 0,
  marginBottom: 8,
};

const price: React.CSSProperties = {
  color: "#a16207",
  fontWeight: 700,
  marginBottom: 8,
};

const cta: React.CSSProperties = {
  fontWeight: 600,
};

/* ===== PACKS PREMIUM ===== */

const packSection: React.CSSProperties = {
  marginTop: 70,
};

const packSectionHeader: React.CSSProperties = {
  marginBottom: 24,
};

const packTitle: React.CSSProperties = {
  fontSize: 24,
  marginBottom: 8,
};

const packSubtitle: React.CSSProperties = {
  color: "#666",
  maxWidth: 720,
  lineHeight: 1.6,
};

const packGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
  gap: 24,
};

const packCard: React.CSSProperties = {
  background: "white",
  borderRadius: 22,
  overflow: "hidden",
  textDecoration: "none",
  color: "#111",
  boxShadow: "0 14px 34px rgba(0,0,0,0.06)",
  border: "1px solid rgba(161,98,7,0.08)",
};

const packImageWrapper: React.CSSProperties = {
  position: "relative",
};

const packImg: React.CSSProperties = {
  width: "100%",
  height: 210,
  objectFit: "cover",
  display: "block",
};

const packBadge: React.CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  background: "#a16207",
  color: "white",
  padding: "6px 12px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  boxShadow: "0 8px 18px rgba(161,98,7,0.28)",
};

const packContent: React.CSSProperties = {
  padding: 18,
};

const packName: React.CSSProperties = {
  margin: 0,
  marginBottom: 8,
  fontSize: 22,
};

const packDesc: React.CSSProperties = {
  margin: 0,
  color: "#666",
  fontSize: 14,
  lineHeight: 1.6,
};

const packBottom: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 16,
};

const packPrice: React.CSSProperties = {
  color: "#a16207",
  fontWeight: 800,
  fontSize: 22,
};

const packCta: React.CSSProperties = {
  fontWeight: 700,
};