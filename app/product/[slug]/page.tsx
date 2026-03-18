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
        <h1>Produit introuvable</h1>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div
        style={{
          display: "grid",
          gap: "40px",
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
              borderRadius: "12px",
              display: "block",
            }}
          />
        </div>

        <div>
          <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "16px" }}>
            {product.name}
          </h1>

          <p style={{ color: "#4b5563", marginBottom: "24px" }}>
            {product.description}
          </p>

          <p style={{ fontSize: "28px", fontWeight: 600, marginBottom: "24px" }}>
            {(product.priceCents / 100).toFixed(2)} €
          </p>

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