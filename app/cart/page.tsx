"use client";

import { useCart } from "@/lib/cart-store";
import { useState } from "react";
import Link from "next/link";

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const [showEmptyPopup, setShowEmptyPopup] = useState(false);

  const total = cart.reduce(
    (acc, item) => acc + item.priceCents * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (cart.length === 0) {
      setShowEmptyPopup(true);
      return;
    }

    window.location.href = "/checkout";
  };

  return (
    <div style={container}>
      <div style={wrapper}>
        <h1 style={title}>Votre panier</h1>

        {/* PANIER VIDE */}
        {cart.length === 0 && (
          <div style={emptyBox}>
            <p>Votre panier est vide</p>
            <Link href="/products" style={ctaPrimary}>
              Voir les produits
            </Link>
          </div>
        )}

        {/* LISTE */}
        {cart.map((item) => (
          <div key={item.id} style={card}>
            <img
              src={item.imageUrl || "/images/product-vanille.jpg"}
              style={img}
            />

            <div style={{ flex: 1 }}>
              <h3>{item.name}</h3>

              <p style={{ color: "#666" }}>
                {formatPrice(item.priceCents)}
              </p>

              {/* QUANTITY */}
              <div style={qtyBox}>
                <button
                  onClick={() =>
                    updateQuantity(item.id, Math.max(1, item.quantity - 1))
                  }
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    updateQuantity(item.id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
            </div>

            {/* REMOVE */}
            <button
              onClick={() => removeFromCart(item.id)}
              style={removeBtn}
            >
              ✕
            </button>
          </div>
        ))}

        {/* TOTAL */}
        {cart.length > 0 && (
          <div style={summary}>
            <h2>Total : {formatPrice(total)}</h2>

            <button style={checkoutBtn} onClick={handleCheckout}>
              Passer au paiement
            </button>
          </div>
        )}
      </div>

      {/* 🔥 POPUP PANIER VIDE */}
      {showEmptyPopup && (
        <div style={popupOverlay}>
          <div style={popup}>
            <h3>Panier vide</h3>
            <p>Ajoutez des produits avant de continuer</p>

            <button
              onClick={() => setShowEmptyPopup(false)}
              style={ctaPrimary}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* 🎨 STYLES */
const container = {
  background: "#faf7f2",
  minHeight: "100vh",
  padding: "40px 20px",
};

const wrapper = {
  maxWidth: "900px",
  margin: "0 auto",
};

const title = {
  textAlign: "center" as const,
  marginBottom: "40px",
};

const card = {
  display: "flex",
  gap: "20px",
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  marginBottom: "20px",
  alignItems: "center",
};

const img = {
  width: "80px",
  height: "80px",
  objectFit: "cover" as const,
  borderRadius: "10px",
};

const qtyBox = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  marginTop: "10px",
};

const removeBtn = {
  background: "transparent",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
};

const summary = {
  marginTop: "30px",
  textAlign: "center" as const,
};

const checkoutBtn = {
  marginTop: "15px",
  background: "#a16207",
  color: "white",
  padding: "16px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
};

const emptyBox = {
  textAlign: "center" as const,
  background: "white",
  padding: "30px",
  borderRadius: "16px",
};

const ctaPrimary = {
  display: "inline-block",
  marginTop: "20px",
  background: "#a16207",
  color: "white",
  padding: "12px 20px",
  borderRadius: "10px",
  textDecoration: "none",
};

const popupOverlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const popup = {
  background: "white",
  padding: "30px",
  borderRadius: "16px",
  textAlign: "center" as const,
};