"use client";

import { useState } from "react";
import { useCart } from "../../lib/cart-store";

export default function CheckoutPage() {
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    console.log("🛒 FRONT CART:", cart);

    if (!cart || cart.length === 0) {
      alert("Ton panier est vide ❌");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
        }),
      });

      const data = await res.json();

      console.log("💳 RESPONSE:", data);

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur Stripe");
      }

    } catch (error) {
      console.error(error);
      alert("Erreur checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-6">
      <h1 className="text-3xl font-bold mb-10">Paiement</h1>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className="bg-amber-700 text-white px-6 py-3 rounded-lg"
      >
        {loading ? "Chargement..." : "Payer maintenant"}
      </button>
    </div>
  );
}
