"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import MiniCart from "@/components/mini-cart";
import { useUIStore } from "@/components/ui-provider";

export default function Header() {
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
        </Link>

        {/* NAV */}
        <nav style={nav}>
          <Link href="/products" style={link}>
            Produits
          </Link>

          <Link href="/collections/vanille" style={link}>
            Vanille
          </Link>

          <Link href="/collections/epices" style={link}>
            Épices
          </Link>

          <Link href="/about" style={link}>
            À propos
          </Link>

          {/* CART */}
          <button
            onClick={() => openCart()}
            style={cartButton}
          >
            🛒

            {totalItems > 0 && (
              <span style={badge}>
                {totalItems}
              </span>
            )}
          </button>
        </nav>
      </header>

      {/* CART DRAWER */}
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
  borderBottom: "1px solid #eee",
  background: "#fff",
  position: "sticky" as const,
  top: 0,
  zIndex: 1000,
};

const logo = {
  textDecoration: "none",
  color: "#a16207",
  fontWeight: 800,
  fontSize: "22px",
};

const nav = {
  display: "flex",
  gap: "25px",
  alignItems: "center",
};

const link = {
  textDecoration: "none",
  color: "#111",
  fontWeight: 500,
};

const cartButton = {
  background: "none",
  border: "none",
  cursor: "pointer",
  position: "relative" as const,
  fontSize: "22px",
};

const badge = {
  position: "absolute" as const,
  top: "-6px",
  right: "-10px",
  background: "#a16207",
  color: "white",
  fontSize: "11px",
  minWidth: "18px",
  height: "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "999px",
  padding: "0 5px",
  fontWeight: 700,
};