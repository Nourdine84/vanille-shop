"use client";

import { useCartStore } from "../lib/cart-store";
import { useToast } from "./ui/toast";

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
  const { showToast } = useToast();

  const handleClick = () => {
    try {
      addToCart({
        ...product,
        quantity: 1,
      });

      showToast("Produit ajouté au panier 🛒", "success");
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de l'ajout", "error");
    }
  };

  return (
    <button onClick={handleClick} className="btn-primary w-full">
      Ajouter au panier
    </button>
  );
}
