"use client";

import React from "react";
import { useCartStore } from "../../lib/cart-store";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCartStore();

  const total = cart.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0
  );

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Panier</h1>

      {cart.length === 0 ? (
        <p>Votre panier est vide</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center border p-4 rounded"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p>
                  {(item.priceCents / 100).toFixed(2)} € x {item.quantity}
                </p>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500"
              >
                Supprimer
              </button>
            </div>
          ))}

          <div className="text-xl font-bold">
            Total : {(total / 100).toFixed(2)} €
          </div>

          <button onClick={clearCart} className="btn-secondary">
            Vider le panier
          </button>
        </div>
      )}
    </div>
  );
}