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
        credentials: "include", // 🔥 COOKIE CRITIQUE
        body: JSON.stringify({ password }),
      });

      let data: any = null;

      try {
        data = await res.json();
      } catch {
        console.warn("⚠️ Réponse non JSON");
      }

      console.log("LOGIN RESPONSE:", data);

      if (res.ok) {
        // 🔥 REDIRECTION SSR SAFE
        window.location.href = "/admin";
      } else {
        alert(data?.error || "Mot de passe incorrect");
      }

    } catch (error) {
      console.error("🔥 LOGIN ERROR:", error);
      alert("Erreur serveur, réessaie");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ENTER KEY SUPPORT
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        maxWidth: "400px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginBottom: "10px" }}>🔐 Admin Login</h1>

      <p style={{ color: "#777", marginBottom: "20px" }}>
        Accès sécurisé Vanille’Or
      </p>

      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        style={{
          padding: "12px",
          width: "100%",
          borderRadius: "10px",
          border: "1px solid #ddd",
          outline: "none",
        }}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          marginTop: "20px",
          width: "100%",
          padding: "12px",
          background: "#a16207",
          color: "white",
          borderRadius: "10px",
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: 600,
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Connexion..." : "Se connecter"}
      </button>
    </div>
  );
}