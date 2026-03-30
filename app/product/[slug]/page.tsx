"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useUIStore } from "@/components/ui-provider";
import { useParams } from "next/navigation";

type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl?: string;
  stock: number;
};

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);

  const { addToCart } = useCart();
  const { openCart } = useUIStore();

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then(setProduct);
  }, [slug]);

  if (!product) {
    return <div style={{ padding: "100px", textAlign: "center" }}>Chargement...</div>;
  }

  const isOut = product.stock === 0;

  return (
    <div style={{ background: "#f8f5ef", minHeight: "100vh", padding: "60px 20px" }}>
      <div style={container}>
        
        {/* IMAGE */}
        <div style={imageBox}>
          <img
            src={product.imageUrl || "/images/product-vanille.jpg"}
            alt={product.name}
            style={image}
          />
        </div>

        {/* CONTENT */}
        <div style={content}>
          <h1 style={title}>{product.name}</h1>

          <p style={price}>{formatPrice(product.priceCents)}</p>

          <p style={desc}>{product.description}</p>

          {/* STOCK */}
          <p style={{ color: isOut ? "#dc2626" : "#16a34a", fontWeight: 600 }}>
            {isOut ? "Produit indisponible" : "En stock"}
          </p>

          {/* QTY */}
          {!isOut && (
            <div style={qtyRow}>
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(Math.min(99, qty + 1))}>+</button>
            </div>
          )}

          {/* CTA */}
          <button
            disabled={isOut}
            onClick={() => {
              addToCart({
                id: product.id,
                name: product.name,
                priceCents: product.priceCents,
                quantity: qty,
              });

              setTimeout(() => openCart(), 150);
            }}
            style={{
              ...btn,
              background: isOut ? "#aaa" : "#a16207",
            }}
          >
            {isOut ? "Indisponible" : "Ajouter au panier"}
          </button>

          {/* TRUST */}
          <div style={trust}>
            ✔ Origine Madagascar  
            <br />
            ✔ Qualité premium  
            <br />
            ✔ Livraison rapide France & Europe
          </div>
        </div>
      </div>
    </div>
  );
}

/* 🎨 STYLES */

const container = {
  maxWidth: "1100px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "50px",
};

const imageBox = {
  background: "white",
  padding: "20px",
  borderRadius: "20px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
};

const image = {
  width: "100%",
  height: "450px",
  objectFit: "cover" as const,
  borderRadius: "16px",
};

const content = {
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "center",
};

const title = {
  fontSize: "34px",
  fontWeight: 800,
  marginBottom: "10px",
};

const price = {
  fontSize: "22px",
  fontWeight: "bold",
  marginBottom: "20px",
};

const desc = {
  color: "#6b7280",
  marginBottom: "20px",
};

const qtyRow = {
  display: "flex",
  gap: "15px",
  alignItems: "center",
  marginBottom: "20px",
};

const btn = {
  padding: "16px",
  color: "white",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
  marginBottom: "20px",
};

const trust = {
  fontSize: "14px",
  color: "#6b7280",
};