"use client";

import { useCart } from "@/lib/cart-context";
import { useUIStore } from "@/components/ui-providers";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getImageUrl } from "@/lib/image";

function formatPrice(price: number) {
  return (price / 100).toFixed(2).replace(".", ",") + " €";
}

const FREE_SHIPPING = 5000;

export default function MiniCart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isCartOpen, closeCart } = useUIStore();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + item.priceCents * item.quantity, 0),
    [cart]
  );

  const progress = Math.min((subtotal / FREE_SHIPPING) * 100, 100);

  if (!mounted) return null;

  return (
    <div
      data-testid="cart-overlay"
      style={{
        ...overlay,
        opacity: isCartOpen ? 1 : 0,
        pointerEvents: isCartOpen ? "auto" : "none",
      }}
      onClick={closeCart}
      aria-hidden={!isCartOpen}
    >
      <aside
        id="mini-cart-root"
        data-testid="mini-cart"
        style={{
          ...panel,
          transform: isCartOpen ? "translateX(0)" : "translateX(100%)",
        }}
        onClick={(e) => e.stopPropagation()}
        aria-hidden={!isCartOpen}
      >
        <div style={header}>
          <h3 style={title}>Votre panier</h3>
          <button type="button" onClick={closeCart} style={closeBtn} aria-label="Fermer le panier">
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <div style={emptyBox}>
            <p data-testid="cart-empty">Votre panier est vide</p>
          </div>
        ) : (
          <>
            <div style={shippingBox}>
              {subtotal >= FREE_SHIPPING ? (
                <p style={free}>🎉 Livraison offerte</p>
              ) : (
                <p style={shippingText}>
                  Plus que <strong>{formatPrice(FREE_SHIPPING - subtotal)}</strong>{" "}
                  pour la livraison offerte
                </p>
              )}

              <div style={bar}>
                <div style={{ ...fill, width: `${progress}%` }} />
              </div>
            </div>

            <div style={items} data-testid="cart-items">
              {cart.map((item, index) => (
                <div
                  key={item.id}
                  data-testid="cart-item"
                  style={itemRow}
                >
                  <div data-testid={`cart-item-${index}`} style={{ display: "contents" }}>
                    <img
                      src={getImageUrl(item.imageUrl)}
                      alt={item.name}
                      style={img}
                    />

                    <div style={itemContent}>
                      <p style={name}>{item.name}</p>

                      <p style={unitPrice}>{formatPrice(item.priceCents)}</p>

                      <div style={qtyPriceRow}>
                        <div style={qtyRow}>
                          <button
                            type="button"
                            data-testid="decrease-qty"
                            style={qtyBtn}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
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
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Augmenter la quantité"
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
                        data-testid="remove-item"
                        style={remove}
                        onClick={() => removeFromCart(item.id)}
                      >
                        Supprimer
                      </button>
                    </div>
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
                style={cta}
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
    </div>
  );
}

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  backdropFilter: "blur(4px)",
  zIndex: 9999,
  transition: "0.2s",
};

const panel = {
  position: "absolute" as const,
  right: 0,
  top: 0,
  width: "100%",
  maxWidth: "420px",
  height: "100%",
  background: "linear-gradient(180deg,#fff,#fbf8f3)",
  padding: "20px",
  display: "flex",
  flexDirection: "column" as const,
  borderTopLeftRadius: 20,
  borderBottomLeftRadius: 20,
  boxShadow: "-20px 0 50px rgba(0,0,0,0.2)",
  transition: "0.25s",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
};

const title = {
  fontSize: "22px",
  fontWeight: 800,
};

const closeBtn = {
  border: "none",
  background: "#f3f4f6",
  borderRadius: "50%",
  width: "34px",
  height: "34px",
  cursor: "pointer",
};

const emptyBox = {
  textAlign: "center" as const,
  padding: "40px 0",
  color: "#666",
};

const shippingBox = {
  marginBottom: "12px",
  padding: "12px",
  background: "#fff7ed",
  borderRadius: "12px",
  border: "1px solid #f3dfc1",
};

const shippingText = {
  fontSize: "13px",
  marginBottom: "6px",
};

const free = {
  fontWeight: 700,
  color: "#065f46",
};

const bar = {
  height: "6px",
  background: "#eee",
  borderRadius: "999px",
};

const fill = {
  height: "100%",
  background: "#a16207",
};

const items = {
  flex: 1,
  overflowY: "auto" as const,
};

const itemRow = {
  display: "flex",
  gap: "10px",
  marginBottom: "12px",
  padding: "10px",
  borderRadius: "14px",
  background: "white",
};

const img = {
  width: "70px",
  height: "70px",
  borderRadius: "10px",
  objectFit: "cover" as const,
};

const itemContent = {
  flex: 1,
};

const name = {
  fontWeight: 700,
};

const unitPrice = {
  fontSize: "12px",
  color: "#777",
};

const qtyPriceRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const qtyRow = {
  display: "flex",
  gap: "6px",
};

const qtyBtn = {
  border: "none",
  background: "#f3f4f6",
  borderRadius: "50%",
  width: "24px",
  height: "24px",
  cursor: "pointer",
};

const qtyValue = {
  fontWeight: 700,
};

const price = {
  fontWeight: 800,
};

const remove = {
  fontSize: "12px",
  color: "#dc2626",
  border: "none",
  background: "transparent",
  cursor: "pointer",
};

const footer = {
  borderTop: "1px solid #eee",
  paddingTop: "12px",
};

const total = {
  display: "flex",
  justifyContent: "space-between",
  fontWeight: 800,
  marginBottom: "10px",
};

const cta = {
  display: "block",
  textAlign: "center" as const,
  background: "#a16207",
  color: "white",
  padding: "14px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: 800,
};

const clearBtn = {
  marginTop: "8px",
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
};