"use client";

import React from "react";
import { useCart } from "@/lib/cart-context";
import { useUIStore } from "@/components/ui-providers";

type Product = {
  id: string;
  name: string;
  priceCents: number;
  imageUrl?: string;
};

type Props = {
  product: Product;
};

export default function AddToCart({ product }: Props) {
  const { addToCart } = useCart();
  const { openCart } = useUIStore();

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      priceCents: product.priceCents,
      imageUrl: product.imageUrl,
      quantity: 1,
    });

    openCart();
  };

  return (
    <button
      type="button"
      data-testid="add-to-cart"
      onClick={handleAdd}
      style={btn}
    >
      Ajouter au panier
    </button>
  );
}

const btn: React.CSSProperties = {
  marginTop: 20,
  width: "100%",
  background: "#a16207",
  color: "white",
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
};