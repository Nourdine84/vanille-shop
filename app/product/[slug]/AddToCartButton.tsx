"use client";

import { useCart } from "@/lib/cart-store";
import { useToast } from "@/components/ui/toast";
import { useUIStore } from "@/components/ui-provider";

type Product = {
  id: string;
  name: string;
  priceCents: number;
  imageUrl?: string;
};

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { openCart } = useUIStore();

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name,
      priceCents: product.priceCents,
      quantity: 1,
      imageUrl: product.imageUrl || "/images/product-vanille.jpg",
    });

    showToast("Ajouté au panier 🛒");

    setTimeout(() => openCart(), 200);
  };

  return (
    <button
      onClick={handleAddToCart}
      style={{
        background: "#a16207",
        color: "white",
        padding: "14px 20px",
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