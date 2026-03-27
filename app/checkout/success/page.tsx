"use client";

import { useEffect } from "react";

export default function SuccessPage() {
  useEffect(() => {
    // 🔥 EVENT TRACKING (optionnel)
    if (typeof window !== "undefined") {
      (window as any).gtag?.("event", "purchase", {
        currency: "EUR",
      });
    }
  }, []);

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={title}>🎉 Paiement réussi</h1>

        <p style={text}>
          Merci pour votre commande.
          <br />
          Elle est en cours de préparation.
        </p>

        <div style={box}>
          <p style={info}>
            📦 Vous recevrez un email de confirmation avec le suivi.
          </p>
        </div>

        <a href="/" style={primaryBtn}>
          Retour à l’accueil
        </a>

        <a href="/products" style={secondaryBtn}>
          Continuer mes achats
        </a>
      </div>
    </div>
  );
}

/* 🎨 STYLE PREMIUM */

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#faf7f2",
};

const card = {
  background: "white",
  padding: "40px",
  borderRadius: "20px",
  textAlign: "center" as const,
  maxWidth: "420px",
  width: "100%",
  boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
};

const title = {
  fontSize: "28px",
  marginBottom: "15px",
};

const text = {
  color: "#666",
  marginBottom: "25px",
  lineHeight: 1.6,
};

const box = {
  background: "#f3f4f6",
  padding: "15px",
  borderRadius: "12px",
  marginBottom: "25px",
};

const info = {
  margin: 0,
  fontSize: "14px",
};

const primaryBtn = {
  display: "block",
  background: "#a16207",
  color: "white",
  padding: "14px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: 600,
  marginBottom: "10px",
};

const secondaryBtn = {
  display: "block",
  background: "#eee",
  padding: "12px",
  borderRadius: "12px",
  textDecoration: "none",
  color: "#111",
};