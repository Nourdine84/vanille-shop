import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    notFound();
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div style={page}>
      <div style={breadcrumb}>
        <Link href="/" style={breadcrumbLink}>
          Accueil
        </Link>
        <span>/</span>
        <Link href="/products" style={breadcrumbLink}>
          Produits
        </Link>
        <span>/</span>
        <span style={breadcrumbCurrent}>{product.name}</span>
      </div>

      <div style={layout}>
        <div style={imagePanel}>
          {product.badge ? <div style={badge}>{product.badge}</div> : null}

          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              style={image}
            />
          ) : (
            <div style={imageFallback}>Image bientôt disponible</div>
          )}
        </div>

        <div style={contentPanel}>
          <p style={category}>{product.category}</p>
          <h1 style={title}>{product.name}</h1>

          {product.subCategory ? (
            <p style={subCategory}>{product.subCategory}</p>
          ) : null}

          <p style={price}>{formatPrice(product.priceCents)}</p>

          <div style={statusRow}>
            <span
              style={{
                ...statusDot,
                background: product.isActive ? "#16a34a" : "#6b7280",
              }}
            />
            <span style={statusText}>
              {product.isActive ? "Produit actif" : "Produit indisponible"}
            </span>
          </div>

          <p
            style={{
              ...stock,
              color: isOutOfStock ? "#dc2626" : "#16a34a",
            }}
          >
            {isOutOfStock ? "Rupture de stock" : `En stock : ${product.stock}`}
          </p>

          <div style={descriptionBox}>
            <h2 style={sectionTitle}>Description</h2>
            <p style={description}>{product.description}</p>
          </div>

          <div style={ctaRow}>
            <button
              type="button"
              disabled={isOutOfStock}
              style={{
                ...primaryBtn,
                opacity: isOutOfStock ? 0.6 : 1,
                cursor: isOutOfStock ? "not-allowed" : "pointer",
              }}
            >
              {isOutOfStock ? "Indisponible" : "Ajouter au panier"}
            </button>

            <Link href="/products" style={secondaryBtn}>
              Voir le catalogue
            </Link>
          </div>

          <div style={reassuranceBox}>
            <div style={reassuranceItem}>✔ VanilleOr sélection premium</div>
            <div style={reassuranceItem}>✔ Expédition soignée</div>
            <div style={reassuranceItem}>✔ Qualité pensée pour particuliers et pros</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const page = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "40px 20px 60px",
};

const breadcrumb = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap" as const,
  marginBottom: "24px",
  color: "#777",
  fontSize: "14px",
};

const breadcrumbLink = {
  color: "#a16207",
  textDecoration: "none",
};

const breadcrumbCurrent = {
  color: "#222",
  fontWeight: 600,
};

const layout = {
  display: "grid",
  gridTemplateColumns: "1.1fr 1fr",
  gap: "36px",
};

const imagePanel = {
  position: "relative" as const,
  background: "white",
  borderRadius: "18px",
  padding: "20px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  minHeight: "520px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const badge = {
  position: "absolute" as const,
  top: "18px",
  left: "18px",
  background: "#f59e0b",
  color: "white",
  padding: "8px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 700,
};

const image = {
  width: "100%",
  maxHeight: "480px",
  objectFit: "contain" as const,
  borderRadius: "12px",
};

const imageFallback = {
  width: "100%",
  height: "480px",
  borderRadius: "12px",
  background: "#f3f3f3",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#777",
};

const contentPanel = {
  display: "flex",
  flexDirection: "column" as const,
};

const category = {
  color: "#a16207",
  fontWeight: 700,
  marginBottom: "8px",
  textTransform: "capitalize" as const,
};

const title = {
  fontSize: "40px",
  lineHeight: 1.15,
  margin: "0 0 10px",
};

const subCategory = {
  color: "#666",
  marginBottom: "18px",
};

const price = {
  fontSize: "30px",
  fontWeight: 800,
  margin: "0 0 18px",
};

const statusRow = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "10px",
};

const statusDot = {
  width: "10px",
  height: "10px",
  borderRadius: "50%",
};

const statusText = {
  color: "#444",
};

const stock = {
  fontWeight: 700,
  marginBottom: "24px",
};

const descriptionBox = {
  background: "white",
  borderRadius: "14px",
  padding: "20px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
  marginBottom: "24px",
};

const sectionTitle = {
  margin: "0 0 10px",
  fontSize: "18px",
};

const description = {
  color: "#444",
  lineHeight: 1.7,
  margin: 0,
};

const ctaRow = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap" as const,
  marginBottom: "24px",
};

const primaryBtn = {
  background: "#a16207",
  color: "white",
  padding: "14px 20px",
  borderRadius: "12px",
  border: "none",
  fontWeight: 700,
  fontSize: "15px",
};

const secondaryBtn = {
  display: "inline-block",
  background: "white",
  color: "#222",
  padding: "14px 20px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: 700,
  border: "1px solid #ddd",
};

const reassuranceBox = {
  background: "#faf7f2",
  borderRadius: "14px",
  padding: "18px",
  display: "grid",
  gap: "10px",
};

const reassuranceItem = {
  color: "#444",
};