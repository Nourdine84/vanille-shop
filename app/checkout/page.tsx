"use client";

import { useState, useEffect } from "react";
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

  // 🚚 LIVRAISON
  const freeShippingThreshold = 5000; // 50€
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 490;
  const total = subtotal + shippingCost;

  const remaining = freeShippingThreshold - subtotal;

  const handleCheckout = async () => {
    if (!cart.length) {
      alert("Votre panier est vide");
      return;
    }

    setLoading(true);

    // 🔥 TRACK CHECKOUT
    if (typeof window !== "undefined") {
      (window as any).gtag?.("event", "begin_checkout", {
        currency: "EUR",
        value: total / 100,
        items: cart,
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

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      alert("Erreur paiement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#faf7f2", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "40px" }}>
          Finalisation de votre commande
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "40px" }}>
          
          {/* PANIER */}
          <div style={card}>
            <h2>Votre panier</h2>

            {cart.map((item: CartItem) => (
              <div key={item.id} style={itemStyle}>
                <p>{item.name}</p>
                <p>
                  {item.quantity} × {formatPrice(item.priceCents)}
                </p>
              </div>
            ))}
          </div>

          {/* RESUME */}
          <div style={card}>
            <h2>Résumé</h2>

            {/* SHIPPING MESSAGE */}
            <div style={{ marginBottom: "15px" }}>
              {shippingCost === 0 ? (
                <p style={{ color: "green" }}>
                  🎉 Livraison offerte
                </p>
              ) : (
                <p style={{ color: "#a16207" }}>
                  🚚 Plus que {formatPrice(remaining)} pour livraison offerte
                </p>
              )}
            </div>

            {/* PRICES */}
            <Row label="Sous-total" value={formatPrice(subtotal)} />
            <Row
              label="Livraison"
              value={shippingCost === 0 ? "Offerte" : formatPrice(shippingCost)}
            />

            <hr />

            <Row
              label="Total"
              value={formatPrice(total)}
              bold
            />

            {/* CTA */}
            <button onClick={handleCheckout} style={cta}>
              {loading ? "Chargement..." : "Payer 🔒"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* COMPONENT ROW */
function Row({ label, value, bold = false }: any) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        margin: "10px 0",
        fontWeight: bold ? 700 : 400,
      }}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

/* STYLES */
const card = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
};

const itemStyle = {
  borderBottom: "1px solid #eee",
  padding: "10px 0",
};

const cta = {
  marginTop: "20px",
  width: "100%",
  background: "#a16207",
  color: "white",
  padding: "16px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
};