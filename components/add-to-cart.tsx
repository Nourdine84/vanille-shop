"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useUIStore } from "@/components/ui-providers";

type Product = {
  id: string;
  name: string;
  priceCents: number;
  imageUrl?: string;
};

const quantities = [
  { label: "10g", multiplier: 1 },
  { label: "50g", multiplier: 5 },
  { label: "100g", multiplier: 10 },
  { label: "200g", multiplier: 20 },
  { label: "500g", multiplier: 50 },
  { label: "1kg", multiplier: 100 },
];

export default function AddToCart({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { openCart } = useUIStore();

  const [selected, setSelected] = useState(quantities[0]);

  const handleAdd = () => {
    addToCart({
      id: `${product.id}-${selected.label}`, // 🔥 unique ID
      name: `${product.name} (${selected.label})`,
      priceCents: product.priceCents * selected.multiplier,
      imageUrl: product.imageUrl,
      quantity: 1,
    });

    openCart();
  };

  return (
    <div>
      {/* SELECT */}
      <div style={selectRow}>
        {quantities.map((q) => (
          <button
            key={q.label}
            onClick={() => setSelected(q)}
            style={{
              ...selectBtn,
              background:
                selected.label === q.label ? "#a16207" : "#f3f4f6",
              color: selected.label === q.label ? "white" : "#333",
            }}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* CTA */}
      <button onClick={handleAdd} style={btn}>
        Ajouter au panier
      </button>
    </div>
  );
}

/* STYLE */

const selectRow = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap" as const,
  marginBottom: "12px",
};

const selectBtn = {
  padding: "8px 12px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontSize: "13px",
};

const btn = {
  width: "100%",
  background: "#a16207",
  color: "white",
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
};