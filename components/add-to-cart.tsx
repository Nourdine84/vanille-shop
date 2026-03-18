"use client";

import React from "react";
import { useCartStore } from "../lib/cart-store";

type Props = {
  product: {
    id: string;
    name: string;
    priceCents: number;
    imageUrl?: string;
  };
};

export default function AddToCart({ product }: Props) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleClick = () => {
    alert("CLICK OK");
    console.log("🔥 CLICK ADD", product);

    addToCart({
      ...product,
      quantity: 1,
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="btn-primary"
      style={{
        width: "100%",
        position: "relative",
        zIndex: 9999,
      }}
    >
      Ajouter au panier
    </button>
  );
}
