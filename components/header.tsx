"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { useUIStore } from "@/components/ui-providers";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react"; // ✅ FIX IMPORTANT

export default function Header() {
  const { cart } = useCart();
  const { openCart } = useUIStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handler = (e: any) => {
      if (!e?.detail?.name) return;

      setToast(`${e.detail.name} ajouté au panier`);

      const timeout = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(timeout);
    };

    window.addEventListener("cart:add", handler);
    return () => window.removeEventListener("cart:add", handler);
  }, []);

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

      <div
        onClick={() => setMenuOpen(false)}
        style={{
          ...overlay,
          display: menuOpen ? "block" : "none",
        }}
      />

      <div
        style={{
          ...mobileMenu,
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
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

      {toast && <div style={toastStyle}>✅ {toast}</div>}
    </>
  );
}

/* ================= NAV LINK ================= */

function NavLink({ href, label, mobile = false }: any) {
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

const header: CSSProperties = {
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

const logo: CSSProperties = {
  display: "flex",
  alignItems: "center",
};

const navDesktop: CSSProperties = {
  display: "flex",
  gap: "20px",
  flex: 1,
  justifyContent: "center",
};

const link: CSSProperties = {
  textDecoration: "none",
  color: "#111",
};

const mobileLink: CSSProperties = {
  padding: "18px",
  borderBottom: "1px solid #eee",
};

const actions: CSSProperties = {
  display: "flex",
  gap: "10px",
};

const cta: CSSProperties = {
  background: "#a16207",
  color: "white",
  padding: "10px 16px",
  borderRadius: "10px",
};

const cartBtn: CSSProperties = {
  position: "relative",
  background: "transparent",
  border: "none",
  fontSize: "20px",
  cursor: "pointer",
};

const badge: CSSProperties = {
  position: "absolute",
  top: "-4px",
  right: "-4px",
  background: "red",
  color: "white",
  borderRadius: "999px",
  fontSize: "10px",
  padding: "4px 6px",
};

const burger: CSSProperties = {
  fontSize: "22px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
};

const overlay: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  zIndex: 90,
};

const mobileMenu: CSSProperties = {
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

const closeBtn: CSSProperties = {
  alignSelf: "flex-end",
  fontSize: "22px",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  padding: "10px",
};

const toastStyle: CSSProperties = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  background: "#111",
  color: "white",
  padding: "14px 18px",
  borderRadius: "12px",
  zIndex: 99999,
  fontWeight: 600,
};