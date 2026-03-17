"use client";

import { useCartStore } from "../../lib/cart-store";

export default function CartPage() {
  const { cart, removeFromCart } = useCartStore();

  const total = cart.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-bold mb-8">Votre panier</h1>

      {cart.length === 0 && <p>Votre panier est vide.</p>}

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex justify-between border-b py-4"
        >
          <div>
            <h2 className="font-semibold">{item.name}</h2>
            <p>Quantité : {item.quantity}</p>
          </div>

          <div>
            {(item.priceCents / 100).toFixed(2)} €
          </div>

          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-500"
          >
            Supprimer
          </button>
        </div>
      ))}

      {cart.length > 0 && (
        <div className="mt-10 text-right">
          <p className="text-2xl font-bold">
            Total : {(total / 100).toFixed(2)} €
          </p>
        </div>
      )}
    </div>
  );
}