"use client";

import { useCartStore } from "../lib/cart-store";

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function MiniCart({ open, onClose }: any) {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const total = cart.reduce(
    (acc, item) => acc + item.priceCents * item.quantity,
    0
  );

  const freeShippingThreshold = 5000;
  const remaining = freeShippingThreshold - total;

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
            backdropFilter: "blur(3px)",
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
          transition: "right 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
          zIndex: 1000,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Votre panier</h2>

        {/* LISTE PRODUITS */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {cart.length === 0 && <p>Panier vide</p>}

          {cart.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "20px",
                alignItems: "center",
              }}
            >
              <img
                src={item.imageUrl || "/images/product-vanille.jpg"}
                alt={item.name}
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />

              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: "600" }}>{item.name}</p>

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

                  <span>{item.quantity}</span>

                  <button
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

        {/* LIVRAISON */}
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

        {/* RÉCAP COMMANDE */}
        <div style={{ marginBottom: "15px", fontSize: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Sous-total</span>
            <span>{formatPrice(total)}</span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "5px",
            }}
          >
            <span>Livraison</span>
            <span>
              {total >= freeShippingThreshold
                ? "Offerte"
                : "Calculée à l’étape suivante"}
            </span>
          </div>

          <hr style={{ margin: "10px 0" }} />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "600",
            }}
          >
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div>
          <button
            onClick={onClose}
            style={{
              width: "100%",
              marginBottom: "10px",
              background: "#f3f4f6",
              color: "#111",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Continuer mes achats
          </button>

          <button
            onClick={() => (window.location.href = "/checkout")}
            style={{
              width: "100%",
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

          <p
            style={{
              fontSize: "12px",
              color: "#666",
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            Paiement sécurisé • Livraison rapide
          </p>
        </div>
      </div>
    </>
  );
}