"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import ProductPreviewModal from "./ProductPreviewModal";

export default function ProductGrid({ products }: any) {
  const [selected, setSelected] = useState<any | null>(null);

  return (
    <>
      <div style={grid}>
        {products.map((product: any) => (
          <div
            key={product.id}
            style={card}
            onClick={() => setSelected(product)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow =
                "0 10px 25px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 10px rgba(0,0,0,0.08)";
            }}
          >
            {/* IMAGE */}
            {product.imageUrl ? (
              <img src={product.imageUrl} style={img} />
            ) : (
              <div style={noImage}>No image</div>
            )}

            {/* CONTENT */}
            <div style={content}>
              <h3 style={name}>{product.name}</h3>

              <p style={price}>
                {(product.priceCents / 100).toFixed(2)} €
              </p>
            </div>
          </div>
        ))}
      </div>

      <ProductPreviewModal
        product={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}

/* ================= STYLES ================= */

const grid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))",
  gap: 20,
};

const card: CSSProperties = {
  background: "white",
  borderRadius: 12,
  overflow: "hidden",
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
};

const img: CSSProperties = {
  width: "100%",
  height: 180,
  objectFit: "cover", // ✅ FIX TS
};

const noImage: CSSProperties = {
  height: 180,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#eee",
};

const content: CSSProperties = {
  padding: 10,
};

const name: CSSProperties = {
  margin: "0 0 5px 0",
  fontSize: 16,
};

const price: CSSProperties = {
  fontWeight: "bold",
};