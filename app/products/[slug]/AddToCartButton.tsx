"use client";

import React from "react";
import { useCart } from "@/lib/cart-context";
import { useUIStore } from "@/components/ui-providers"; // ✅ FIX

/* =========================
   TYPES
========================= */
type ProductForCart = {
  id: string;
  name: string;
  priceCents: number;
  imageUrl?: string | null;
};

type Props = {
  product: ProductForCart;
};

/* =========================
   COMPONENT
========================= */
export default function AddToCartButton({ product }: Props) {
  const { addToCart } = useCart();
  const { openCart } = useUIStore();

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      priceCents: product.priceCents,
      imageUrl:
        product.imageUrl || "/images/product-vanille.jpg",
      quantity: 1,
    });

    setTimeout(() => {
      if (typeof openCart === "function") {
        openCart();
      }
    }, 50);
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      style={btn}
      data-testid="add-to-cart"
    >
      Ajouter au panier
    </button>
  );
}

/* =========================
   STYLE
========================= */
const btn: React.CSSProperties = {
  marginTop: 20,
  padding: "14px 18px",
  background: "#a16207",
  color: "white",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 700,
};