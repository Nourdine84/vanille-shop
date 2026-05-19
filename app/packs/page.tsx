import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getImageUrl } from "@/lib/image";
import BackButton from "@/components/ui/BackButton";

export const dynamic = "force-dynamic";

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default async function PacksPage() {
  const packs = await prisma.product.findMany({
    where: {
      isPack: true,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div style={page}>

      {/* HERO */}
      <section style={hero}>
        <div style={overlay} />

        <div style={heroContent}>
          <p style={tag}>Vanille’Or</p>

          <BackButton
            label="Retour boutique"
            fallback="/products"
            />

          <h1 style={heroTitle}>
            Coffrets & Packs Premium
          </h1>

          <p style={heroText}>
            Découvrez nos sélections exclusives pensées pour
            les passionnés de gastronomie, cadeaux premium
            et professionnels.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section style={section}>
        <div style={headerRow}>
          <div>
            <h2 style={title}>
              Nos packs signature
            </h2>

            <p style={subtitle}>
              Une expérience sensorielle unique autour de la vanille
              et des épices rares de Madagascar.
            </p>
          </div>
        </div>

        {packs.length === 0 ? (
          <div style={empty}>
            Aucun pack disponible pour le moment.
          </div>
        ) : (
          <div style={grid}>
            {packs.map((pack) => (
              <Link
                key={pack.id}
                href={`/products/${pack.slug}`}
                style={card}
              >
                {/* IMAGE */}
                <div style={imageWrapper}>
                  <img
                    src={getImageUrl(pack.imageUrl)}
                    alt={pack.name}
                    style={image}
                  />

                  <div style={badge}>
                    Pack Premium
                  </div>
                </div>

                {/* CONTENT */}
                <div style={content}>
                  <h3 style={cardTitle}>
                    {pack.name}
                  </h3>

                  {pack.description && (
                    <p style={description}>
                      {pack.description}
                    </p>
                  )}

                  {pack.packItems && (
                    <div style={packBox}>
                      <strong>Contenu :</strong>

                      <p style={packText}>
                        {pack.packItems}
                      </p>
                    </div>
                  )}

                  <div style={bottom}>
                    <span style={price}>
                      {formatPrice(pack.priceCents)}
                    </span>

                    <span style={cta}>
                      Découvrir →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* =========================
   STYLE
========================= */

const page = {
  background: "#f8f5ef",
  minHeight: "100vh",
};

const hero = {
  position: "relative" as const,
  height: "420px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center" as const,
  overflow: "hidden",
  backgroundImage:
    "url('/images/hero-vanille.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const overlay = {
  position: "absolute" as const,
  inset: 0,
  background:
    "linear-gradient(135deg,#000000cc,#2a2117cc)",
};

const heroContent = {
  position: "relative" as const,
  zIndex: 2,
  maxWidth: "700px",
  padding: "20px",
};

const tag = {
  color: "#d4af37",
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  fontWeight: 700,
  marginBottom: "12px",
};

const heroTitle = {
  fontSize: "48px",
  color: "white",
  fontWeight: 800,
  marginBottom: "20px",
  lineHeight: 1.1,
};

const heroText = {
  color: "#e7e2da",
  lineHeight: 1.7,
  fontSize: "17px",
};

const section = {
  maxWidth: "1280px",
  margin: "0 auto",
  padding: "70px 20px",
};

const headerRow = {
  marginBottom: "40px",
};

const title = {
  fontSize: "36px",
  marginBottom: "10px",
  color: "#111",
};

const subtitle = {
  color: "#666",
  lineHeight: 1.7,
  maxWidth: "700px",
};

const empty = {
  padding: "40px",
  background: "white",
  borderRadius: "20px",
  textAlign: "center" as const,
};

const grid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(320px,1fr))",
  gap: "28px",
};

const card = {
  display: "block",
  background: "white",
  borderRadius: "24px",
  overflow: "hidden",
  textDecoration: "none",
  color: "#111",
  boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
  transition: "0.3s",
};

const imageWrapper = {
  position: "relative" as const,
};

const image = {
  width: "100%",
  height: "320px",
  objectFit: "cover" as const,
};

const badge = {
  position: "absolute" as const,
  top: "18px",
  left: "18px",
  background: "#a16207",
  color: "white",
  padding: "8px 14px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 700,
};

const content = {
  padding: "24px",
};

const cardTitle = {
  fontSize: "24px",
  marginBottom: "14px",
};

const description = {
  color: "#666",
  lineHeight: 1.7,
  marginBottom: "20px",
};

const packBox = {
  background: "#faf7f2",
  borderRadius: "16px",
  padding: "16px",
  marginBottom: "20px",
};

const packText = {
  marginTop: "10px",
  color: "#555",
  lineHeight: 1.7,
};

const bottom = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const price = {
    fontSize: "24px",
    fontWeight: 800,
    color: "#a16207",
  };
  
  const cta = {
    fontWeight: 700,
    color: "#111",
  };