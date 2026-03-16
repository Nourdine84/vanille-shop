"use client";

import { useCartStore } from "../lib/cart-store";

type Props = {
  id: string;
  name: string;
  priceCents: number;
  imageUrl?: string;
};

export default function AddToCart({ id, name, priceCents, imageUrl }: Props) {

  const addToCart = useCartStore((state) => state.addToCart);

  function handleAddToCart() {

    addToCart({
      id,
      name,
      priceCents,
      imageUrl,
      quantity: 1
    });

  }

  return (

    <button
      onClick={handleAddToCart}
      className="bg-amber-700 text-white px-6 py-3 rounded-lg hover:bg-amber-800 transition"
    >

      Ajouter au panier

    </button>

  );

}