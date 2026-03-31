"use client";

import React, { useState } from "react";
import { useToast } from "../../components/ui/toast";

export default function RegisterPage() {
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data?.error || "Erreur d'inscription.";
        setError(message);
        showToast(message, "error");
        return;
      }

      showToast("Compte créé 🎉", "success");
      window.location.href = "/account";
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
        <h1 className="text-3xl font-bold mb-6">Créer un compte</h1>

        <form onSubmit={handleRegister} style={{ display: "grid", gap: "16px" }}>
          <input
            type="text"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: "12px", border: "1px solid #ddd", borderRadius: "10px" }}
          />

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
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>
      </div>
    </div>
  );
}