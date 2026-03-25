"use client";

import { useCart } from "@/lib/cart-store";

type Props = {
  open: boolean;
  onClose: () => void;
};

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function MiniCart({ open, onClose }: Props) {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const total = cart.reduce(
    (acc: number, item: any) =>
      acc + item.priceCents * item.quantity,
    0
  );

  const freeShippingThreshold = 5000;
  const remaining = freeShippingThreshold - total;

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={onClose}
        style={{
          ...overlay,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* DRAWER */}
      <aside
        style={{
          ...drawer,
          transform: open
            ? "translateX(0)"
            : "translateX(100%)",
        }}
      >
        <h2 style={title}>Votre panier</h2>

        {/* ITEMS */}
        <div style={content}>
          {cart.length === 0 && (
            <p style={{ color: "#777" }}>Panier vide</p>
          )}

          {cart.map((item) => (
            <div key={item.id} style={itemBox}>
              <img
                src={item.imageUrl || "/images/product-vanille.jpg"}
                alt={item.name}
                style={img}
              />

              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600 }}>{item.name}</p>

                <p style={{ fontSize: "14px", color: "#666" }}>
                  {formatPrice(item.priceCents)}
                </p>

                <div style={qtyBox}>
                  <button
                    onClick={() =>
                      item.quantity > 1
                        ? updateQuantity(item.id, item.quantity - 1)
                        : removeFromCart(item.id)
                    }
                    style={qtyBtn}
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                    style={qtyBtn}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                style={removeBtn}
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* SHIPPING */}
        {cart.length > 0 && (
          <div style={shipping}>
            {remaining > 0 ? (
              <p style={{ color: "#a16207" }}>
                🚚 Plus que {formatPrice(remaining)} pour livraison offerte
              </p>
            ) : (
              <p style={{ color: "green" }}>
                🎉 Livraison offerte
              </p>
            )}
          </div>
        )}

        {/* TOTAL */}
        <div style={totalBox}>
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        {/* ACTIONS */}
        <button onClick={onClose} style={secondaryBtn}>
          Continuer mes achats
        </button>

        <button
          onClick={() => (window.location.href = "/checkout")}
          style={primaryBtn}
        >
          Passer au paiement 🔒
        </button>
      </aside>
    </>
  );
}

/* 🎨 STYLES */

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  backdropFilter: "blur(4px)",
  transition: "0.3s",
  zIndex: 999,
};

const drawer = {
  position: "fixed" as const,
  top: 0,
  right: 0,
  width: "380px",
  height: "100%",
  background: "white",
  boxShadow: "-10px 0 40px rgba(0,0,0,0.15)",
  transition: "transform 0.35s ease",
  zIndex: 1000,
  padding: "20px",
  display: "flex",
  flexDirection: "column" as const,
};

const title = {
  fontSize: "22px",
  marginBottom: "20px",
};

const content = {
  flex: 1,
  overflowY: "auto" as const,
};

const itemBox = {
  display: "flex",
  gap: "12px",
  marginBottom: "18px",
  alignItems: "center",
};

const img = {
  width: "70px",
  height: "70px",
  objectFit: "cover" as const,
  borderRadius: "10px",
};

const qtyBox = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginTop: "6px",
};

const qtyBtn = {
  padding: "4px 8px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  cursor: "pointer",
  background: "white",
};

const removeBtn = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer",
};

const shipping = {
  fontSize: "14px",
  marginBottom: "10px",
};

const totalBox = {
  display: "flex",
  justifyContent: "space-between",
  fontWeight: 600,
  marginBottom: "15px",
};

const primaryBtn = {
  background: "#a16207",
  color: "white",
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
};

const secondaryBtn = {
  marginBottom: "10px",
  padding: "12px",
  background: "#f3f4f6",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
};