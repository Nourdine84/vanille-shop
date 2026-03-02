"use client";

import { useCart } from "../../context/CartContext";

export default function TestContextPage() {
  const { items, addToCart } = useCart();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Contexte</h1>
      <p>Items: {items.length}</p>
      <button
        onClick={() => addToCart({ id: "test", slug: "test", name: "Test", priceCents: 1000 }, 1)}
        className="btn-primary"
      >
        Ajouter
      </button>
    </div>
  );
}