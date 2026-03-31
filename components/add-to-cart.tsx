"use client";

import { useCartStore } from "../lib/cart-store";

export default function AddToCart({ product }: any) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <button
      onClick={() =>
        addToCart({
          id: product.id,
          name: product.name,
          priceCents: product.priceCents,
          quantity: 1,
        })
      }
      style={{
        background: "#a16207",
        color: "white",
        padding: "12px 20px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
      }}
    >
      Ajouter au panier
    </button>
  );
}