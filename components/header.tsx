"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useUIStore } from "@/components/ui-provider";

export default function Header() {
  const { cart } = useCart();
  const { openCart } = useUIStore();

  const [menuOpen, setMenuOpen] = useState(false);

  const totalItems = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <>
      <header style={header}>
        
        {/* LOGO */}
        <Link href="/" style={logo}>
          Vanille’Or
        </Link>

        {/* NAV DESKTOP */}
        <nav style={navDesktop}>
          <NavLink href="/products" label="Produits" />
          <NavLink href="/collections/vanille" label="Vanille" />
          <NavLink href="/collections/epices" label="Épices" />
          <NavLink href="/b2b" label="Professionnels" />
          <NavLink href="/about" label="À propos" />
          <NavLink href="/blog" label="Blog" />
        </nav>

        {/* ACTIONS */}
        <div style={actions}>
          
          <Link href="/products" style={cta}>
            Acheter
          </Link>

          {/* CART */}
          <button style={cartBtn} onClick={openCart}>
            🛒
            {totalItems > 0 && (
              <span style={badge}>{totalItems}</span>
            )}
          </button>

          {/* BURGER */}
          <button
            style={burger}
            onClick={() => setMenuOpen(true)}
          >
            ☰
          </button>
        </div>
      </header>

      {/* =========================
         MOBILE MENU (PRO)
      ========================= */}
      {menuOpen && (
        <>
          {/* OVERLAY */}
          <div
            style={overlay}
            onClick={() => setMenuOpen(false)}
          />

          {/* MENU */}
          <div style={mobileMenu}>
            
            <button
              style={closeBtn}
              onClick={() => setMenuOpen(false)}
            >
              ✕
            </button>

            <NavLink href="/products" label="Produits" mobile onClick={() => setMenuOpen(false)} />
            <NavLink href="/collections/vanille" label="Vanille" mobile onClick={() => setMenuOpen(false)} />
            <NavLink href="/collections/epices" label="Épices" mobile onClick={() => setMenuOpen(false)} />
            <NavLink href="/b2b" label="Professionnels" mobile onClick={() => setMenuOpen(false)} />
            <NavLink href="/about" label="À propos" mobile onClick={() => setMenuOpen(false)} />
            <NavLink href="/blog" label="Blog" mobile onClick={() => setMenuOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}

/* =========================
   NAV LINK COMPONENT
========================= */
function NavLink({
  href,
  label,
  mobile = false,
  onClick,
}: {
  href: string;
  label: string;
  mobile?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        ...link,
        ...(mobile ? mobileLink : {}),
      }}
    >
      {label}
    </Link>
  );
}

/* =========================
   STYLE
========================= */

const header = {
  position: "sticky" as const,
  top: 0,
  zIndex: 100,
  backdropFilter: "blur(12px)",
  background: "rgba(255,255,255,0.7)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 30px",
  borderBottom: "1px solid rgba(0,0,0,0.05)",
};

const logo = {
  fontSize: "22px",
  fontWeight: 800,
  color: "#a16207",
  textDecoration: "none",
  letterSpacing: "0.5px",
};

const navDesktop = {
  display: "flex",
  gap: "28px",
};

const link = {
  textDecoration: "none",
  color: "#111",
  fontWeight: 500,
  fontSize: "15px",
  paddingBottom: "4px",
};

const mobileLink = {
  display: "block",
  padding: "18px",
  borderBottom: "1px solid #eee",
  fontSize: "16px",
};

const actions = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const cta = {
  background: "#a16207",
  color: "white",
  padding: "10px 18px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: 600,
};

const cartBtn = {
  position: "relative" as const,
  background: "#f3f4f6",
  border: "none",
  borderRadius: "12px",
  padding: "10px 14px",
  cursor: "pointer",
  fontSize: "18px",
};

const badge = {
  position: "absolute" as const,
  top: "-5px",
  right: "-5px",
  background: "#dc2626",
  color: "white",
  borderRadius: "50%",
  fontSize: "11px",
  padding: "4px 7px",
};

const burger = {
  display: "none",
  fontSize: "22px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
};

/* MOBILE */

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  zIndex: 90,
};

const mobileMenu = {
  position: "fixed" as const,
  top: 0,
  right: 0,
  width: "280px",
  height: "100vh",
  background: "white",
  zIndex: 100,
  boxShadow: "-10px 0 30px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column" as const,
};

const closeBtn = {
  alignSelf: "flex-end",
  fontSize: "22px",
  padding: "15px",
  background: "none",
  border: "none",
  cursor: "pointer",
};

