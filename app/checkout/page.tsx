"use client";

import { useCart } from "../../lib/cart-store";
import { useState } from "react";

export default function CheckoutPage() {
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({ cart }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce(
    (acc, item) => acc + item.priceCents * item.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto py-20 px-6">
      <h1 style={{ fontSize: "40px", fontWeight: 800, marginBottom: "40px" }}>
        Paiement sécurisé
      </h1>

      <div className="grid md:grid-cols-2 gap-10">
        {/* INFOS */}
        <div
          style={{
            border: "1px solid #ece7df",
            borderRadius: "18px",
            padding: "24px",
            background: "white",
          }}
        >
          <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "20px" }}>
            Informations
          </h2>

          <p style={{ color: "#6b7280", marginBottom: "10px" }}>
            ✔ Paiement sécurisé via Stripe
          </p>
          <p style={{ color: "#6b7280", marginBottom: "10px" }}>
            ✔ Données protégées
          </p>
          <p style={{ color: "#6b7280" }}>
            ✔ Transaction cryptée
          </p>
        </div>

        {/* RÉCAP */}
        <div
          style={{
            border: "1px solid #ece7df",
            borderRadius: "18px",
            padding: "24px",
            background: "#fffdf9",
          }}
        >
          <h2 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "20px" }}>
            Récapitulatif
          </h2>

          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>
                {(item.priceCents / 100).toFixed(2)} €
              </span>
            </div>
          ))}

          <hr style={{ margin: "20px 0" }} />

          <p style={{ fontSize: "22px", fontWeight: 800 }}>
            Total : {(total / 100).toFixed(2)} €
          </p>

          <button
            onClick={handleCheckout}
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "20px",
              background: "#a16207",
              color: "white",
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            {loading ? "Redirection..." : "Payer maintenant"}
          </button>
        </div>
      </div>
    </div>
  );
}