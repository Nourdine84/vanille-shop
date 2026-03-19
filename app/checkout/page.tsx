"use client";

import { useCart } from "../../lib/cart-store";

export default function CheckoutPage() {
  const { cart } = useCart();

  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: cart }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur lors du paiement");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur checkout");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-6 text-center">

      <h1 className="text-4xl font-bold mb-6">
        Finaliser votre commande
      </h1>

      <p className="text-gray-500 mb-10">
        Vous allez être redirigé vers une page de paiement sécurisée.
      </p>

      <button
        onClick={handleCheckout}
        className="bg-amber-700 text-white px-8 py-4 rounded-xl font-medium hover:bg-amber-800 transition"
      >
        Payer maintenant
      </button>

    </div>
  );
}