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
            border: "1px dashed #d1d5db",
            borderRadius: "16px",
            padding: "40px",
            textAlign: "center",
            background: "#fafafa",
          }}
        >
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              marginBottom: "10px",
            }}
          >
            Produit introuvable
          </h1>

          <p style={{ color: "#6b7280" }}>
            Le produit demandé n’existe pas ou n’est plus disponible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div
        style={{
          display: "grid",
          gap: "48px",
          gridTemplateColumns: "1fr 1fr",
          alignItems: "start",
        }}
      >
        <div>
          <img
            src={product.imageUrl || "/images/placeholder.jpg"}
            alt={product.name}
            style={{
              width: "100%",
              borderRadius: "20px",
              display: "block",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              background: "#fff",
            }}
          />
        </div>

        <div>
          <p
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              color: "#a16207",
              marginBottom: "12px",
            }}
          >
            Vanille premium
          </p>

          <h1
            style={{
              fontSize: "40px",
              fontWeight: 700,
              lineHeight: 1.1,
              marginBottom: "18px",
            }}
          >
            {product.name}
          </h1>

          <p
            style={{
              color: "#4b5563",
              marginBottom: "28px",
              fontSize: "16px",
              lineHeight: 1.7,
            }}
          >
            {product.description}
          </p>

          <p
            style={{
              fontSize: "32px",
              fontWeight: 700,
              marginBottom: "24px",
            }}
          >
            {(product.priceCents / 100).toFixed(2)} €
          </p>

          <div
            style={{
              padding: "18px",
              border: "1px solid #ece7df",
              borderRadius: "16px",
              background: "#fffdf9",
              marginBottom: "20px",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#6b7280",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              Une vanille sélectionnée pour son parfum intense, son aspect premium
              et sa qualité idéale pour les recettes raffinées.
            </p>
          </div>

          <AddToCart
            product={{
              id: product.id,
              name: product.name,
              priceCents: product.priceCents,
              imageUrl: product.imageUrl,
            }}
          />
        </div>
      </div>
    </div>
  );
}