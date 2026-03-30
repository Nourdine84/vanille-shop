"use client";

import { useEffect, useState } from "react";

type OrderData = {
  amount_total: number;
  customer_email?: string;
};

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function SuccessPage() {
  const [data, setData] = useState<OrderData | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) return;

    fetch(`/api/checkout-session?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch(() => {});
  }, []);

  return (
    <div style={container}>
      <div style={card}>
        
        {/* ✅ ICON */}
        <div style={icon}>✅</div>

        {/* TITLE */}
        <h1 style={title}>Paiement confirmé</h1>

        {/* TEXT */}
        <p style={text}>
          Merci pour votre commande chez <strong>Vanille’Or</strong>.
        </p>

        {data && (
          <p style={price}>
            Montant payé : <strong>{formatPrice(data.amount_total)}</strong>
          </p>
        )}

        <p style={subtext}>
          Un email de confirmation vous sera envoyé.
        </p>

        {/* CTA */}
        <a href="/products" style={button}>
          Continuer mes achats
        </a>
      </div>
    </div>
  );
}

/* 🎨 STYLE */

const container = {
  minHeight: "100vh",
  background: "#faf7f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const card = {
  background: "white",
  padding: "50px",
  borderRadius: "20px",
  textAlign: "center" as const,
  maxWidth: "500px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
};

const icon = {
  fontSize: "50px",
  marginBottom: "20px",
};

const title = {
  fontSize: "28px",
  marginBottom: "10px",
};

const text = {
  color: "#666",
  marginBottom: "10px",
};

const subtext = {
  fontSize: "14px",
  color: "#888",
  marginBottom: "25px",
};

const price = {
  marginBottom: "15px",
};

const button = {
  display: "inline-block",
  padding: "14px 28px",
  background: "#a16207",
  color: "white",
  borderRadius: "10px",
  textDecoration: "none",
};