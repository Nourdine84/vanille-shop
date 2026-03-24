"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import MiniCart from "./mini-cart";
import { useUIStore } from "@/components/ui-provider";

export default function Header() {
  const { cart } = useCart();
  const { isCartOpen, openCart, closeCart } = useUIStore();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 40px",
          borderBottom: "1px solid #eee",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* LOGO */}
        <Link
          href="/"
          data-testid="logo"
          style={{
            textDecoration: "none",
            color: "#111",
            fontWeight: 800,
            fontSize: "22px",
            letterSpacing: "0.5px",
          }}
        >
          Vanille’Or
        </Link>

        {/* NAV */}
        <nav style={{ display: "flex", gap: "30px", alignItems: "center" }}>
          <Link
            href="/products"
            data-testid="nav-products"
            style={{
              textDecoration: "none",
              color: "#111",
              fontWeight: 500,
            }}
          >
            Produits
          </Link>

          <Link
            href="/about"
            data-testid="nav-about"
            style={{
              textDecoration: "none",
              color: "#111",
              fontWeight: 500,
            }}
          >
            À propos
          </Link>

          {/* CART */}
          <button
            data-testid="cart-button"
            onClick={openCart}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "relative",
              fontSize: "22px",
            }}
          >
            🛒

            {totalItems > 0 && (
              <span
                data-testid="cart-count"
                style={{
                  position: "absolute",
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
                }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </nav>
      </header>

      {/* MINI CART */}
      <MiniCart open={isCartOpen} onClose={closeCart} />
    </>
  );
}
