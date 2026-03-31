"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { useUIStore } from "@/components/ui-provider";

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function MiniCart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
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
      <div style={overlay} onClick={closeCart} />

      <aside style={cartStyle} aria-label="Panier">
        <div style={header}>
          <h2 style={headerTitle}>Votre panier</h2>
          <button
            type="button"
            onClick={closeCart}
            style={closeBtn}
            aria-label="Fermer le panier"
          >
            ✕
          </button>
        </div>

        <div style={shippingBox}>
          {subtotal >= freeShippingThreshold ? (
            <span>🚚 Livraison offerte</span>
          ) : (
            <span>
              Encore <strong>{formatPrice(remaining)}</strong> pour la livraison
              offerte
            </span>
          )}
        </div>

        <div style={list}>
          {cart.length === 0 ? (
            <p style={empty}>Votre panier est vide</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} style={itemRow}>
                <img
                  src={item.imageUrl || "/images/product-vanille.jpg"}
                  alt={item.name}
                  style={image}
                />

                <div style={itemInfo}>
                  <p style={name}>{item.name}</p>

                  <div style={qtyRow}>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      style={qtyBtn}
                      aria-label={`Diminuer la quantité de ${item.name}`}
                    >
                      −
                    </button>

                    <span style={qtyValue}>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      style={qtyBtn}
                      aria-label={`Augmenter la quantité de ${item.name}`}
                    >
                      +
                    </button>
                  </div>

                  <p style={price}>
                    {formatPrice(item.priceCents * item.quantity)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  style={removeBtn}
                  aria-label={`Supprimer ${item.name}`}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div style={footer}>
            <div style={totalRow}>
              <span>Total</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            <Link href="/checkout" style={checkoutBtn} onClick={closeCart}>
              Payer maintenant 🔒
            </Link>

            <button type="button" onClick={closeCart} style={continueBtn}>
              Continuer mes achats
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  zIndex: 110,
};

const cartStyle = {
  position: "fixed" as const,
  right: 0,
  top: 0,
  width: "400px",
  maxWidth: "100%",
  height: "100vh",
  background: "white",
  zIndex: 120,
  display: "flex",
  flexDirection: "column" as const,
  boxShadow: "-10px 0 40px rgba(0,0,0,0.12)",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "20px",
  borderBottom: "1px solid #eee",
};

const headerTitle = {
  margin: 0,
  fontSize: "22px",
};

const closeBtn = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontSize: "18px",
  lineHeight: 1,
};

const shippingBox = {
  padding: "14px 20px",
  background: "#fef3c7",
  fontSize: "14px",
  color: "#7c4a03",
};

const list = {
  flex: 1,
  overflowY: "auto" as const,
  padding: "20px",
};

const empty = {
  textAlign: "center" as const,
  color: "#777",
  marginTop: "40px",
};

const itemRow = {
  display: "flex",
  gap: "12px",
  marginBottom: "18px",
  alignItems: "flex-start",
};

const image = {
  width: "70px",
  height: "70px",
  borderRadius: "10px",
  objectFit: "cover" as const,
  flexShrink: 0,
};

const itemInfo = {
  flex: 1,
};

const name = {
  fontWeight: 600,
  margin: "0 0 6px 0",
  color: "#111",
};

const qtyRow = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  margin: "6px 0",
};

const qtyBtn = {
  padding: "4px 10px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  cursor: "pointer",
  background: "white",
  color: "#111",
};

const qtyValue = {
  minWidth: "18px",
  textAlign: "center" as const,
  fontWeight: 600,
};

const price = {
  color: "#a16207",
  fontWeight: 600,
  margin: "6px 0 0 0",
};

const removeBtn = {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  color: "#777",
  fontSize: "16px",
  lineHeight: 1,
};

const footer = {
  padding: "20px",
  borderTop: "1px solid #eee",
  background: "white",
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
  color: "#111",
  fontWeight: 600,
};