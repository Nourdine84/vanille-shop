"use client";

import { useState } from "react";

export default function OrderLookupPage() {
  const [orderId, setOrderId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderId.trim()) return;

    window.location.href = `/order/${orderId.trim()}`;
  };

  return (
    <div style={page}>
      <div style={card}>
        <h1 style={title}>Suivre ma commande</h1>

        <p style={subtitle}>
          Entrez votre numéro de commande pour consulter son état en temps réel.
        </p>

        <form onSubmit={handleSubmit} style={form}>
          <input
            type="text"
            placeholder="Ex: cmd_123456 ou ID complet"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            style={input}
          />

          <button type="submit" style={button}>
            Voir le suivi
          </button>
        </form>
      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  background: "#faf7f2",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
};

const card = {
  width: "100%",
  maxWidth: "560px",
  background: "white",
  borderRadius: "18px",
  padding: "32px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
};

const title = {
  margin: "0 0 12px 0",
  fontSize: "32px",
  textAlign: "center" as const,
};

const subtitle = {
  margin: "0 0 24px 0",
  color: "#666",
  lineHeight: 1.6,
  textAlign: "center" as const,
};

const form = {
  display: "grid",
  gap: "14px",
};

const input = {
  padding: "14px 16px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  fontSize: "15px",
};

const button = {
  background: "#a16207",
  color: "white",
  border: "none",
  borderRadius: "12px",
  padding: "14px 18px",
  fontWeight: 700,
  cursor: "pointer",
};