"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useUIStore } from "@/components/ui-providers";
import { getImageUrl } from "@/lib/image";

function safeNumber(value: any) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatPrice(priceCents: number) {
  const safe = safeNumber(priceCents);
  return (safe / 100).toFixed(2).replace(".", ",") + " €";
}

const FREE_SHIPPING_CENTS = 5000;

export default function MiniCart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isCartOpen, closeCart } = useUIStore();

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (acc, item) =>
          acc + safeNumber(item.priceCents) * safeNumber(item.quantity),
        0
      ),
    [cart]
  );

  const remainingForFreeShipping = Math.max(
    FREE_SHIPPING_CENTS - subtotal,
    0
  );

  const progress = Math.min((subtotal / FREE_SHIPPING_CENTS) * 100, 100);

  return (
    <>
      <div
        data-overlay
        aria-hidden={!isCartOpen}
        onClick={closeCart}
        style={{
          ...overlay,
          display: isCartOpen ? "block" : "none",
          opacity: isCartOpen ? 1 : 0,
          pointerEvents: isCartOpen ? "auto" : "none",
        }}
      />

      <aside
        data-panel
        aria-hidden={!isCartOpen}
        data-testid="mini-cart"
        style={{
          ...panel,
          display: isCartOpen ? "flex" : "none",
          transform: isCartOpen ? "translateX(0)" : "translateX(100%)",
          pointerEvents: isCartOpen ? "auto" : "none",
        }}
      >
        <div style={header}>
          <h3 style={title}>Votre panier</h3>

          <button
            type="button"
            onClick={closeCart}
            style={closeBtn}
            aria-label="Fermer le panier"
          >
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <div style={emptyBox}>
            <p data-testid="cart-empty" style={emptyText}>
              Votre panier est vide
            </p>
          </div>
        ) : (
          <>
            <div style={shippingBox}>
              {subtotal >= FREE_SHIPPING_CENTS ? (
                <p style={free}>🎉 Livraison offerte</p>
              ) : (
                <p style={shippingText}>
                  Plus que{" "}
                  <strong>{formatPrice(remainingForFreeShipping)}</strong> pour
                  la livraison offerte
                </p>
              )}

              <div style={bar}>
                <div style={{ ...fill, width: `${progress}%` }} />
              </div>
            </div>

            <div style={items} data-testid="cart-items">
              {cart.map((item, index) => (
                <div key={item.id} data-testid="cart-item" style={itemRow}>
                  <img
                    src={getImageUrl(item.imageUrl)}
                    alt={item.name}
                    style={img}
                  />

                  <div data-testid={`cart-item-${index}`} style={itemContent}>
                    <p style={name}>{item.name}</p>

                    <p style={unitPrice}>{formatPrice(item.priceCents)}</p>

                    <div style={qtyPriceRow}>
                      <div style={qtyRow}>
                        <button
                          type="button"
                          data-testid="decrease-qty"
                          style={qtyBtn}
                          onClick={() =>
                            updateQuantity(item.id, safeNumber(item.quantity) - 1)
                          }
                          aria-label="Diminuer la quantité"
                        >
                          -
                        </button>

                        <span data-testid="item-quantity" style={qtyValue}>
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          data-testid="increase-qty"
                          style={qtyBtn}
                          onClick={() =>
                            updateQuantity(item.id, safeNumber(item.quantity) + 1)
                          }
                          aria-label="Augmenter la quantité"
                        >
                          +
                        </button>
                      </div>

                      <p style={price}>
                        {formatPrice(
                          safeNumber(item.priceCents) * safeNumber(item.quantity)
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      data-testid="remove-item"
                      style={removeBtn}
                      onClick={() => removeFromCart(item.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={footer}>
              <div style={total} data-testid="cart-total">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                style={checkoutBtn}
                data-testid="checkout-button"
              >
                Commander
              </Link>

              <button
                type="button"
                onClick={clearCart}
                style={clearBtn}
                data-testid="clear-cart"
              >
                Vider le panier
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  backdropFilter: "blur(4px)",
  zIndex: 9998,
  transition: "opacity 0.2s ease",
};

const panel: React.CSSProperties = {
  position: "fixed",
  top: 0,
  right: 0,
  width: "100%",
  maxWidth: "420px",
  height: "100vh",
  background: "linear-gradient(180deg,#fff,#fbf8f3)",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  borderTopLeftRadius: 20,
  borderBottomLeftRadius: 20,
  boxShadow: "-20px 0 50px rgba(0,0,0,0.2)",
  transition: "transform 0.25s ease",
  zIndex: 9999,
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px",
};

const title: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: 800,
  margin: 0,
};

const closeBtn: React.CSSProperties = {
  border: "none",
  background: "#f3f4f6",
  borderRadius: "50%",
  width: "34px",
  height: "34px",
  cursor: "pointer",
  fontSize: "16px",
};

const emptyBox: React.CSSProperties = {
  textAlign: "center",
  padding: "40px 0",
};

const emptyText: React.CSSProperties = {
  color: "#666",
  margin: 0,
};

const shippingBox: React.CSSProperties = {
  marginBottom: "12px",
  padding: "12px",
  background: "#fff7ed",
  borderRadius: "12px",
  border: "1px solid #f3dfc1",
};

const shippingText: React.CSSProperties = {
  fontSize: "13px",
  marginBottom: "6px",
};

const free: React.CSSProperties = {
  fontWeight: 700,
  color: "#065f46",
  margin: 0,
};

const bar: React.CSSProperties = {
  height: "6px",
  background: "#eee",
  borderRadius: "999px",
  overflow: "hidden",
};

const fill: React.CSSProperties = {
  height: "100%",
  background: "#a16207",
  transition: "width 0.25s ease",
};

const items: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  paddingRight: "4px",
};

const itemRow: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  marginBottom: "12px",
  padding: "10px",
  borderRadius: "14px",
  background: "white",
};

const img: React.CSSProperties = {
  width: "70px",
  height: "70px",
  borderRadius: "10px",
  objectFit: "cover",
  flexShrink: 0,
};

const itemContent: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const name: React.CSSProperties = {
  fontWeight: 700,
  margin: "0 0 4px",
};

const unitPrice: React.CSSProperties = {
  fontSize: "12px",
  color: "#777",
  margin: "0 0 8px",
};

const qtyPriceRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
};

const qtyRow: React.CSSProperties = {
  display: "flex",
  gap: "6px",
  alignItems: "center",
};

const qtyBtn: React.CSSProperties = {
  border: "none",
  background: "#f3f4f6",
  borderRadius: "50%",
  width: "24px",
  height: "24px",
  cursor: "pointer",
};

const qtyValue: React.CSSProperties = {
  fontWeight: 700,
  minWidth: "18px",
  textAlign: "center",
};

const price: React.CSSProperties = {
  fontWeight: 800,
  margin: 0,
};

const removeBtn: React.CSSProperties = {
  marginTop: "8px",
  fontSize: "12px",
  color: "#dc2626",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  padding: 0,
};

const footer: React.CSSProperties = {
  borderTop: "1px solid #eee",
  paddingTop: "12px",
  marginTop: "10px",
};

const total: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontWeight: 800,
  marginBottom: "10px",
};

const checkoutBtn: React.CSSProperties = {
  display: "block",
  textAlign: "center",
  background: "#a16207",
  color: "white",
  padding: "14px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: 800,
};

const clearBtn: React.CSSProperties = {
  marginTop: "8px",
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
};