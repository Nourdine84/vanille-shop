"use client";

import { useCart } from "../../context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, totalCents } = useCart();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url; // Redirection vers Stripe
      } else {
        console.error("Pas d'URL de redirection");
        setLoading(false);
      }
    } catch (error) {
      console.error("Erreur checkout:", error);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-16">
      <h1 className="text-3xl font-bold mb-10">Finaliser la commande</h1>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Récapitulatif */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between py-2 border-b">
                <span>{item.name} x {item.quantity}</span>
                <span>{((item.priceCents * item.quantity) / 100).toFixed(2)} €</span>
              </div>
            ))}
            
            <div className="flex justify-between py-4 font-bold text-lg">
              <span>Total</span>
              <span>{(totalCents / 100).toFixed(2)} €</span>
            </div>
          </div>
        </div>

        {/* Paiement Stripe */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Paiement sécurisé</h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-600 mb-6">
              Paiement 100% sécurisé par Stripe
            </p>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="btn-primary w-full py-3 text-lg disabled:opacity-50"
            >
              {loading ? "Redirection vers Stripe..." : "Payer maintenant"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}