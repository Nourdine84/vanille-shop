"use client";

import { useState } from "react";

export default function ClaimPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={container}>
      <h1 style={title}>Service après-vente</h1>

      {sent ? (
        <div style={success}>
          ✅ Votre demande a bien été envoyée
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={form}>
          
          <input placeholder="Nom" required style={input} />
          <input placeholder="Email" required style={input} />
          <input placeholder="Numéro de commande" style={input} />

          <textarea
            placeholder="Expliquez votre problème..."
            required
            style={textarea}
          />

          <button type="submit" style={btn}>
            Envoyer la demande
          </button>
        </form>
      )}
    </div>
  );
}

/* STYLE */

const container = {
  maxWidth: "600px",
  margin: "0 auto",
  padding: "40px 20px",
};

const title = {
  textAlign: "center" as const,
  marginBottom: "30px",
};

const form = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "15px",
};

const input = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
};

const textarea = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  minHeight: "120px",
};

const btn = {
  padding: "14px",
  background: "#a16207",
  color: "white",
  borderRadius: "10px",
  border: "none",
};

const success = {
  textAlign: "center" as const,
  padding: "30px",
  background: "#ecfdf5",
  borderRadius: "12px",
};