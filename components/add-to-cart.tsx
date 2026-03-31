"use client";

import { useCart } from "@/lib/cart-store";

type Product = {
  id: string;
  name: string;
  priceCents: number;
  imageUrl?: string;
};

export default function AddToCart({ product }: { product: Product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name,
      priceCents: product.priceCents,
      quantity: 1,
      imageUrl: product.imageUrl || "/images/product-vanille.jpg",
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      style={{
        background: "#a16207",
        color: "white",
        padding: "12px 20px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      Ajouter au panier
    </button>
  );
}