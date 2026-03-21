"use client";

import { useCartStore } from "../../lib/cart-store";

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function CartPage() {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const total = cart.reduce(
    (acc, item) => acc + item.priceCents * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h2>Votre panier est vide</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 20px" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "30px" }}>
        Votre panier
      </h1>

      {cart.map((item) => (
        <div
          key={item.id}
          style={{
            borderBottom: "1px solid #eee",
            paddingBottom: "20px",
            marginBottom: "20px",
          }}
        >
          <h3>{item.name}</h3>

          <p>Quantité : {item.quantity}</p>

          <p>{formatPrice(item.priceCents)}</p>

          <button
            onClick={() => removeFromCart(item.id)}
            style={{
              marginTop: "10px",
              background: "#dc2626",
              color: "white",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Supprimer
          </button>
        </div>
      ))}

      <h2 style={{ marginTop: "30px" }}>
        Total : {formatPrice(total)}
      </h2>

      <button
        style={{
          marginTop: "20px",
          width: "100%",
          background: "#a16207",
          color: "white",
          padding: "16px",
          borderRadius: "12px",
          fontSize: "16px",
          fontWeight: "600",
          border: "none",
          cursor: "pointer",
        }}
        onClick={() => {
          window.location.href = "/checkout";
        }}
      >
        Passer au paiement
      </button>
    </div>
  );
}
