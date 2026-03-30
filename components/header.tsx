"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { useUIStore } from "@/components/ui-provider";

export default function Header() {
  const { cart } = useCart();
  const { openCart } = useUIStore();

  const totalItems = cart.reduce(
    (acc: number, item: any) => acc + item.quantity,
    0
  );

  return (
    <header style={header}>
      
      {/* LOGO */}
      <Link href="/" style={logo}>
        Vanille’Or
      </Link>

      {/* NAV */}
      <nav style={nav}>
        <Link href="/products" style={link}>Produits</Link>
        <Link href="/collections/vanille" style={link}>Vanille</Link>
        <Link href="/collections/epices" style={link}>Épices</Link>
        <Link href="/b2b" style={link}>Pro</Link>
      </nav>

      {/* ACTIONS */}
      <div style={actions}>
        
        {/* LOGIN */}
        <Link href="/login" style={login}>
          Connexion
        </Link>

        {/* CART */}
        <button onClick={openCart} style={cartBtn}>
          🛒
          {totalItems > 0 && (
            <span style={badge}>{totalItems}</span>
          )}
        </button>
      </div>
    </header>
  );
}

/* 🎨 STYLE PREMIUM */

const header = {
  position: "sticky" as const,
  top: 0,
  zIndex: 100,
  background: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(10px)",
  borderBottom: "1px solid #eee",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "18px 40px",
};

const logo = {
  fontSize: "22px",
  fontWeight: 800,
  color: "#a16207",
  textDecoration: "none",
  letterSpacing: "0.5px",
};

const nav = {
  display: "flex",
  gap: "30px",
};

const link = {
  textDecoration: "none",
  color: "#111",
  fontWeight: 500,
};

const actions = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const login = {
  textDecoration: "none",
  color: "#555",
  fontSize: "14px",
};

const cartBtn = {
  position: "relative" as const,
  background: "#a16207",
  color: "white",
  border: "none",
  borderRadius: "10px",
  padding: "10px 14px",
  cursor: "pointer",
};

const badge = {
  position: "absolute" as const,
  top: "-6px",
  right: "-6px",
  background: "#dc2626",
  color: "white",
  fontSize: "11px",
  borderRadius: "50%",
  padding: "3px 6px",
};