"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "../../components/ui/toast";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";

  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data?.error || "Erreur de connexion.";
        setError(message);
        showToast(message, "error");
        return;
      }

      showToast("Connexion réussie 🎉", "success");
      window.location.href = redirectTo;
    } catch (err) {
      console.error(err);
      setError("Erreur réseau.");
      showToast("Erreur réseau", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <h1 className="text-3xl font-bold mb-6">Connexion</h1>

        <form onSubmit={handleLogin} style={{ display: "grid", gap: "16px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "12px", border: "1px solid #ddd", borderRadius: "10px" }}
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "12px", border: "1px solid #ddd", borderRadius: "10px" }}
            required
          />

          {error ? <p style={{ color: "#dc2626" }}>{error}</p> : null}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}