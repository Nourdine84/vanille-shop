"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { useUIStore } from "@/components/ui-providers";
import { usePathname } from "next/navigation";

export default function Header() {
  const { cart } = useCart();
  const { openCart } = useUIStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header style={header}>
        <Link href="/" style={logo}>
          <Image
            src="/images/logo-vanilleor.png"
            alt="Vanille'Or"
            width={220}
            height={70}
            style={{ width: "220px", height: "auto" }}
            priority
          />
        </Link>

        <nav style={navDesktop}>
          <NavLink href="/products" label="Produits" />
          <NavLink href="/collections/vanille" label="Vanille" />
          <NavLink href="/collections/epices" label="Épices" />
          <NavLink href="/b2b" label="Professionnels" />
          <NavLink href="/about" label="À propos" />
          <NavLink href="/blog" label="Blog" />
        </nav>

        <div style={actions}>
          <Link href="/products" style={cta}>
            Acheter
          </Link>

          <button style={cartBtn} onClick={openCart}>
            🛒
            {totalItems > 0 && <span style={badge}>{totalItems}</span>}
          </button>

          <button style={burger} onClick={() => setMenuOpen(true)}>
            ☰
          </button>
        </div>
      </header>

      {/* 🔥 OVERLAY FIX */}
      <div
        data-overlay
        aria-hidden={!menuOpen}
        onClick={() => setMenuOpen(false)}
        style={{
          ...overlay,
          display: menuOpen ? "block" : "none",
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      />

      {/* 🔥 MENU FIX */}
      <div
        data-panel
        aria-hidden={!menuOpen}
        style={{
          ...mobileMenu,
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        <button style={closeBtn} onClick={() => setMenuOpen(false)}>
          ✕
        </button>

        <NavLink href="/products" label="Produits" mobile />
        <NavLink href="/collections/vanille" label="Vanille" mobile />
        <NavLink href="/collections/epices" label="Épices" mobile />
        <NavLink href="/b2b" label="Professionnels" mobile />
        <NavLink href="/about" label="À propos" mobile />
        <NavLink href="/blog" label="Blog" mobile />
      </div>
    </>
  );
}

function NavLink({
  href,
  label,
  mobile = false,
}: {
  href: string;
  label: string;
  mobile?: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        ...link,
        ...(mobile ? mobileLink : {}),
      }}
    >
      {label}
    </Link>
  );
}

/* ================= STYLES ================= */

const header: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 100,
  background: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 24px",
};

const logo = { display: "flex", alignItems: "center" };

const navDesktop: React.CSSProperties = {
  display: "flex",
  gap: "20px",
  flex: 1,
  justifyContent: "center",
};

const link = {
  textDecoration: "none",
  color: "#111",
};

const mobileLink = {
  padding: "18px",
  borderBottom: "1px solid #eee",
};

const actions: React.CSSProperties = {
  display: "flex",
  gap: "10px",
};

const cta = {
  background: "#a16207",
  color: "white",
  padding: "10px 16px",
  borderRadius: "10px",
};

const cartBtn = {
  position: "relative" as const,
  background: "transparent",
  border: "none",
  fontSize: "20px",
  cursor: "pointer",
};

const badge = {
  position: "absolute" as const,
  top: "-4px",
  right: "-4px",
  background: "red",
  color: "white",
  borderRadius: "999px",
  fontSize: "10px",
  padding: "4px 6px",
};

const burger = {
  fontSize: "22px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
};

/* 🔥 IMPORTANT */
const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  zIndex: 90,
};

const mobileMenu: React.CSSProperties = {
  position: "fixed",
  top: 0,
  right: 0,
  width: "80%",
  maxWidth: "320px",
  height: "100vh",
  background: "white",
  zIndex: 100,
  transition: "transform 0.3s ease",
  display: "flex",
  flexDirection: "column",
};

const closeBtn = {
  alignSelf: "flex-end",
  fontSize: "22px",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  padding: "10px",
};