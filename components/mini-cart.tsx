"use client";

import { useCart } from "@/lib/cart-store";

type MiniCartProps = {
  open: boolean;
  onClose: () => void;
};

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function MiniCart({ open, onClose }: MiniCartProps) {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const total = cart.reduce(
    (acc, item) => acc + item.priceCents * item.quantity,
    0
  );

  const freeShippingThreshold = 5000;
  const remaining = freeShippingThreshold - total;

  return (
    <>
      {open && (
        <div
          data-testid="cart-overlay"
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 999,
          }}
        />
      )}

      <aside
        data-testid="mini-cart"
        aria-hidden={!open}
        style={{
          position: "fixed",
          top: 0,
          right: open ? 0 : "-400px",
          width: "380px",
          height: "100%",
          background: "#fff",
          boxShadow: "-10px 0 40px rgba(0,0,0,0.15)",
          transition: "right 0.35s ease",
          zIndex: 1000,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <h2 style={{ fontSize: "22px", marginBottom: "20px" }}>
          Votre panier
        </h2>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {cart.length === 0 && <p data-testid="empty-cart">Panier vide</p>}

          {cart.map((item) => (
            <div
              key={item.id}
              data-testid="cart-item"
              style={{
                display: "flex",
                gap: "12px",
                marginBottom: "18px",
                alignItems: "center",
              }}
            >
              <img
                src={item.imageUrl || "/images/product-vanille.jpg"}
                alt={item.name}
                style={{
                  width: "70px",
                  height: "70px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />

              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600 }}>{item.name}</p>

                <p style={{ fontSize: "14px", color: "#666" }}>
                  {formatPrice(item.priceCents)}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "6px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      item.quantity > 1
                        ? updateQuantity(item.id, item.quantity - 1)
                        : removeFromCart(item.id)
                    }
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                      cursor: "pointer",
                      background: "white",
                    }}
                  >
                    -
                  </button>

                  <span data-testid="item-quantity">{item.quantity}</span>
                  
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      border: "1px solid #ddd",
                      cursor: "pointer",
                      background: "white",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                data-testid="remove-item"
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
                ✕
              </button>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div style={{ marginBottom: "10px", fontSize: "14px" }}>
            {remaining > 0 ? (
              <p style={{ color: "#a16207" }}>
                🚚 Plus que {formatPrice(remaining)} pour la livraison offerte
              </p>
            ) : (
              <p style={{ color: "green" }}>🎉 Livraison offerte activée !</p>
            )}
          </div>
        )}

        <div
          data-testid="cart-total"
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "600",
            marginBottom: "15px",
          }}
        >
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            marginBottom: "10px",
            padding: "12px",
            background: "#f3f4f6",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Continuer mes achats
        </button>

        <button
          type="button"
          data-testid="checkout-button"
          onClick={() => {
            window.location.href = "/checkout";
          }}
          style={{
            background: "#a16207",
            color: "white",
            padding: "14px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Passer au paiement 🔒
        </button>
      </aside>
    </>
  );
}