"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function SuccessPage() {
  useEffect(() => {
    // clean du panier après paiement
    localStorage.removeItem("cart");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-xl w-full bg-white p-10 rounded-2xl shadow-md text-center">
        
        {/* ICON SUCCESS */}
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl">
            ✓
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-4">
          Paiement confirmé 🎉
        </h1>

        {/* MESSAGE */}
        <p className="text-gray-600 mb-6">
          Merci pour votre commande chez <strong>Vanille Or</strong>.
          <br />
          Votre commande est en cours de préparation.
        </p>

        {/* INFO */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6 text-sm text-gray-700">
          📦 Livraison estimée : <strong>3 à 5 jours ouvrés</strong>
          <br />
          📧 Un email de confirmation vous a été envoyé
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3">
          <Link
            href="/products"
            className="bg-amber-700 text-white py-3 rounded-lg font-medium hover:bg-amber-800 transition"
          >
            Continuer mes achats
          </Link>

          <Link
            href="/account/orders"
            className="border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            Voir mes commandes
          </Link>
        </div>
      </div>
    </div>
  );
}