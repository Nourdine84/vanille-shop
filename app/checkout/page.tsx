"use client";

import { useState } from "react";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  const cartItems = [
    {
      name: "Vanille Bourbon Premium",
      priceCents: 14900,
      quantity: 1,
    },
  ];

  async function handleCheckout() {
    setLoading(true);

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart: cartItems }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Erreur lors du paiement");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto py-20 px-6">
      
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">
          Finaliser votre commande
        </h1>
        <p className="text-gray-500">
          Une expérience premium, du producteur à votre cuisine.
        </p>
      </div>

      {/* PRODUIT */}
      <div className="border rounded-2xl p-6 mb-6 bg-white shadow-sm">
        <h2 className="font-semibold text-lg mb-2">
          Vanille Bourbon Premium
        </h2>
        <p className="text-gray-500 mb-4">
          Gousses sélectionnées à Madagascar
        </p>
        <p className="font-bold text-xl">149,00 €</p>
      </div>

      {/* GARANTIES */}
      <div className="bg-[#faf7f2] p-6 rounded-2xl mb-6">
        <p className="mb-2">✔ Livraison rapide en France</p>
        <p className="mb-2">✔ Produit 100% naturel</p>
        <p className="mb-2">✔ Qualité premium sélectionnée</p>
      </div>

      {/* BOUTON */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-[#a16207] hover:bg-[#854d0e] text-white py-4 rounded-xl text-lg font-semibold transition"
      >
        {loading ? "Redirection..." : "Payer maintenant"}
      </button>

      {/* TRUST */}
      <p className="text-center text-sm text-gray-400 mt-4">
        Paiement sécurisé via Stripe 🔒
      </p>
    </div>
  );
}