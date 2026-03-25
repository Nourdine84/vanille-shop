"use client";

import { useCart } from "@/lib/cart-store";
import { useUIStore } from "@/components/ui-provider";
import Link from "next/link";

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function CartDrawer() {
  const { cart } = useCart();
  const { isCartOpen, closeCart } = useUIStore();

  const total = cart.reduce(
    (acc, item) => acc + item.priceCents * item.quantity,
    0
  );

  if (!isCartOpen) return null;

  return (
    <div style={overlay} onClick={closeCart}>
      <div style={drawer} onClick={(e) => e.stopPropagation()}>
        <h2>Votre panier</h2>

        {cart.length === 0 && <p>Panier vide</p>}

        {cart.map((item) => (
          <div key={item.id} style={itemStyle}>
            <p>{item.name}</p>
            <p>{item.quantity} x {formatPrice(item.priceCents)}</p>
          </div>
        ))}

        <h3>Total : {formatPrice(total)}</h3>

        <Link href="/checkout" style={cta}>
          Commander
        </Link>
      </div>
    </div>
  );
}

/* STYLES */
const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "flex-end",
  zIndex: 2000,
};

const drawer = {
  width: "350px",
  background: "white",
  padding: "20px",
  height: "100%",
};

const itemStyle = {
  borderBottom: "1px solid #eee",
  padding: "10px 0",
};

const cta = {
  display: "block",
  marginTop: "20px",
  background: "#a16207",
  color: "white",
  padding: "12px",
  borderRadius: "10px",
  textAlign: "center" as const,
  textDecoration: "none",
};