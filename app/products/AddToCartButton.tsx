"use client";

import { useCart } from "../../context/CartContext";

type AddToCartProduct = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl?: string | null;
};

export default function AddToCartButton({
  product,
}: {
  product: AddToCartProduct;
}) {
  const { addToCart } = useCart();

  console.log("AddToCartButton mounted for:", product.name);

  return (
    <button
      className="btn-primary"
      onClick={() => {
        console.log("Clicked:", product.name);

        addToCart(
          {
            id: product.id,
            slug: product.slug,
            name: product.name,
            priceCents: product.priceCents,
            imageUrl: product.imageUrl ?? null,
          },
          1
        );
      }}
    >
      Ajouter
    </button>
  );
}