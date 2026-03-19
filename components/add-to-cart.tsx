"use client";

import { useCart } from "../lib/cart-store";
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
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAdd = () => {
    addToCart({
      ...product,
      quantity: 1,
    });

    showToast(`${product.name} ajouté au panier 🛒`, "success");
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      style={{
        width: "100%",
        background: "#111111",
        color: "white",
        padding: "14px 18px",
        borderRadius: "14px",
        border: "none",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: "15px",
      }}
    >
      Ajouter au panier
    </button>
  );
}