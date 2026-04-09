"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-store";

type Product = {
  id: string;
  name: string;
  priceCents: number;
  imageUrl?: string;
};

export default function AddToCart({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();        // 🔥 évite navigation du Link parent
    e.stopPropagation();       // 🔥 évite double trigger

    if (loading) return;       // 🔥 anti double click

    setLoading(true);

    addToCart({
      id: product.id,
      name: product.name,
      priceCents: product.priceCents,
      quantity: 1,
      imageUrl: product.imageUrl || "/images/product-vanille.jpg",
    });

    // petit délai pour éviter spam + QA stable
    setTimeout(() => setLoading(false), 300);
  };

  return (
    <button
      data-testid="add-to-cart"                     // 🔥 important pour tests
      aria-label="Ajouter"
      onClick={handleAddToCart}
      disabled={loading}
      style={{
        background: "#a16207",
        color: "white",
        padding: "12px 20px",
        borderRadius: "10px",
        border: "none",
        cursor: loading ? "not-allowed" : "pointer",
        fontWeight: 600,
        opacity: loading ? 0.7 : 1,
        transition: "0.2s",
      }}
    >
      {loading ? "Ajout..." : "Ajouter"}
    </button>
  );
}