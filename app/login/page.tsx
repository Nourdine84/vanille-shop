"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useToast } from "../../components/ui/toast";
import BackButton from "@/components/ui/BackButton";

function LoginContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";

  const toast = useToast();
  const showToast = toast?.showToast ?? (() => {});

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

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
        const message =
          data?.error || "Erreur de connexion.";

        setError(message);
        showToast(message, "error");
        return;
      }

      showToast(
        "Connexion réussie 🎉",
        "success"
      );

      window.location.href = redirectTo;

    } catch (err) {
      console.error(err);

      setError("Erreur réseau.");
      showToast("Erreur réseau", "error");

    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={page}>
      <div style={overlay} />

      <div style={card}>
        <div style={logo}>
          Vanille’Or
        </div>

        <BackButton
          label="Retour accueil"
          fallback="/"
        />

        <h1 className="text-3xl font-bold mb-6"></h1>

        <h1 style={title}>
          Connexion
        </h1>

        <p style={subtitle}>
          Accédez à votre espace client premium.
        </p>

        <form
          onSubmit={handleLogin}
          style={form}
        >
          <input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            style={input}
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            style={input}
          />

          {error && (
            <div style={errorBox}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...button,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading
              ? "Connexion..."
              : "Se connecter"}
          </button>
        </form>

        <div style={bottom}>
          <span>
            Pas encore de compte ?
          </span>

          <Link
            href="/register"
            style={link}
          >
            Créer un compte
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 40 }}>
          Chargement...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

/* ================= STYLE ================= */

const page: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "url('/images/hero-vanille.jpg') center/cover",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  padding: 20,
};

const overlay: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(135deg,#000000d9,#2a2117d9)",
};

const card: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  width: "100%",
  maxWidth: 480,
  background: "rgba(255,255,255,0.96)",
  borderRadius: 24,
  padding: 40,
  boxShadow:
    "0 20px 60px rgba(0,0,0,0.25)",
  backdropFilter: "blur(10px)",
};

const logo: React.CSSProperties = {
  textAlign: "center",
  fontSize: 28,
  fontWeight: 900,
  color: "#a16207",
  marginBottom: 10,
};

const title: React.CSSProperties = {
  textAlign: "center",
  fontSize: 34,
  fontWeight: 800,
  marginBottom: 10,
};

const subtitle: React.CSSProperties = {
  textAlign: "center",
  color: "#666",
  marginBottom: 30,
  lineHeight: 1.7,
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
  outline: "none",
};

const button: React.CSSProperties = {
  background:
    "linear-gradient(135deg,#b7791f,#8b5e14)",
  color: "white",
  border: "none",
  padding: 16,
  borderRadius: 14,
  fontWeight: 800,
  fontSize: 15,
  cursor: "pointer",
};

const errorBox: React.CSSProperties = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: 14,
  borderRadius: 12,
  fontSize: 14,
};

const bottom: React.CSSProperties = {
  marginTop: 25,
  textAlign: "center",
  display: "flex",
  justifyContent: "center",
  gap: 6,
  flexWrap: "wrap",
  color: "#666",
};

const link: React.CSSProperties = {
  color: "#a16207",
  fontWeight: 700,
  textDecoration: "none",
};