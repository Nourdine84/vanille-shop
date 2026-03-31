"use client";

import { useState } from "react";

/* =========================
   PAGE
========================= */
export default function ReclamationPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    orderId: "",
    message: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    try {
      // 👉 tu pourras brancher une API plus tard
      await new Promise((res) => setTimeout(res, 1000));

      setSuccess(true);
      setForm({
        name: "",
        email: "",
        orderId: "",
        message: "",
      });
    } catch {
      alert("Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <div style={container}>
        
        <h1 style={title}>Support & Réclamation</h1>

        <p style={subtitle}>
          Une question ou un problème avec votre commande ?  
          Notre équipe vous répond rapidement.
        </p>

        {success && (
          <div style={successBox}>
            ✅ Votre demande a bien été envoyée
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          
          <input
            name="name"
            placeholder="Nom"
            value={form.name}
            onChange={handleChange}
            required
            style={input}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={input}
          />

          <input
            name="orderId"
            placeholder="Numéro de commande (optionnel)"
            value={form.orderId}
            onChange={handleChange}
            style={input}
          />

          <textarea
            name="message"
            placeholder="Décrivez votre demande..."
            value={form.message}
            onChange={handleChange}
            required
            style={textarea}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...button,
              background: loading ? "#999" : "#a16207",
            }}
          >
            {loading ? "Envoi..." : "Envoyer la demande"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* =========================
   STYLE
========================= */

const page = {
  background: "#faf7f2",
  minHeight: "100vh",
  padding: "40px 20px",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
};

const title = {
  textAlign: "center" as const,
  fontSize: "32px",
  marginBottom: "10px",
};

const subtitle = {
  textAlign: "center" as const,
  color: "#666",
  marginBottom: "30px",
};

const successBox = {
  background: "#dcfce7",
  color: "#166534",
  padding: "12px",
  borderRadius: "10px",
  marginBottom: "20px",
  textAlign: "center" as const,
};

const formStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "16px",
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

const button = {
  padding: "14px",
  borderRadius: "12px",
  color: "white",
  border: "none",
  cursor: "pointer",
};