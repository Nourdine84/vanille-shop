"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
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
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = "/admin/products"; // 🔥 FIX ROUTE
      } else {
        alert(data?.error || "Mot de passe incorrect");
      }

    } catch (error) {
      console.error("LOGIN ERROR:", error);
      alert("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <h1 style={title}>🔐 Admin Vanille’Or</h1>

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        style={input}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={btn}
      >
        {loading ? "Connexion..." : "Se connecter"}
      </button>
    </div>
  );
}

const container = {
  padding: 40,
  textAlign: "center" as const,
  maxWidth: 400,
  margin: "0 auto",
};

const title = {
  marginBottom: 20,
};

const input = {
  padding: 12,
  width: "100%",
  borderRadius: 10,
  border: "1px solid #ddd",
};

const btn = {
  marginTop: 20,
  width: "100%",
  padding: 12,
  background: "#a16207",
  color: "white",
  borderRadius: 10,
  border: "none",
};