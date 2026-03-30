"use client";

import { useCart } from "@/lib/cart-store";
import { useUIStore } from "@/components/ui-provider";

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function MiniCart() {
  const { cart, removeFromCart } = useCart();
  const { isCartOpen, closeCart } = useUIStore();

  if (!isCartOpen) return null;

  const subtotal = cart.reduce(
    (acc, item) => acc + item.priceCents * item.quantity,
    0
  );

  const freeShippingThreshold = 5000;
  const remaining = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <>
      {/* OVERLAY */}
      <div style={overlay} onClick={closeCart} />

      {/* CART */}
      <div style={cartStyle}>
        
        {/* HEADER */}
        <div style={header}>
          <h2 style={{ margin: 0 }}>Votre panier</h2>
          <button onClick={closeCart} style={closeBtn}>✕</button>
        </div>

        {/* SHIPPING INFO */}
        <div style={shippingBox}>
          {subtotal >= freeShippingThreshold ? (
            <span>🚚 Livraison offerte</span>
          ) : (
            <span>
              Encore <strong>{formatPrice(remaining)}</strong> pour la livraison offerte
            </span>
          )}
        </div>

        {/* LIST */}
        <div style={list}>
          {cart.length === 0 ? (
            <p style={emptyText}>
              Votre panier est vide
            </p>
          ) : (
            cart.map((item) => (
              <div key={item.id} style={itemRow}>
                
                {/* IMAGE */}
                <img
                  src={item.imageUrl || "/images/product-vanille.jpg"}
                  alt={item.name}
                  style={image}
                />

                {/* INFO */}
                <div style={{ flex: 1 }}>
                  <p style={itemName}>{item.name}</p>

                  <p style={itemQty}>
                    Quantité : {item.quantity}
                  </p>

                  <p style={itemPrice}>
                    {formatPrice(item.priceCents * item.quantity)}
                  </p>
                </div>

                {/* REMOVE */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={removeBtn}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        {cart.length > 0 && (
          <div style={footer}>
            
            {/* TOTAL */}
            <div style={totalRow}>
              <span>Total</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            {/* CTA CHECKOUT */}
            <a href="/checkout" style={checkoutBtn}>
              Payer maintenant 🔒
            </a>

            {/* CTA CONTINUE */}
            <button onClick={closeCart} style={continueBtn}>
              Continuer mes achats
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* 🎨 STYLE */

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  zIndex: 40,
};

const cartStyle = {
  position: "fixed" as const,
  right: 0,
  top: 0,
  width: "400px",
  maxWidth: "100%",
  height: "100vh",
  background: "white",
  zIndex: 50,
  display: "flex",
  flexDirection: "column" as const,
  boxShadow: "-10px 0 30px rgba(0,0,0,0.1)",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px",
  borderBottom: "1px solid #eee",
};

const closeBtn = {
  background: "transparent",
  border: "none",
  fontSize: "18px",
  cursor: "pointer",
};

const shippingBox = {
  padding: "12px 20px",
  background: "#fef3c7",
  fontSize: "14px",
};

const list = {
  flex: 1,
  overflowY: "auto" as const,
  padding: "20px",
};

const emptyText = {
  textAlign: "center" as const,
  color: "#777",
};

const itemRow = {
  display: "flex",
  gap: "12px",
  marginBottom: "15px",
  alignItems: "center",
};

const image = {
  width: "70px",
  height: "70px",
  borderRadius: "10px",
  objectFit: "cover" as const,
};

const itemName = {
  fontWeight: 600,
  marginBottom: "4px",
};

const itemQty = {
  fontSize: "13px",
  color: "#666",
};

const itemPrice = {
  color: "#a16207",
  fontWeight: 600,
};

const removeBtn = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  color: "#999",
};

const footer = {
  padding: "20px",
  borderTop: "1px solid #eee",
};

const totalRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "15px",
  fontSize: "16px",
};

const checkoutBtn = {
  display: "block",
  width: "100%",
  textAlign: "center" as const,
  padding: "14px",
  background: "#a16207",
  color: "white",
  borderRadius: "10px",
  textDecoration: "none",
  marginBottom: "10px",
  fontWeight: 600,
};

const continueBtn = {
  width: "100%",
  padding: "12px",
  background: "#f3f4f6",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
};