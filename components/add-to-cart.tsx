"use client";

import { useCart } from "../lib/cart-store";

type Props = {
  product: {
    id: string;
    name: string;
    priceCents: number;
    imageUrl?: string;
  };
};

export default function AddToCart({ product }: Props) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart({
      ...product,
      quantity: 1,
    });
  };

  return (
    <button
      onClick={handleAdd}
      className="bg-amber-700 text-white px-6 py-3 rounded-xl hover:bg-amber-800 transition"
    >
      Ajouter au panier
    </button>
  );
} 