"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!password.trim()) {
      alert("Entre un mot de passe");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Mot de passe incorrect");
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 250));

      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect") || "/admin/products";

      window.location.replace(redirect);
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      alert("Erreur serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={page}>
      <div style={card}>
        <div style={badge}>ADMIN VANILLE’OR</div>

        <h1 style={title}>🔐 Connexion admin</h1>

        <p style={subtitle}>
          Accès réservé à l’administration de la boutique.
        </p>

        <input
          type="password"
          placeholder="Mot de passe admin"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
          disabled={loading}
          style={input}
        />

        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          style={{
            ...btn,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </div>
    </div>
  );
}

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f8f5ef",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
};

const card: React.CSSProperties = {
  width: "100%",
  maxWidth: 420,
  background: "white",
  padding: 34,
  borderRadius: 24,
  boxShadow: "0 16px 45px rgba(0,0,0,0.08)",
  textAlign: "center",
};

const badge: React.CSSProperties = {
  display: "inline-block",
  background: "#111",
  color: "#d4af37",
  padding: "8px 14px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.12em",
  marginBottom: 18,
};

const title: React.CSSProperties = {
  margin: 0,
  fontSize: 30,
  fontWeight: 900,
};

const subtitle: React.CSSProperties = {
  color: "#666",
  fontSize: 14,
  lineHeight: 1.6,
  marginTop: 12,
  marginBottom: 26,
};

const input: React.CSSProperties = {
  padding: 14,
  width: "100%",
  borderRadius: 12,
  border: "1px solid #ddd",
  fontSize: 15,
  outline: "none",
  boxSizing: "border-box",
};

const btn: React.CSSProperties = {
  marginTop: 18,
  width: "100%",
  padding: 14,
  background: "linear-gradient(135deg,#b7791f,#8b5e14)",
  color: "white",
  borderRadius: 12,
  border: "none",
  fontWeight: 800,
};