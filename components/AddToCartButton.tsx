"use client";

import { useCart } from "../context/CartContext";

type Product = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl?: string | null;
};

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart, items } = useCart();

  console.log("Items dans le panier :", items); // ✅ Ajoute ça

  const handleAdd = () => {
    console.log("Clic sur Ajouter pour :", product.name); // ✅ Ajoute ça
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      priceCents: product.priceCents,
      imageUrl: product.imageUrl ?? null,
    }, 1);
  };

  return (
    <button
      className="btn-primary"
      onClick={handleAdd}
    >
      Ajouter au panier
    </button>
  );
}