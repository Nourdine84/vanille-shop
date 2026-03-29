"use client";

import { useState } from "react";

export default function B2BPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);

    const data = {
      name: form.get("name"),
      email: form.get("email"),
      company: form.get("company"),
      quantity: form.get("quantity"),
      message: form.get("message"),
    };

    try {
      const res = await fetch("/api/b2b", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();

      setSuccess(true);
    } catch {
      alert("Erreur lors de l'envoi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <div style={wrapper}>
        <h1 style={title}>Offre Professionnelle</h1>

        <p style={subtitle}>
          Vous souhaitez commander en grande quantité ?
          Nous proposons des offres adaptées aux professionnels
          à partir de 10kg.
        </p>

        {success ? (
          <div style={successBox}>
            ✅ Votre demande a bien été envoyée.
            <br />
            Nous vous répondrons rapidement.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={formStyle}>
            <input name="name" placeholder="Nom" required style={input} />
            <input name="email" placeholder="Email" required style={input} />
            <input name="company" placeholder="Entreprise" style={input} />

            <select name="quantity" required style={input}>
              <option value="">Quantité souhaitée</option>
              <option>10 kg</option>
              <option>25 kg</option>
              <option>50 kg</option>
              <option>100 kg +</option>
            </select>

            <textarea
              name="message"
              placeholder="Votre besoin (type produit, conditionnement...)"
              style={{ ...input, height: "120px" }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                ...button,
                background: loading ? "#999" : "#a16207",
              }}
            >
              {loading ? "Envoi..." : "Demander un devis"}
            </button>
          </form>
        )}

        <div style={trust}>
          ✔ Approvisionnement direct Madagascar <br />
          ✔ Capacité gros volume (tonnes) <br />
          ✔ Qualité premium & traçabilité
        </div>
      </div>
    </div>
  );
}

/* 🎨 STYLE */

const container = {
  background: "#faf7f2",
  minHeight: "100vh",
  padding: "60px 20px",
};

const wrapper = {
  maxWidth: "700px",
  margin: "0 auto",
  textAlign: "center" as const,
};

const title = {
  fontSize: "32px",
  marginBottom: "10px",
};

const subtitle = {
  color: "#666",
  marginBottom: "40px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "15px",
};

const input = {
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #ddd",
};

const button = {
  padding: "16px",
  borderRadius: "12px",
  color: "white",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
};

const successBox = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
};

const trust = {
  marginTop: "40px",
  color: "#666",
};