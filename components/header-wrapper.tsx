"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { useUIStore } from "@/components/ui-provider";
import MiniCart from "@/components/mini-cart";

export default function HeaderWrapper() {
  const { cart } = useCart();
  const { isCartOpen, openCart, closeCart } = useUIStore();

  const totalItems = cart.reduce(
    (acc: number, item: any) => acc + item.quantity,
    0
  );

  return (
    <>
      <header style={header}>
        {/* LOGO */}
        <Link href="/" style={logo}>
          Vanille’Or
          <span style={sub}>AKM.Consulting</span>
        </Link>

        {/* NAV */}
        <nav style={nav}>
          <Link href="/products">Produits</Link>
          <Link href="/collections/vanille">Vanille</Link>
          <Link href="/collections/epices">Épices</Link>
        </nav>

        {/* PANIER */}
        <div
          style={cartWrapper}
          onClick={() => openCart()}
        >
          🛒

          {totalItems > 0 && (
            <span style={badge}>{totalItems}</span>
          )}
        </div>
      </header>

      {/* 🔥 ICI LE FIX CRITIQUE */}
      <MiniCart open={isCartOpen} onClose={closeCart} />
    </>
  );
}

/* 🎨 STYLES */

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px 40px",
  background: "white",
  borderBottom: "1px solid #eee",
  position: "sticky" as const,
  top: 0,
  zIndex: 1000,
};

const logo = {
  fontWeight: "700",
  fontSize: "20px",
  textDecoration: "none",
  color: "#a16207",
};

const sub = {
  display: "block",
  fontSize: "10px",
  color: "#999",
};

const nav = {
  display: "flex",
  gap: "20px",
};

const cartWrapper = {
  position: "relative" as const,
  cursor: "pointer",
  fontSize: "20px",
};

const badge = {
  position: "absolute" as const,
  top: "-8px",
  right: "-10px",
  background: "#a16207",
  color: "white",
  fontSize: "12px",
  padding: "2px 6px",
  borderRadius: "10px",
};