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
            style={{ width: "220px", height: "auto", display: "block" }}
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

          <button
            type="button"
            style={cartBtn}
            onClick={openCart}
            aria-label="Ouvrir le panier"
          >
            🛒
            {totalItems > 0 && <span style={badge}>{totalItems}</span>}
          </button>

          <button
            type="button"
            style={burger}
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
          >
            ☰
          </button>
        </div>
      </header>

      <div
        aria-hidden={!menuOpen}
        style={{
          ...overlay,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
        onClick={() => setMenuOpen(false)}
      />

      <div
        aria-hidden={!menuOpen}
        style={{
          ...mobileMenu,
          transform: menuOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        <button
          type="button"
          style={closeBtn}
          onClick={() => setMenuOpen(false)}
          aria-label="Fermer le menu"
        >
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

const header: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 100,
  background: "rgba(255,255,255,0.9)",
  backdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "20px",
  padding: "16px 24px",
  borderBottom: "1px solid rgba(0,0,0,0.05)",
};

const logo: React.CSSProperties = {
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  flexShrink: 0,
};

const navDesktop: React.CSSProperties = {
  display: "flex",
  gap: "20px",
  alignItems: "center",
  justifyContent: "center",
  flex: 1,
};

const link: React.CSSProperties = {
  textDecoration: "none",
  color: "#111",
  fontSize: "15px",
  fontWeight: 500,
  whiteSpace: "nowrap",
};

const mobileLink: React.CSSProperties = {
  display: "block",
  padding: "18px 20px",
  borderBottom: "1px solid #f1f1f1",
};

const actions: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  flexShrink: 0,
};

const cta: React.CSSProperties = {
  background: "#a16207",
  color: "white",
  padding: "10px 16px",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: 600,
  lineHeight: 1.2,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "42px",
};

const cartBtn: React.CSSProperties = {
  position: "relative",
  border: "none",
  background: "transparent",
  fontSize: "20px",
  cursor: "pointer",
  padding: "8px 10px",
  borderRadius: "10px",
};

const badge: React.CSSProperties = {
  position: "absolute",
  top: "-4px",
  right: "-2px",
  background: "#dc2626",
  color: "white",
  borderRadius: "999px",
  fontSize: "10px",
  lineHeight: 1,
  padding: "4px 6px",
  minWidth: "18px",
  textAlign: "center",
};

const burger: React.CSSProperties = {
  fontSize: "22px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: "8px 10px",
  borderRadius: "10px",
};

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  zIndex: 90,
  transition: "opacity 0.2s ease",
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
  boxShadow: "-10px 0 30px rgba(0,0,0,0.12)",
  display: "flex",
  flexDirection: "column",
};

const closeBtn: React.CSSProperties = {
  padding: "15px",
  background: "none",
  border: "none",
  fontSize: "22px",
  cursor: "pointer",
  alignSelf: "flex-end",
};