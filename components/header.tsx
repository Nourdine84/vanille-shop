"use client";

import Link from "next/link";

export default function Header() {
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

        {/* NAVIGATION */}
        <nav style={{ display: "flex", gap: "20px" }}>
          <Link href="/products">Produits</Link>

          <Link href="/cart">Panier</Link>

          <Link href="/account/orders">
            Mes commandes
          </Link>
        </nav>
      </div>
    </header>
  );
}