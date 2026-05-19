"use client";

import { useState } from "react";
import BackButton from "@/components/ui/BackButton";

export default function ReclamationPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    orderId: "",
    subject: "",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch("/api/reclamation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur serveur");
      }

      setSuccess(true);

      setForm({
        name: "",
        email: "",
        orderId: "",
        subject: "",
        message: "",
      });

    } catch (err: any) {
      console.error("❌ SAV ERROR:", err);

      alert(
        err?.message ||
          "Erreur lors de l'envoi de votre demande."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={page}>
      <div style={hero}>
        <p style={tag}>SUPPORT VANILLE’OR</p>
        

        <BackButton
          label="Retour boutique"
          fallback="/"
        />

        <h1 style={title}>
          Support & Réclamation
        </h1>

        <p style={subtitle}>
          Une question concernant votre commande,
          livraison ou produit ?
          <br />
          Notre équipe vous répond rapidement.
        </p>
      </div>

      <div style={container}>
        {success && (
          <div style={successBox}>
            ✅ Votre demande a bien été envoyée.
            <br />
            Notre équipe reviendra vers vous rapidement.
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={grid}>
            <input
              name="name"
              placeholder="Nom complet"
              value={form.name}
              onChange={handleChange}
              required
              style={input}
            />

            <input
              name="email"
              type="email"
              placeholder="Adresse email"
              value={form.email}
              onChange={handleChange}
              required
              style={input}
            />
          </div>

          <input
            name="orderId"
            placeholder="Numéro de commande (optionnel)"
            value={form.orderId}
            onChange={handleChange}
            style={input}
          />

          <input
            name="subject"
            placeholder="Sujet de votre demande"
            value={form.subject}
            onChange={handleChange}
            required
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
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "Envoi en cours..."
              : "Envoyer la demande"}
          </button>
        </form>

        <div style={infoBox}>
          <div style={infoCard}>
            <h3 style={infoTitle}>📦 Commande</h3>

            <p style={infoText}>
              Assistance livraison et suivi colis.
            </p>
          </div>

          <div style={infoCard}>
            <h3 style={infoTitle}>💳 Paiement</h3>

            <p style={infoText}>
              Paiement sécurisé via Stripe.
            </p>
          </div>

          <div style={infoCard}>
            <h3 style={infoTitle}>🌿 Produits</h3>

            <p style={infoText}>
              Questions qualité et conseils produits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   STYLE
========================= */

const page = {
  background: "#f8f5ef",
  minHeight: "100vh",
};

const hero = {
  padding: "90px 20px 50px",
  textAlign: "center" as const,
};

const tag = {
  color: "#a16207",
  fontWeight: 800,
  letterSpacing: "0.15em",
  marginBottom: "15px",
};

const title = {
  fontSize: "46px",
  marginBottom: "20px",
  color: "#111",
};

const subtitle = {
  color: "#666",
  lineHeight: 1.8,
  maxWidth: "700px",
  margin: "0 auto",
};

const container = {
  maxWidth: "850px",
  margin: "0 auto",
  padding: "0 20px 80px",
};

const successBox = {
  background: "#dcfce7",
  color: "#166534",
  padding: "18px",
  borderRadius: "16px",
  marginBottom: "25px",
  textAlign: "center" as const,
  fontWeight: 600,
};

const formStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "24px",
  display: "flex",
  flexDirection: "column" as const,
  gap: "18px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.05)",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "15px",
};

const input = {
  padding: "15px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  fontSize: "15px",
  outline: "none",
};

const textarea = {
  padding: "15px",
  borderRadius: "14px",
  border: "1px solid #ddd",
  minHeight: "160px",
  resize: "vertical" as const,
  fontSize: "15px",
  outline: "none",
};

const button = {
  background: "linear-gradient(135deg,#b7791f,#8b5e14)",
  color: "white",
  padding: "16px",
  borderRadius: "16px",
  border: "none",
  cursor: "pointer",
  fontWeight: 800,
  fontSize: "15px",
};

const infoBox = {
  marginTop: "30px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: "18px",
};

const infoCard = {
  background: "white",
  padding: "24px",
  borderRadius: "20px",
  boxShadow: "0 6px 24px rgba(0,0,0,0.04)",
};

const infoTitle = {
  marginBottom: "10px",
};

const infoText = {
  color: "#666",
  lineHeight: 1.7,
};