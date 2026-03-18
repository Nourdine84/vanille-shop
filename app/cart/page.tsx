"use client";

import React, { useState } from "react";
import { useCartStore } from "../../lib/cart-store";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0
  );

  const handleCheckout = async () => {
    try {
      setError("");
      setLoading(true);

      if (cart.length === 0) {
        setError("Votre panier est vide.");
        return;
      }

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: cart }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Erreur lors du checkout.");
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      setError("URL Stripe introuvable.");
    } catch (err) {
      console.error("Checkout client error:", err);
      setError("Une erreur est survenue pendant la redirection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "24px" }}>
        Panier
      </h1>

      {cart.length === 0 ? (
        <p>Votre panier est vide</p>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #e5e7eb",
                padding: "16px",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ fontWeight: 600 }}>{item.name}</p>
                <p>Quantité : {item.quantity}</p>
                <p>{(item.priceCents / 100).toFixed(2)} €</p>
              </div>

              <button
                type="button"
                onClick={() => removeFromCart(item.id)}
                className="btn-secondary"
              >
                Supprimer
              </button>
            </div>
          ))}

          <div style={{ fontSize: "24px", fontWeight: 700 }}>
            Total : {(total / 100).toFixed(2)} €
          </div>

          {error ? (
            <p style={{ color: "#dc2626", fontWeight: 600 }}>{error}</p>
          ) : null}

          <div style={{ display: "flex", gap: "12px" }}>
            <button type="button" onClick={clearCart} className="btn-secondary">
              Vider le panier
            </button>

            <button
              type="button"
              onClick={handleCheckout}
              className="btn-primary"
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Redirection..." : "Payer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}