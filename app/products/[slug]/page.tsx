"use client";

import { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getImageUrl } from "@/lib/image";
import { useCart } from "@/lib/cart-context";

/* ================= UTILS ================= */

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

/* ================= PAGE ================= */

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findFirst({
    where: {
      isActive: true,
      slug: params.slug,
    },
  });

  if (!product) return notFound();

  const image = getImageUrl(product.imageUrl);

  return (
    <ClientProduct product={product} image={image} />
  );
}

/* ================= CLIENT ================= */

function ClientProduct({
  product,
  image,
}: {
  product: any;
  image: string;
}) {
  const { addToCart } = useCart();

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

  const dynamicPrice = product.priceCents * selected.multiplier;

  const isOut = product.stock <= 0;

  return (
    <div style={page}>
      <div style={breadcrumb}>
        <Link href="/">Accueil</Link> /{" "}
        <Link href="/products">Produits</Link> /{" "}
        <strong>{product.name}</strong>
      </div>

      <div style={card}>
        <div style={layout}>
          <img src={image} style={img} />

          <div>
            <h1>{product.name}</h1>

            <p style={price}>{formatPrice(dynamicPrice)}</p>

            <p>
              {isOut
                ? "❌ Rupture"
                : `✅ Stock : ${product.stock}`}
            </p>

            {/* 🔥 SELECT QUANTITÉ */}
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

            {!isOut && (
              <button
                style={btn}
                onClick={() =>
                  addToCart({
                    id: `${product.id}-${selected.label}`,
                    name: `${product.name} (${selected.label})`,
                    priceCents: dynamicPrice,
                    imageUrl: image,
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

/* ================= STYLE ================= */

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