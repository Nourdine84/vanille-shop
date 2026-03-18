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
        borderBottom: "1px solid #ece7df",
        background: "#fffdf9",
        padding: "18px 0",
        marginBottom: "24px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(8px)",
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
            fontSize: "22px",
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
          <Link href="/products" style={{ textDecoration: "none", color: "#111" }}>
            Produits
          </Link>

          <Link href="/cart" style={{ textDecoration: "none", color: "#111" }}>
            Panier
          </Link>

          {user ? (
            <>
              <span
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  background: "#f3f4f6",
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
                className="btn-secondary"
                style={{
                  background: "transparent",
                  cursor: "pointer",
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

              <Link href="/register" className="btn-primary">
                Inscription
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
