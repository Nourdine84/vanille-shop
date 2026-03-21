"use client";

import { useCartStore } from "../lib/cart-store";

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function MiniCart({ open, onClose }: any) {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const total = cart.reduce(
    (acc, item) => acc + item.priceCents * item.quantity,
    0
  );

  return (
    <>
      {/* OVERLAY */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 999,
          }}
        />
      )}

      {/* PANEL */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: open ? 0 : "-400px",
          width: "360px",
          height: "100%",
          background: "white",
          boxShadow: "-10px 0 30px rgba(0,0,0,0.1)",
          transition: "right 0.3s ease",
          zIndex: 1000,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Votre panier</h2>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {cart.length === 0 && <p>Panier vide</p>}

          {cart.map((item) => (
            <div key={item.id} style={{ marginBottom: "15px" }}>
              <p>{item.name}</p>
              <p>{formatPrice(item.priceCents)}</p>

              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "20px" }}>
          <strong>Total : {formatPrice(total)}</strong>

          <button
            onClick={() => (window.location.href = "/checkout")}
            style={{
              width: "100%",
              marginTop: "10px",
              background: "#a16207",
              color: "white",
              padding: "14px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Payer
          </button>
        </div>
      </div>
    </>
  );
}
