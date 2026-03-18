"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type User = {
  id: string;
  email: string;
  name?: string | null;
};

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        const data = await res.json();

        if (data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/";
  };

  return (
    <header
      style={{
        borderBottom: "1px solid #e5e7eb",
        padding: "16px 0",
        marginBottom: "24px",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* LOGO */}
        <Link href="/" style={{ fontWeight: 700, fontSize: "20px" }}>
          Vanille Or
        </Link>

        {/* NAV */}
        <nav style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Link href="/products">Produits</Link>
          <Link href="/cart">Panier</Link>

          {user ? (
            <>
              <span style={{ fontSize: "14px", color: "#6b7280" }}>
                👤 {user.name || user.email}
              </span>

              <Link href="/account">Mon compte</Link>
              <Link href="/account/orders">Mes commandes</Link>

              <button onClick={handleLogout}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Connexion</Link>
              <Link href="/register">Inscription</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
