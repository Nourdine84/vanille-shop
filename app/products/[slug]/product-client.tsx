"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { getImageUrl } from "@/lib/image";

/* ================= UTILS ================= */

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

/* ================= COMPONENT ================= */

export default function ClientProduct({ product }: { product: any }) {
  const { addToCart } = useCart();

  if (!product) return null;

  const image = getImageUrl(product.imageUrl);

  const unit = product.unit || "g";

  const quantities =
    unit === "g"
      ? [
          { label: "10g", multiplier: 1 },
          { label: "50g", multiplier: 5 },
          { label: "100g", multiplier: 10 },
          { label: "200g", multiplier: 20 },
          { label: "500g", multiplier: 50 },
          { label: "1kg", multiplier: 100 },
        ]
      : [
          { label: "10cl", multiplier: 1 },
          { label: "25cl", multiplier: 2.5 },
          { label: "50cl", multiplier: 5 },
          { label: "1L", multiplier: 10 },
        ];

  const [selected, setSelected] = useState(quantities[2]);

  const dynamicPrice = Math.round(
    (product.priceCents || 0) * selected.multiplier
  );

  const isOut = (product.stock ?? 0) <= 0;

  return (
    <div style={page}>
      {/* BREADCRUMB */}
      <div style={breadcrumb}>
        <Link href="/">Accueil</Link> /{" "}
        <Link href="/products">Produits</Link> /{" "}
        <strong>{product.name}</strong>
      </div>

      <div style={card}>
        <div style={layout}>
          {/* IMAGE */}
          <img src={image} style={img} alt={product.name} />

          {/* INFOS */}
          <div>
            <h1>{product.name}</h1>

            <p style={price}>{formatPrice(dynamicPrice)}</p>

            <p>
              {isOut
                ? "❌ Rupture de stock"
                : `✅ Stock : ${product.stock}`}
            </p>

            {/* BOUTONS GRAMMAGE */}
            <div style={qtyRow}>
              {quantities.map((q) => (
                <button
                  key={q.label}
                  onClick={() => setSelected(q)}
                  style={{
                    ...qtyBtn,
                    background:
                      selected.label === q.label ? "#a16207" : "#eee",
                    color:
                      selected.label === q.label ? "white" : "#333",
                  }}
                >
                  {q.label}
                </button>
              ))}
            </div>

            <p style={desc}>{product.description}</p>

            {/* BOUTON AJOUTER */}
            {!isOut && (
              <button
                style={btn}
                onClick={() =>
                  addToCart({
                    id: `${product.id}-${selected.label}`,
                    name: `${product.name} (${selected.label})`,
                    priceCents: dynamicPrice,
                    imageUrl: getImageUrl(product.imageUrl),
                    quantity: 1,
                  })
                }
              >
                Ajouter au panier
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLE (IDENTIQUE AVANT) ================= */

const page = { padding: 40 };

const breadcrumb = { marginBottom: 20 };

const card = {
  background: "white",
  padding: 20,
  borderRadius: 20,
};

const layout = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 40,
};

const img = {
  width: "100%",
  borderRadius: 20,
};

const price = {
  fontSize: 28,
  fontWeight: 800,
};

const qtyRow = {
  display: "flex",
  gap: 10,
  margin: "20px 0",
  flexWrap: "wrap" as const,
};

const qtyBtn = {
  padding: "8px 12px",
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
};

const desc = {
  margin: "20px 0",
};

const btn = {
  background: "#a16207",
  color: "white",
  padding: 14,
  borderRadius: 12,
  border: "none",
  width: "100%",
};