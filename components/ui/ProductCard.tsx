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
      className="card-hover"
      style={{
        border: "1px solid #eee",
        borderRadius: "18px",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      {/* IMAGE */}
      <Link href={`/product/${product.slug}`}>
        <div style={{ overflow: "hidden" }}>
          <img
            src={product.imageUrl || "/images/placeholder.jpg"}
            alt={product.name}
            style={{
              width: "100%",
              height: "260px",
              objectFit: "cover",
              transition: "0.3s",
            }}
          />
        </div>
      </Link>

      {/* CONTENT */}
      <div style={{ padding: "16px" }}>
        <Link href={`/product/${product.slug}`}>
          <h3
            style={{
              fontWeight: 600,
              fontSize: "16px",
              marginBottom: "6px",
            }}
          >
            {product.name}
          </h3>
        </Link>

        <p
          style={{
            fontWeight: 700,
            fontSize: "18px",
            marginBottom: "12px",
          }}
        >
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
  );
}