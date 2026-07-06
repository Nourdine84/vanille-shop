"use client";

import { useState } from "react";

/* ================= PAGE ================= */

export default function SupportPage() {
  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const formData = new FormData(
        e.currentTarget
      );

      const payload = {
        name: formData.get("name"),
        email: formData.get("email"),
        orderId:
          formData.get("orderId"),
        subject:
          formData.get("subject"),
        message:
          formData.get("message"),
      };

      const res = await fetch(
        "/api/support",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            payload
          ),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Erreur support"
        );
      }

      setSuccess(true);

      (
        e.target as HTMLFormElement
      ).reset();
    } catch (err: any) {
      setError(
        err.message ||
          "Erreur serveur"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={page}>
      <div style={container}>
        {/* HERO */}

        <div style={hero}>
          <p style={heroTag}>
            SUPPORT VANILLE’OR
          </p>

          <h1 style={title}>
            Besoin d’aide ?
          </h1>

          <p style={subtitle}>
            Notre équipe vous répond
            rapidement concernant vos
            commandes, livraisons ou
            demandes SAV.
          </p>
        </div>

        {/* SAV — INFOS */}

        <div style={infoCard}>
          <div style={infoRow}>
            <div style={infoBlock}>
              <p style={infoLabel}>Contact SAV</p>
              <p style={infoValue}>
                <a href="mailto:contact@vanilleor.fr" style={infoLink}>
                  contact@vanilleor.fr
                </a>
              </p>
            </div>

            <div style={infoBlock}>
              <p style={infoLabel}>Délai de réponse</p>
              <p style={infoValue}>48 heures ouvrées maximum</p>
            </div>
          </div>

          <div style={infoSection}>
            <p style={infoHeading}>Procédure de traitement</p>
            <ol style={infoList}>
              <li>Réception de votre demande.</li>
              <li>Numéro de commande obligatoire.</li>
              <li>Description du problème.</li>
              <li>Photos si nécessaire.</li>
              <li>Analyse du dossier.</li>
              <li>
                Remplacement, remboursement ou avoir selon le cas.
              </li>
            </ol>
          </div>

          <div style={infoSection}>
            <p style={infoHeading}>Garantie qualité</p>
            <ul style={infoList}>
              <li>
                <strong>Produit abîmé :</strong> remplacement ou
                remboursement après validation.
              </li>
              <li>
                <strong>Colis perdu :</strong> enquête transporteur puis
                remplacement ou remboursement.
              </li>
              <li>
                <strong>Erreur de préparation :</strong> remplacement
                immédiat aux frais de Vanille’Or.
              </li>
              <li>
                <strong>Produit non conforme :</strong> remboursement ou
                remplacement selon le choix du client après validation.
              </li>
            </ul>
          </div>

          <div style={infoSection}>
            <p style={infoHeading}>Zones de livraison</p>
            <p style={infoValue}>
              France • Europe • DOM-TOM • International
            </p>
          </div>
        </div>

        {/* FORM */}

        <div style={card}>
          {success && (
            <div style={successBox}>
              ✅ Votre demande a bien
              été envoyée.
            </div>
          )}

          {error && (
            <div style={errorBox}>
              ❌ {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={form}
          >
            <input
              name="name"
              placeholder="Votre nom"
              required
              style={input}
            />

            <input
              name="email"
              type="email"
              placeholder="Votre email"
              required
              style={input}
            />

            <input
              name="orderId"
              placeholder="Numéro commande (optionnel)"
              style={input}
            />

            <input
              name="subject"
              placeholder="Sujet"
              required
              style={input}
            />

            <textarea
              name="message"
              placeholder="Décrivez votre demande..."
              required
              rows={7}
              style={textarea}
            />

            <button
              type="submit"
              disabled={loading}
              style={button}
            >
              {loading
                ? "Envoi..."
                : "Envoyer ma demande"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page: React.CSSProperties = {
  background: "#f8f5ef",
  minHeight: "100vh",
  padding: "60px 20px",
};

const container: React.CSSProperties =
  {
    maxWidth: 760,
    margin: "0 auto",
  };

const hero: React.CSSProperties = {
  textAlign: "center",
  marginBottom: 30,
};

const heroTag: React.CSSProperties =
  {
    color: "#a16207",
    fontWeight: 800,
    letterSpacing: "0.1em",
    fontSize: 12,
  };

const title: React.CSSProperties = {
  fontSize: 46,
  marginTop: 10,
  marginBottom: 10,
  fontWeight: 900,
};

const subtitle: React.CSSProperties =
  {
    color: "#666",
    lineHeight: 1.7,
    fontSize: 16,
  };

const card: React.CSSProperties = {
  background: "white",
  borderRadius: 28,
  padding: 30,
  boxShadow:
    "0 12px 40px rgba(0,0,0,0.06)",
};

const infoCard: React.CSSProperties = {
  background: "white",
  borderRadius: 28,
  padding: 30,
  marginBottom: 24,
  boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
};

const infoRow: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 16,
  marginBottom: 20,
};

const infoBlock: React.CSSProperties = {
  background: "#faf7f2",
  borderRadius: 16,
  padding: 16,
};

const infoLabel: React.CSSProperties = {
  margin: "0 0 6px",
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#a16207",
};

const infoValue: React.CSSProperties = {
  margin: 0,
  fontSize: 15,
  color: "#333",
  lineHeight: 1.6,
};

const infoLink: React.CSSProperties = {
  color: "#a16207",
  fontWeight: 700,
  textDecoration: "none",
};

const infoSection: React.CSSProperties = {
  marginTop: 18,
  paddingTop: 18,
  borderTop: "1px solid #eee",
};

const infoHeading: React.CSSProperties = {
  margin: "0 0 10px",
  fontSize: 16,
  fontWeight: 800,
  color: "#111",
};

const infoList: React.CSSProperties = {
  margin: 0,
  paddingLeft: 20,
  color: "#444",
  fontSize: 14,
  lineHeight: 1.8,
};

const form: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const input: React.CSSProperties = {
  padding: 16,
  borderRadius: 14,
  border: "1px solid #ddd",
  fontSize: 15,
};

const textarea: React.CSSProperties =
  {
    padding: 16,
    borderRadius: 14,
    border: "1px solid #ddd",
    resize: "vertical",
    fontSize: 15,
  };

const button: React.CSSProperties =
  {
    background:
      "linear-gradient(135deg,#b7791f,#8b5e14)",
    color: "white",
    border: "none",
    borderRadius: 14,
    padding: "18px 20px",
    fontWeight: 800,
    fontSize: 15,
    cursor: "pointer",
  };

const successBox: React.CSSProperties =
  {
    background: "#dcfce7",
    color: "#166534",
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    fontWeight: 700,
  };

const errorBox: React.CSSProperties =
  {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: 16,
    borderRadius: 14,
    marginBottom: 20,
    fontWeight: 700,
  };