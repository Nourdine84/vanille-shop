"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

type CartItem = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  quantity: number;
  imageUrl?: string | null;
};

export default function CartPage() {
  const { items, removeFromCart, clearCart, totalCents } = useCart();
  const [mounted, setMounted] = useState(false);

  // Logs pour debug (à supprimer plus tard)
  useEffect(() => {
    console.log("🛒 CartPage - items:", items);
    console.log("💰 CartPage - totalCents:", totalCents);
  }, [items, totalCents]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="container mx-auto py-16">Chargement...</div>;
  }

  return (
    <div className="container mx-auto py-16">
      <h1 className="text-3xl font-bold mb-10">Votre Panier</h1>

      {items.length === 0 ? (
        <p className="text-gray-600">Votre panier est vide.</p>
      ) : (
        <>
          <div className="space-y-6">
            {items.map((item: CartItem) => (
              <div key={item.id} className="border p-6 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-600">
                    {(item.priceCents / 100).toFixed(2)} € x {item.quantity}
                  </p>
                </div>
                <button
                  className="text-red-500 hover:underline"
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
            <div className="flex gap-4 justify-end mt-4">
              <button
                className="btn-secondary"
                onClick={clearCart}
              >
                Vider le panier
              </button>
              <Link href="/checkout" className="btn-primary">
                Procéder au paiement
              </Link>
            </div>
          </div>
        </>
      )}

      <div className="mt-10">
        <Link href="/products" className="btn-primary">
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}