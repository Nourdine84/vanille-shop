"use client";

import { useEffect, useState } from "react";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = cart.reduce(
    (acc: number, item: CartItem) =>
      acc + item.priceCents * item.quantity,
    0
  );

  const freeShippingThreshold = 5000; // 50 €
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 490; // 4,90 €
  const total = subtotal + shippingCost;
  const remaining = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckout = async () => {
    if (!cart.length) {
      alert("Votre panier est vide");
      return;
    }

    setLoading(true);

    if (typeof window !== "undefined") {
      (window as any).gtag?.("event", "begin_checkout", {
        currency: "EUR",
        value: total / 100,
        items: cart.map((item: CartItem) => ({
          item_id: item.id,
          item_name: item.name,
          price: item.priceCents / 100,
          quantity: item.quantity,
        })),
      });
    }

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart,
          shippingCost,
        }),
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
    } catch (error) {
      console.error(error);
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
        <h1
          style={{
            textAlign: "center",
            marginBottom: "40px",
            fontSize: "32px",
          }}
        >
          Finalisation de votre commande
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 400px",
            gap: "40px",
          }}
        >
          {/* COLONNE GAUCHE */}
          <div>
            <div style={cardStyle}>
              <h2 style={{ marginBottom: "20px" }}>Votre sélection</h2>

              {cart.length === 0 && (
                <p style={{ color: "#666" }}>Votre panier est vide.</p>
              )}

              {cart.map((item: CartItem) => (
                <div key={item.id} style={itemRowStyle}>
                  <img
                    src={item.imageUrl || "/images/product-vanille.jpg"}
                    alt={item.name}
                    style={itemImageStyle}
                  />

                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, marginBottom: "6px" }}>
                      {item.name}
                    </p>

                    <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                      Quantité : {item.quantity}
                    </p>

                    <p
                      style={{
                        marginTop: "8px",
                        fontWeight: 600,
                        color: "#a16207",
                      }}
                    >
                      {formatPrice(item.priceCents * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ ...cardStyle, marginTop: "20px" }}>
              <h3 style={{ marginBottom: "15px" }}>Pourquoi choisir Vanille’Or ?</h3>

              <p style={infoTextStyle}>
                ✔ Vanille premium de Madagascar
                <br />
                ✔ Sélection artisanale
                <br />
                ✔ Paiement sécurisé
                <br />
                ✔ Expédition rapide France & Europe
              </p>
            </div>
          </div>

          {/* COLONNE DROITE */}
          <div>
            <div
              style={{
                ...cardStyle,
                position: "sticky",
                top: "20px",
              }}
            >
              <h2 style={{ marginBottom: "20px" }}>Résumé</h2>

              <div style={{ marginBottom: "15px", fontSize: "14px" }}>
                {shippingCost === 0 ? (
                  <p style={{ color: "green", fontWeight: 600, margin: 0 }}>
                    🎉 Livraison offerte activée
                  </p>
                ) : (
                  <p style={{ color: "#a16207", margin: 0 }}>
                    🚚 Plus que <strong>{formatPrice(remaining)}</strong> pour la
                    livraison offerte
                  </p>
                )}
              </div>

              <PriceRow label="Sous-total" value={formatPrice(subtotal)} />

              <PriceRow
                label="Livraison"
                value={shippingCost === 0 ? "Offerte" : formatPrice(shippingCost)}
              />

              <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "18px 0" }} />

              <PriceRow
                label="Total"
                value={formatPrice(total)}
                bold
              />

              <button
                onClick={handleCheckout}
                disabled={loading || cart.length === 0}
                style={{
                  ...checkoutButtonStyle,
                  background:
                    loading || cart.length === 0 ? "#999" : "#a16207",
                  cursor:
                    loading || cart.length === 0 ? "not-allowed" : "pointer",
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
                  lineHeight: 1.5,
                }}
              >
                Paiement sécurisé via Stripe
                <br />
                Vos données sont protégées
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        margin: "10px 0",
        fontWeight: bold ? 700 : 400,
        fontSize: bold ? "18px" : "15px",
      }}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
};

const itemRowStyle = {
  display: "flex",
  gap: "15px",
  alignItems: "center",
  paddingBottom: "16px",
  marginBottom: "16px",
  borderBottom: "1px solid #eee",
};

const itemImageStyle = {
  width: "80px",
  height: "80px",
  objectFit: "cover" as const,
  borderRadius: "10px",
};

const infoTextStyle = {
  margin: 0,
  color: "#666",
  lineHeight: 1.8,
};

const checkoutButtonStyle = {
  marginTop: "25px",
  width: "100%",
  color: "white",
  padding: "16px",
  borderRadius: "12px",
  border: "none",
  fontWeight: 700,
  fontSize: "16px",
  boxShadow: "0 8px 20px rgba(161,98,7,0.25)",
};