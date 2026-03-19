
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "./ui/toast";

type User = {
  id: string;
  email: string;
  name?: string | null;
};

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();

        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      showToast("Déconnecté avec succès 👋", "info");

      setTimeout(() => {
        window.location.href = "/login";
      }, 800);
    } catch (err) {
      console.error(err);
      showToast("Erreur lors de la déconnexion", "error");
    }
  };

  return (
    <header
      style={{
        borderBottom: "1px solid #eee7db",
        background:
          "linear-gradient(to bottom, rgba(255,253,249,0.96), rgba(255,255,255,0.96))",
        padding: "18px 0",
        marginBottom: "20px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/"
          style={{
            fontWeight: 800,
            fontSize: "24px",
            letterSpacing: "1px",
            color: "#111111",
            textDecoration: "none",
          }}
        >
          Vanille Or
        </Link>

        <nav
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Link href="/" style={{ textDecoration: "none", color: "#111" }}>
            Accueil
          </Link>

          <Link href="/products" style={{ textDecoration: "none", color: "#111" }}>
            Produits
          </Link>

          <Link href="/cart" style={{ textDecoration: "none", color: "#111" }}>
            Panier
          </Link>

          <Link href="/about">À propos</Link>

          {user ? (
            <>
              <span
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  background: "#f7f4ee",
                  padding: "8px 12px",
                  borderRadius: "999px",
                }}
              >
                👤 {user.name || user.email}
              </span>

              <Link href="/account" style={{ textDecoration: "none", color: "#111" }}>
                Mon compte
              </Link>

              <Link
                href="/account/orders"
                style={{ textDecoration: "none", color: "#111" }}
              >
                Mes commandes
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                style={{
                  border: "1px solid #d6d3d1",
                  background: "white",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={{ textDecoration: "none", color: "#111" }}>
                Connexion
              </Link>

              <Link
                href="/register"
                style={{
                  background: "#111",
                  color: "white",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Inscription
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}