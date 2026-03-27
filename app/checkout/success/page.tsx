"use client";

import { useEffect } from "react";

export default function SuccessPage() {
  useEffect(() => {
    (window as any).gtag?.("event", "purchase", {
      currency: "EUR",
    });
  }, []);

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={title}>🎉 Paiement réussi</h1>

        <p style={text}>
          Merci pour votre commande Vanille’Or.
        </p>

        <div style={box}>
          <p style={info}>
            📦 Votre commande est en préparation.
            <br />
            Vous recevrez un email avec votre suivi.
          </p>
        </div>

        <a href="/" style={primaryBtn}>
          Accueil
        </a>

        <a href="/products" style={secondaryBtn}>
          Continuer mes achats
        </a>
      </div>
    </div>
  );
}

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
};

const title = { fontSize: "28px" };
const text = { color: "#666", marginBottom: "20px" };
const box = { background: "#f3f4f6", padding: "15px", borderRadius: "10px" };
const info = { fontSize: "14px" };

const primaryBtn = {
  display: "block",
  marginTop: "20px",
  background: "#a16207",
  color: "white",
  padding: "12px",
  borderRadius: "10px",
  textDecoration: "none",
};

const secondaryBtn = {
  display: "block",
  marginTop: "10px",
  background: "#eee",
  padding: "10px",
  borderRadius: "10px",
  textDecoration: "none",
};