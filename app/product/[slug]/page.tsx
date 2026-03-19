import React from "react";
import AddToCart from "../../../components/add-to-cart";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
};

async function getProduct(slug: string): Promise<Product | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/products/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);

  if (!product) {
    return (
      <div className="container py-10">
        <div
          style={{
            border: "1px dashed #d6d3d1",
            borderRadius: "18px",
            padding: "40px",
            textAlign: "center",
            background: "#fafaf9",
          }}
        >
          <h1 style={{ fontSize: "30px", fontWeight: 800, marginBottom: "10px" }}>
            Produit introuvable
          </h1>
          <p style={{ color: "#6b7280" }}>
            Le produit demandé n’est plus disponible ou n’existe pas.
          </p>
        </div>
      </div>
    );
  }

  const fakeStock = 4;

  return (
    <div className="max-w-7xl mx-auto py-20 px-6">
      <div className="grid md:grid-cols-2 gap-16 items-start">
        <div>
          <div style={{ position: "relative" }}>
            <img
              src={product.imageUrl || "/images/placeholder.jpg"}
              alt={product.name}
              style={{
                width: "100%",
                borderRadius: "24px",
                display: "block",
                boxShadow: "0 20px 50px rgba(0,0,0,0.10)",
                background: "#fff",
              }}
            />

            <div
              style={{
                position: "absolute",
                top: "18px",
                left: "18px",
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  background: "#a16207",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "7px 12px",
                  borderRadius: "999px",
                }}
              >
                Premium
              </span>

              <span
                style={{
                  background: "#111111",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "7px 12px",
                  borderRadius: "999px",
                }}
              >
                Best Seller
              </span>
            </div>
          </div>
        </div>

        <div>
          <p
            style={{
              fontSize: "12px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#a16207",
              marginBottom: "12px",
              fontWeight: 700,
            }}
          >
            Vanille Or
          </p>

          <h1
            style={{
              fontSize: "44px",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "14px",
            }}
          >
            {product.name}
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "18px",
            }}
          >
            <span style={{ color: "#d97706" }}>★★★★★</span>
            <span style={{ color: "#6b7280", fontSize: "14px" }}>
              (42 avis clients)
            </span>
          </div>

          <p
            style={{
              color: "#4b5563",
              marginBottom: "24px",
              lineHeight: 1.8,
              fontSize: "16px",
            }}
          >
            {product.description}
          </p>

          <p style={{ fontSize: "34px", fontWeight: 800, marginBottom: "16px" }}>
            {(product.priceCents / 100).toFixed(2)} €
          </p>

          <div
            style={{
              marginBottom: "24px",
              background: "#fff1f2",
              color: "#b91c1c",
              border: "1px solid #fecdd3",
              padding: "14px 16px",
              borderRadius: "14px",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            ⚠️ Plus que {fakeStock} en stock
          </div>

          <div style={{ marginBottom: "24px" }}>
            <AddToCart
              product={{
                id: product.id,
                name: product.name,
                priceCents: product.priceCents,
                imageUrl: product.imageUrl,
              }}
            />
          </div>

          <div style={{ marginBottom: "28px", display: "grid", gap: "10px" }}>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              ✔ Livraison rapide en France & Europe
            </p>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              ✔ Produit sélectionné avec exigence
            </p>
            <p style={{ color: "#6b7280", fontSize: "14px" }}>
              ✔ Qualité premium garantie
            </p>
          </div>

          <div
            style={{
              background: "#fffdf9",
              border: "1px solid #ece7df",
              borderRadius: "18px",
              padding: "22px",
            }}
          >
            <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "10px" }}>
              Pourquoi choisir Vanille Or ?
            </h3>

            <p style={{ color: "#6b7280", lineHeight: 1.8, fontSize: "14px" }}>
              Notre vanille est sélectionnée pour son intensité aromatique, sa
              finesse et son élégance. Chaque gousse est choisie pour offrir une
              expérience haut de gamme aussi bien aux passionnés qu’aux
              professionnels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}