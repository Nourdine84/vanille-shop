"use client";

import React from "react";
import { useCart } from "@/lib/cart-store";
import { useUIStore } from "@/components/ui-providers";

type ProductForCart = {
  id: string;
  name: string;
  priceCents: number;
  imageUrl?: string;
};

type Props = {
  product: ProductForCart;
};

export default function AddToCartButton({ product }: Props) {
  const { addToCart } = useCart();
  const { openCart } = useUIStore();

  const handleAddToCart = () => {
    addToCart({
      ...product,
      quantity: 1,
    });

    openCart();
  };

  return (
    <button type="button" onClick={handleAddToCart} style={btn}>
      Ajouter au panier
    </button>
  );
}

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