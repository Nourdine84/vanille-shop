"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/cart-context";
import { useUIStore } from "@/components/ui-providers";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

export default function Header() {
  const { cart } = useCart();
  const { openCart } = useUIStore();

  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const totalItems = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  /* =========================
     CLOSE MENU ON ROUTE
  ========================= */

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  /* =========================
     SCROLL EFFECT
  ========================= */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* =========================
     MOBILE DETECTION
  ========================= */

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 980);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <>
      {/* =========================
         HEADER
      ========================= */}

      <header
        style={{
          ...header,
          ...(scrolled ? headerScrolled : {}),
        }}
      >
        {/* LOGO */}
        <Link href="/" style={logo} data-testid="nav-home">
          <Image
            src="/images/logo-vanilleor.png"
            alt="Vanille'Or"
            width={220}
            height={70}
            priority
            style={{
              width: "180px",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </Link>

        {/* NAV DESKTOP */}
        {!isMobile && (
          <nav style={desktopNav}>
            <NavLink href="/products" label="Produits" data-testid="nav-products" />
            <NavLink href="/collections/vanille" label="Vanille" />
            <NavLink href="/collections/epices" label="Épices" />
            <NavLink href="/packs" label="Packs" />
            <NavLink href="/b2b" label="Professionnels" />
            <NavLink href="/blog" label="Blog" />
          </nav>
        )}

        {/* ACTIONS */}
        <div style={actions}>
          {!isMobile && (
            <Link href="/account" style={accountBtn}>
              Mon compte
            </Link>
          )}

          <button
            onClick={openCart}
            style={cartBtn}
            aria-label="Ouvrir le panier"
            data-testid="cart-button"
          >
            🛒

            {totalItems > 0 && (
              <span style={badge}>
                {totalItems}
              </span>
            )}
          </button>

          {!isMobile && (
            <Link href="/products" style={cta}>
              Acheter
            </Link>
          )}

          {/* BURGER */}
          {isMobile && (
            <button
              style={burger}
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
              data-testid="burger-button"
            >
              ☰
            </button>
          )}
        </div>
      </header>

      {/* =========================
         OVERLAY
      ========================= */}

      <div
        onClick={() => setMenuOpen(false)}
        style={{
          ...overlay,
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      />

      {/* =========================
         MOBILE MENU
      ========================= */}

      <aside
        style={{
          ...mobileMenu,
          transform: menuOpen
            ? "translateX(0)"
            : "translateX(100%)",
        }}
      >
        <div style={mobileTop}>
          <Image
            src="/images/logo-vanilleor.png"
            alt="Vanille'Or"
            width={160}
            height={50}
            style={{
              width: "140px",
              height: "auto",
            }}
          />

          <button
            onClick={() => setMenuOpen(false)}
            style={closeBtn}
          >
            ✕
          </button>
        </div>

        <div style={mobileLinks}>
          <MobileLink href="/products" label="Produits" data-testid="nav-products-mobile" />
          <MobileLink href="/collections/vanille" label="Vanille" />
          <MobileLink href="/collections/epices" label="Épices" />
          <MobileLink href="/packs" label="Packs cadeaux" />
          <MobileLink href="/b2b" label="Professionnels" />
          <MobileLink href="/blog" label="Blog" />
          <MobileLink href="/account" label="Mon compte" />
          <MobileLink href="/reclamation" label="Support / SAV" />
        </div>

        <Link
          href="/products"
          style={mobileCTA}
        >
          Découvrir Vanille’Or
        </Link>
      </aside>
    </>
  );
}

/* =========================
   LINKS
========================= */

function NavLink({
  href,
  label,
  "data-testid": testId,
}: {
  href: string;
  label: string;
  "data-testid"?: string;
}) {
  return (
    <Link href={href} style={navLink} data-testid={testId}>
      {label}
    </Link>
  );
}

function MobileLink({
  href,
  label,
  "data-testid": testId,
}: {
  href: string;
  label: string;
  "data-testid"?: string;
}) {
  return (
    <Link href={href} style={mobileLink} data-testid={testId}>
      {label}
    </Link>
  );
}

/* =========================
   STYLES
========================= */

const header: CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 999,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "18px 28px",
  background: "rgba(248,245,239,0.92)",
  backdropFilter: "blur(10px)",
  transition: "all 0.25s ease",
};

const headerScrolled: CSSProperties = {
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
};

const logo: CSSProperties = {
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
};

const desktopNav: CSSProperties = {
  display: "flex",
  gap: "26px",
  alignItems: "center",
};

const navLink: CSSProperties = {
  textDecoration: "none",
  color: "#111",
  fontSize: "14px",
  fontWeight: 600,
};

const actions: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const accountBtn: CSSProperties = {
  textDecoration: "none",
  color: "#111",
  fontSize: "14px",
  fontWeight: 600,
};

const cartBtn: CSSProperties = {
  position: "relative",
  border: "none",
  background: "white",
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  cursor: "pointer",
  fontSize: "18px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const badge: CSSProperties = {
  position: "absolute",
  top: "-5px",
  right: "-5px",
  background: "#dc2626",
  color: "white",
  fontSize: "10px",
  fontWeight: 700,
  borderRadius: "999px",
  minWidth: "18px",
  height: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cta: CSSProperties = {
  background: "linear-gradient(135deg,#b7791f,#8b5e14)",
  color: "white",
  textDecoration: "none",
  padding: "12px 18px",
  borderRadius: "12px",
  fontWeight: 700,
  fontSize: "14px",
};

const burger: CSSProperties = {
  border: "none",
  background: "transparent",
  fontSize: "24px",
  cursor: "pointer",
};

const overlay: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  zIndex: 998,
  transition: "0.25s ease",
};

const mobileMenu: CSSProperties = {
  position: "fixed",
  top: 0,
  right: 0,
  width: "85%",
  maxWidth: "360px",
  height: "100vh",
  background: "white",
  zIndex: 9999,
  padding: "24px",
  transition: "transform 0.3s ease",
  display: "flex",
  flexDirection: "column",
  boxShadow: "-10px 0 30px rgba(0,0,0,0.12)",
};

const mobileTop: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "30px",
};

const closeBtn: CSSProperties = {
  border: "none",
  background: "transparent",
  fontSize: "24px",
  cursor: "pointer",
};

const mobileLinks: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const mobileLink: CSSProperties = {
  textDecoration: "none",
  color: "#111",
  fontSize: "16px",
  fontWeight: 600,
};

const mobileCTA: CSSProperties = {
  marginTop: "auto",
  textAlign: "center",
  background: "#a16207",
  color: "white",
  textDecoration: "none",
  padding: "16px",
  borderRadius: "14px",
  fontWeight: 700,
};