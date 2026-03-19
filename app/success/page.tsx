"use client";

import { useEffect } from "react";
import { useCart } from "../../lib/cart-store";
import Link from "next/link";

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-20 px-6 text-center">

      <h1 className="text-4xl font-bold mb-6">
        🎉 Paiement réussi !
      </h1>

      <p className="text-gray-600 mb-10">
        Merci pour votre commande. Vous recevrez un email de confirmation.
      </p>

      <div className="flex justify-center gap-4">
        <Link
          href="/products"
          className="bg-black text-white px-6 py-3 rounded-xl"
        >
          Continuer mes achats
        </Link>

        <Link
          href="/account/orders"
          className="border px-6 py-3 rounded-xl"
        >
          Voir mes commandes
        </Link>
      </div>

    </div>
  );
}