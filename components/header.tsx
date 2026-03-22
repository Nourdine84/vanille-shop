
"use client";

import Link from "next/link";
import { useCartStore } from "../lib/cart-store";
import MiniCart from "./mini-cart";
import { useUIStore } from "../lib/ui-store";

export default function Header() {
  const cart = useCartStore((state) => state.cart);
  const { isCartOpen, openCart, closeCart } = useUIStore();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
          borderBottom: "1px solid #eee",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "#111",
            fontWeight: "700",
            fontSize: "20px",
          }}
        >
          Vanille’Or
        </Link>

        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Link
            href="/products"
            style={{ textDecoration: "none", color: "#111" }}
          >
            Produits
          </Link>

          <Link
            href="/about"
            style={{ textDecoration: "none", color: "#111" }}
          >
            À propos
          </Link>

          <button
            onClick={openCart}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "relative",
              fontSize: "20px",
            }}
          >
            <div style={{ position: "relative" }}>
              🛒
              {totalItems > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-12px",
                    background: "#a16207",
                    color: "white",
                    fontSize: "12px",
                    minWidth: "20px",
                    height: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "999px",
                    padding: "0 6px",
                    fontWeight: "700",
                  }}
                >
                  {totalItems}
                </span>
              )}
            </div>
          </button>
        </div>
      </header>

      <MiniCart open={isCartOpen} onClose={closeCart} />
    </>
  );
}