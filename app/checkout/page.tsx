"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-store";

type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
  imageUrl?: string;
};

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function CheckoutPage() {
  const { cart } = useCart();
  const [loading, setLoading] = useState(false);

  const total = cart.reduce(
    (acc: number, item: CartItem) =>
      acc + item.priceCents * item.quantity,
    0
  );

  const freeShippingThreshold = 5000;
  const remaining = freeShippingThreshold - total;

  const handleCheckout = async () => {
    if (!cart.length) {
      alert("Votre panier est vide");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }),
      });

      if (!res.ok) {
        throw new Error("Erreur API");
      }

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Pas de redirection Stripe");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors du paiement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#faf7f2", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "40px 20px",
        }}
      >
        <h1 style={{ marginBottom: "40px", textAlign: "center" }}>
          Finalisation de votre commande
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 400px",
            gap: "40px",
          }}
        >
          {/* GAUCHE */}
          <div>
            <div
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "16px",
                boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
              }}
            >
              <h2 style={{ marginBottom: "20px" }}>Votre panier</h2>

              {cart.length === 0 && <p>Votre panier est vide</p>}

              {cart.map((item: CartItem) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginBottom: "20px",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={item.imageUrl || "/images/product-vanille.jpg"}
                    alt={item.name}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "10px",
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: "600" }}>{item.name}</p>

                    <p style={{ fontSize: "14px", color: "#666" }}>
                      Quantité : {item.quantity}
                    </p>

                    <p style={{ fontWeight: "600" }}>
                      {formatPrice(item.priceCents * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* TRUST */}
            <div
              style={{
                marginTop: "20px",
                background: "white",
                padding: "20px",
                borderRadius: "16px",
                boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
              }}
            >
              <h3>Pourquoi choisir Vanille’Or ?</h3>

              <p style={{ marginTop: "10px", color: "#666" }}>
                ✔ Vanille premium de Madagascar <br />
                ✔ Sélection artisanale <br />
                ✔ Livraison rapide et sécurisée
              </p>
            </div>
          </div>

          {/* DROITE */}
          <div>
            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "16px",
                boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
                position: "sticky",
                top: "20px",
              }}
            >
              <h2 style={{ marginBottom: "20px" }}>Résumé</h2>

              {/* LIVRAISON */}
              <div style={{ fontSize: "14px", marginBottom: "15px" }}>
                {remaining > 0 ? (
                  <p style={{ color: "#a16207" }}>
                    🚚 Plus que {formatPrice(remaining)} pour la livraison offerte
                  </p>
                ) : (
                  <p style={{ color: "green" }}>
                    🎉 Livraison offerte
                  </p>
                )}
              </div>

              {/* TOTAL */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Sous-total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <span>Livraison</span>
                <span>
                  {total >= freeShippingThreshold
                    ? "Offerte"
                    : "Calculée au paiement"}
                </span>
              </div>

              <hr />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "15px",
                  fontWeight: "600",
                  fontSize: "18px",
                }}
              >
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              {/* CTA */}
              <button
                onClick={handleCheckout}
                disabled={loading}
                style={{
                  marginTop: "25px",
                  width: "100%",
                  background: loading ? "#999" : "#a16207",
                  color: "white",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  fontSize: "16px",
                }}
              >
                {loading ? "Redirection..." : "Payer en sécurité 🔒"}
              </button>

              <p
                style={{
                  marginTop: "15px",
                  fontSize: "12px",
                  color: "#666",
                  textAlign: "center",
                }}
              >
                Paiement sécurisé • Stripe • Données protégées
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}