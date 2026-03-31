"use client";

import { useCartStore } from "../../../lib/cart-store";
import { useToast } from "../../../components/ui/toast";
import { useUIStore } from "../../../lib/ui-store";

export default function AddToCartButton({ product }: any) {
  const addToCart = useCartStore((state) => state.addToCart);
  const { showToast } = useToast();
  const openCart = useUIStore((state) => state.openCart);

  return (
    <button
      onClick={() => {
        addToCart({
          id: product.id,
          name: product.name,
          priceCents: product.priceCents,
          quantity: 1,
        });

        showToast("Ajouté au panier 🛒");

        setTimeout(() => openCart(), 200);
      }}
      style={{
        background: "#a16207",
        color: "white",
        padding: "14px 20px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        fontWeight: "600",
      }}
    >
      Ajouter au panier
    </button>
  );
}