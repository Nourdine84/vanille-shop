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
          padding: "20px",
          borderBottom: "1px solid #eee",
        }}
      >
        <Link href="/">Vanille’Or</Link>

        <div style={{ display: "flex", gap: "20px" }}>
          <Link href="/products">Produits</Link>
          <Link href="/about">À propos</Link>

          <button onClick={openCart}>
            🛒 ({totalItems})
          </button>
        </div>
      </header>

      <MiniCart open={isCartOpen} onClose={closeCart} />
    </>
  );
}