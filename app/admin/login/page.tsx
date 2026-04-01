"use client";

import { useState } from "react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!password) {
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
        credentials: "include", // 🔥 FIX CRITIQUE COOKIE
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      if (res.ok) {
        // 🔥 FIX SSR / COOKIE
        window.location.href = "/admin";
      } else {
        alert("Mot de passe incorrect");
      }

    } catch (error) {
      console.error("LOGIN ERROR:", error);
      alert("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>🔐 Admin Login</h1>

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          padding: "10px",
          marginTop: "20px",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      />

      <br />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#a16207",
          color: "white",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Connexion..." : "Se connecter"}
      </button>
    </div>
  );
}