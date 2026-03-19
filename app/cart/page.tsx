"use client";

import { useCart } from "../../lib/cart-store";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, addToCart } = useCart();

  const total = cart.reduce(
    (acc, item) => acc + item.priceCents * item.quantity,
    0
  );

  const formatPrice = (price: number) =>
    (price / 100).toFixed(2).replace(".", ",") + " €";

  return (
    <div className="max-w-6xl mx-auto py-20 px-6">

      {/* HEADER */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Votre panier</h1>
        <p className="text-gray-500">
          Vérifiez votre sélection avant de passer commande.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-6">
            Votre panier est vide.
          </p>

          <Link
            href="/products"
            className="bg-black text-white px-6 py-3 rounded-xl"
          >
            Voir les produits
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-10">

          {/* LISTE PRODUITS */}
          <div className="md:col-span-2 space-y-6">

            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-6 border border-[#ece7df] rounded-xl p-4 bg-white"
              >
                {/* IMAGE */}
                <img
                  src={item.imageUrl || "/images/placeholder.jpg"}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                {/* INFOS */}
                <div className="flex-1">
                  <h2 className="font-semibold">{item.name}</h2>

                  <p className="text-sm text-gray-500 mb-2">
                    {formatPrice(item.priceCents)}
                  </p>

                  {/* QUANTITÉ */}
                  <div className="flex items-center gap-3">

                    <button
                      onClick={() =>
                        removeFromCart(item.id)
                      }
                      className="px-3 py-1 border rounded"
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        addToCart({ ...item, quantity: 1 })
                      }
                      className="px-3 py-1 border rounded"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* TOTAL ITEM */}
                <div className="text-right">
                  <p className="font-semibold">
                    {formatPrice(item.priceCents * item.quantity)}
                  </p>
                </div>
              </div>
            ))}

          </div>

          {/* RÉCAP */}
          <div className="border border-[#ece7df] rounded-xl p-6 bg-[#fffdf9] h-fit">

            <h2 className="text-lg font-semibold mb-6">
              Résumé
            </h2>

            <div className="flex justify-between mb-4 text-sm">
              <span>Sous-total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <div className="flex justify-between mb-6 text-sm">
              <span>Livraison</span>
              <span>Gratuite</span>
            </div>

            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            {/* CTA */}
            <Link
                href="/checkout"
                className="block text-center bg-amber-700 text-white py-3 rounded-xl font-medium hover:bg-amber-800 transition"
            >
              Passer au paiement
            </Link>

            {/* RASSURANCE */}
            <div className="mt-6 text-xs text-gray-500 space-y-1">
              <p>✔ Paiement sécurisé</p>
              <p>✔ Livraison rapide</p>
              <p>✔ Garantie qualité</p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}