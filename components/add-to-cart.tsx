"use client";

import { useCart } from "../lib/cart-store";
import { useToast } from "./ui/toast";

export default function AddToCart({ product }: any) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      priceCents: product.priceCents,
      imageUrl: product.imageUrl,
      quantity: 1,
    });

    // 🔥 FEEDBACK VISUEL
    showToast("Produit ajouté au panier 🛒", "success");

    console.log("✅ Ajout panier:", product);
  };

  return (
    <button
      onClick={handleAdd}
      className="bg-amber-700 text-white px-5 py-3 rounded-lg hover:bg-amber-800"
    >
      Ajouter au panier
    </button>
  );
}