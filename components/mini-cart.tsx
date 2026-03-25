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
  const { cart, removeFromCart, updateQuantity, addToCart } = useCart();

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

        {/* 🔥 SHIPPING + URGENCE */}
        {cart.length > 0 && (
          <div style={shippingBox}>
            {remaining > 0 ? (
              <p style={{ color: "#a16207", fontWeight: 500 }}>
                🚚 Plus que <strong>{formatPrice(remaining)}</strong> pour livraison offerte
              </p>
            ) : (
              <p style={{ color: "green", fontWeight: 600 }}>
                🎉 Livraison offerte activée
              </p>
            )}

            <p style={urgency}>
              🔥 Forte demande sur nos produits
            </p>
          </div>
        )}

        {/* 🔥 UPSELL */}
        {total < 5000 && (
          <div style={upsell}>
            <p style={{ fontWeight: 600 }}>
              💡 Complétez votre commande
            </p>

            <p style={{ fontSize: "13px", color: "#666" }}>
              Ajoutez de la poudre de vanille premium
            </p>

            <button
              onClick={() =>
                addToCart({
                  id: "upsell-vanille",
                  name: "Poudre de vanille",
                  priceCents: 500,
                  quantity: 1,
                })
              }
              style={upsellBtn}
            >
              Ajouter +5€
            </button>
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
          🔒 Paiement sécurisé
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

const shippingBox = {
  fontSize: "14px",
  marginBottom: "12px",
};

const urgency = {
  color: "#dc2626",
  fontSize: "13px",
  marginTop: "5px",
};

const upsell = {
  background: "#f9f6f1",
  padding: "12px",
  borderRadius: "10px",
  marginBottom: "15px",
};

const upsellBtn = {
  marginTop: "8px",
  background: "#a16207",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
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
  padding: "16px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "16px",
  boxShadow: "0 8px 20px rgba(161,98,7,0.3)",
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