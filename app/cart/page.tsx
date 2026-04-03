"use client";

import { useCart } from "@/lib/cart-store";
import { useState } from "react";
import Link from "next/link";

/* =========================
   UTILS
========================= */

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

/* =========================
   PAGE
========================= */

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const [showEmptyPopup, setShowEmptyPopup] = useState(false);

  const total = cart.reduce(
    (acc, item) => acc + item.priceCents * item.quantity,
    0
  );

  const isEmpty = cart.length === 0;

  /* =========================
     ACTIONS
  ========================= */

  const handleCheckout = () => {
    if (isEmpty) {
      setShowEmptyPopup(true);
      return;
    }

    window.location.href = "/checkout";
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <div style={container}>
      <div style={wrapper}>
        <h1 style={title}>Votre panier</h1>

        {/* EMPTY */}
        {isEmpty && (
          <div style={emptyBox}>
            <p style={{ marginBottom: 10 }}>
              Votre panier est vide
            </p>

            <Link href="/products" style={ctaPrimary}>
              Voir les produits
            </Link>
          </div>
        )}

        {/* LIST */}
        {!isEmpty &&
          cart.map((item) => {
            const isMax = item.quantity >= 99;

            return (
              <div key={item.id} style={card}>
                <img
                  src={item.imageUrl || "/images/product-vanille.jpg"}
                  alt={item.name}
                  style={img}
                />

                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0 }}>{item.name}</h3>

                  <p style={priceText}>
                    {formatPrice(item.priceCents)}
                  </p>

                  {/* QUANTITY */}
                  <div style={qtyBox}>
                    <button
                      style={qtyBtn}
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      style={{
                        ...qtyBtn,
                        opacity: isMax ? 0.5 : 1,
                        cursor: isMax ? "not-allowed" : "pointer",
                      }}
                      disabled={isMax}
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
            );
          })}

        {/* SUMMARY */}
        {!isEmpty && (
          <div style={summary}>
            <h2>Total : {formatPrice(total)}</h2>

            <div style={ctaRow}>
              <button
                style={checkoutBtn}
                onClick={handleCheckout}
              >
                Passer au paiement
              </button>

              <button
                style={clearBtn}
                onClick={clearCart}
              >
                Vider le panier
              </button>
            </div>
          </div>
        )}
      </div>

      {/* POPUP */}
      {showEmptyPopup && (
        <div
          style={popupOverlay}
          onClick={() => setShowEmptyPopup(false)}
        >
          <div
            style={popup}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: 10 }}>
              Panier vide
            </h3>

            <p style={{ color: "#666" }}>
              Ajoutez des produits avant de continuer
            </p>

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

/* =========================
   STYLES
========================= */

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
  fontSize: "32px",
};

const card = {
  display: "flex",
  gap: "20px",
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  marginBottom: "20px",
  alignItems: "center",
  boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
};

const img = {
  width: "80px",
  height: "80px",
  objectFit: "cover" as const,
  borderRadius: "10px",
};

const priceText = {
  color: "#666",
  marginTop: "4px",
};

const qtyBox = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  marginTop: "10px",
};

const qtyBtn = {
  padding: "6px 12px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  cursor: "pointer",
  background: "white",
};

const removeBtn = {
  background: "transparent",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
  color: "#dc2626",
};

const summary = {
  marginTop: "30px",
  textAlign: "center" as const,
};

const ctaRow = {
  display: "flex",
  gap: "12px",
  justifyContent: "center",
  flexWrap: "wrap" as const,
};

const checkoutBtn = {
  background: "#a16207",
  color: "white",
  padding: "16px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
  width: "200px",
};

const clearBtn = {
  background: "#eee",
  color: "#333",
  padding: "16px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
  width: "200px",
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
  border: "none",
  cursor: "pointer",
};

const popupOverlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const popup = {
  background: "white",
  padding: "30px",
  borderRadius: "16px",
  textAlign: "center" as const,
  maxWidth: "300px",
};
