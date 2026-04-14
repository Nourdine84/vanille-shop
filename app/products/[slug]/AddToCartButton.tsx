"use client";

import React from "react";
import { useCart } from "@/lib/cart-context"; // ✅ FIX
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
      id: product.id,
      name: product.name,
      price: product.priceCents, // ✅ ON GARDE EN CENTIMES
      image: product.imageUrl,
      quantity: 1,
    });

    // ouverture mini-cart fluide
    setTimeout(() => openCart(), 50);
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      style={btn}
      data-testid="add-to-cart"
    >
      Ajouter
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