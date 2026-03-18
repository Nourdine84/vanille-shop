"use client";

import React from "react";
import Link from "next/link";
import AddToCart from "../add-to-cart";

type Product = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: "16px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "0.2s",
      }}
    >
      {/* IMAGE */}
      <Link href={`/product/${product.slug}`}>
        <img
          src={product.imageUrl || "/images/placeholder.jpg"}
          alt={product.name}
          style={{
            width: "100%",
            borderRadius: "12px",
            objectFit: "cover",
          }}
        />
      </Link>

      {/* NAME */}
      <Link href={`/product/${product.slug}`}>
        <h3 style={{ fontWeight: 600 }}>{product.name}</h3>
      </Link>

      {/* PRICE */}
      <p style={{ fontWeight: 700, fontSize: "18px" }}>
        {(product.priceCents / 100).toFixed(2)} €
      </p>

      {/* CTA */}
      <AddToCart
        product={{
          id: product.id,
          name: product.name,
          priceCents: product.priceCents,
          imageUrl: product.imageUrl,
        }}
      />
    </div>
  );
}