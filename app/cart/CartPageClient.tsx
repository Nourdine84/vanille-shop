"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function CartPageClient() {
  const { items, removeFromCart, clearCart, totalCents } = useCart();

  return (
    <div className="container mx-auto py-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold">Votre Panier</h1>

        <div className="flex gap-3">
          <Link href="/products" className="btn-primary">
            Continuer achats
          </Link>

          {items.length > 0 && (
            <button className="btn-primary" onClick={clearCart}>
              Vider
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-gray-600">Votre panier est vide.</p>
      ) : (
        <>
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="card p-6 flex justify-between">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-600">
                    {(item.priceCents / 100).toFixed(2)} € × {item.quantity}
                  </p>
                </div>

                <button
                  className="text-red-500 font-medium"
                  onClick={() => removeFromCart(item.id)}
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 text-right">
            <p className="text-xl font-bold">
              Total : {(totalCents / 100).toFixed(2)} €
            </p>
          </div>
        </>
      )}
    </div>
  );
}