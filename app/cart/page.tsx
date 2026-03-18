"use client";

import React, { useState } from "react";
import { useCartStore } from "../../lib/cart-store";
import { useToast } from "../../components/ui/toast";

export default function CartPage() {
  const { cart, removeFromCart } = useCartStore();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const total = cart.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (cart.length === 0) {
      showToast("Votre panier est vide 🛒", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: cart }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast("Erreur lors du paiement", "error");
        return;
      }

      showToast("Redirection vers le paiement...", "info");

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      showToast("Erreur réseau", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Votre panier</h1>

      {cart.length === 0 ? (
        <div
          style={{
            padding: "40px",
            border: "1px dashed #ccc",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <p style={{ marginBottom: "10px" }}>
            Votre panier est vide 🛒
          </p>
          <p style={{ color: "#6b7280" }}>
            Ajoutez des produits pour commencer
          </p>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gap: "20px" }}>
            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #eee",
                  padding: "16px",
                  borderRadius: "12px",
                }}
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} x {(item.priceCents / 100).toFixed(2)} €
                  </p>
                </div>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <p className="font-bold">
                    {(item.priceCents * item.quantity / 100).toFixed(2)} €
                  </p>

                  <button
                    onClick={() => {
                      removeFromCart(item.id);
                      showToast("Produit supprimé ❌", "info");
                    }}
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* TOTAL */}
          <div style={{ marginTop: "30px", textAlign: "right" }}>
            <p className="text-xl font-bold mb-4">
              Total : {(total / 100).toFixed(2)} €
            </p>

            <button
              onClick={handleCheckout}
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Chargement..." : "Payer maintenant"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
