"use client";

import { useCart } from "@/lib/cart-store";
import { useUIStore } from "@/components/ui-providers";
import { useEffect, useMemo } from "react";
import Link from "next/link";
import { getImageUrl } from "@/lib/image";

/* =========================
   HELPERS
========================= */

function formatPrice(price: number) {
  return (price / 100).toFixed(2).replace(".", ",") + " €";
}

/* =========================
   COMPONENT
========================= */

export default function MiniCart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isCartOpen, closeCart } = useUIStore();

  const subtotal = useMemo(
    () =>
      cart.reduce((acc, item) => acc + item.priceCents * item.quantity, 0),
    [cart]
  );

  const freeShippingThreshold = 5000;
  const remaining = Math.max(0, freeShippingThreshold - subtotal);
  const progress = Math.min(
    100,
    freeShippingThreshold > 0
      ? (subtotal / freeShippingThreshold) * 100
      : 100
  );

  /* =========================
     AUTO CLOSE SI VIDE
  ========================= */
  useEffect(() => {
    if (cart.length === 0 && isCartOpen) {
      closeCart();
    }
  }, [cart.length, isCartOpen, closeCart]);

  /* =========================
     HIDE IF CLOSED OR EMPTY
  ========================= */
  if (!isCartOpen || cart.length === 0) return null;

  return (
    <div style={overlay} onClick={closeCart} aria-hidden={!isCartOpen}>
      <aside
        style={panel}
        onClick={(e) => e.stopPropagation()}
        aria-label="Mini panier"
      >
        {/* HEADER */}
        <div style={header}>
          <div>
            <p style={eyebrow}>VanilleOr</p>
            <h3 style={title}>Votre panier</h3>
          </div>

          <button
            type="button"
            onClick={closeCart}
            style={closeBtn}
            aria-label="Fermer le panier"
          >
            ✕
          </button>
        </div>

        {/* SHIPPING */}
        <div style={shippingBox}>
          {remaining > 0 ? (
            <>
              <p style={shippingText}>
                Encore <strong>{formatPrice(remaining)}</strong> pour la
                livraison offerte
              </p>

              <div style={bar}>
                <div
                  style={{
                    ...fill,
                    width: `${progress}%`,
                  }}
                />
              </div>
            </>
          ) : (
            <div style={free}>🎉 Livraison offerte débloquée</div>
          )}
        </div>

        {/* ITEMS */}
        <div style={items}>
          {cart.map((item) => (
            <div key={item.id} style={itemRow}>
              <img
                src={getImageUrl(item.imageUrl)}
                alt={item.name}
                style={img}
              />

              <div style={itemMain}>
                <div style={itemTop}>
                  <p style={name}>{item.name}</p>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    style={remove}
                  >
                    Supprimer
                  </button>
                </div>

                <p style={unitPrice}>
                  {formatPrice(item.priceCents)} / unité
                </p>

                <div style={qtyPriceRow}>
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
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div style={footer}>
          <div style={total}>
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <p style={footerHint}>
            Livraison calculée à l’étape suivante.
          </p>

          <Link href="/checkout" style={cta} onClick={closeCart}>
            Commander 🔒
          </Link>

          <Link href="/cart" style={link} onClick={closeCart}>
            Voir le panier
          </Link>

          <button type="button" onClick={clearCart} style={clearBtn}>
            Vider le panier
          </button>
        </div>
      </aside>
    </div>
  );
}

/* =========================
   STYLE
========================= */

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.48)",
  backdropFilter: "blur(3px)",
  zIndex: 9999,
  animation: "fadeIn 0.18s ease-out",
};

const panel: React.CSSProperties = {
  position: "absolute",
  right: 0,
  top: 0,
  width: "100%",
  maxWidth: "410px",
  height: "100%",
  background: "linear-gradient(180deg, #ffffff 0%, #fbf8f3 100%)",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  boxShadow: "-18px 0 40px rgba(0,0,0,0.16)",
  borderTopLeftRadius: 22,
  borderBottomLeftRadius: 22,
  animation: "slideInRight 0.22s ease-out",
};

const header: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
  marginBottom: "14px",
};

const eyebrow: React.CSSProperties = {
  margin: 0,
  fontSize: "12px",
  color: "#a16207",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const title: React.CSSProperties = {
  margin: "6px 0 0",
  fontSize: "26px",
  color: "#111",
};

const closeBtn: React.CSSProperties = {
  background: "#f3f4f6",
  border: "1px solid #e5e7eb",
  borderRadius: "999px",
  width: "38px",
  height: "38px",
  fontSize: "18px",
  cursor: "pointer",
  color: "#111",
};

const shippingBox: React.CSSProperties = {
  marginBottom: "14px",
  padding: "14px",
  background: "#fff7ed",
  border: "1px solid #f3dfc1",
  borderRadius: "14px",
};

const shippingText: React.CSSProperties = {
  fontSize: "13px",
  color: "#6b4b17",
  margin: "0 0 10px",
  lineHeight: 1.5,
};

const bar: React.CSSProperties = {
  height: "8px",
  background: "#eee",
  borderRadius: "999px",
  overflow: "hidden",
};

const fill: React.CSSProperties = {
  height: "100%",
  background: "linear-gradient(135deg,#b7791f,#8b5e14)",
  borderRadius: "999px",
  transition: "width 0.25s ease",
};

const free: React.CSSProperties = {
  background: "#ecfdf5",
  color: "#065f46",
  padding: "10px 12px",
  borderRadius: "10px",
  fontSize: "13px",
  fontWeight: 700,
};

const items: React.CSSProperties = {
  flex: 1,
  overflowY: "auto",
  paddingRight: "4px",
};

const itemRow: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  marginBottom: "14px",
  padding: "12px",
  borderRadius: "16px",
  background: "white",
  border: "1px solid #eee4d4",
};

const img: React.CSSProperties = {
  width: "72px",
  height: "72px",
  borderRadius: "12px",
  objectFit: "cover",
  background: "#f8f5ef",
  flexShrink: 0,
};

const itemMain: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const itemTop: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "10px",
  alignItems: "flex-start",
};

const name: React.CSSProperties = {
  margin: 0,
  fontWeight: 700,
  color: "#111",
  lineHeight: 1.35,
};

const unitPrice: React.CSSProperties = {
  margin: "6px 0 10px",
  fontSize: "12px",
  color: "#777",
};

const qtyPriceRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
};

const qtyRow: React.CSSProperties = {
  display: "inline-flex",
  gap: "8px",
  alignItems: "center",
  background: "#faf7f2",
  border: "1px solid #eee4d4",
  borderRadius: "999px",
  padding: "4px 8px",
};

const qtyBtn: React.CSSProperties = {
  width: "26px",
  height: "26px",
  border: "none",
  background: "white",
  borderRadius: "999px",
  cursor: "pointer",
  fontSize: "16px",
  color: "#111",
  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
};

const qtyValue: React.CSSProperties = {
  minWidth: "16px",
  textAlign: "center",
  fontWeight: 700,
  color: "#111",
};

const price: React.CSSProperties = {
  margin: 0,
  fontWeight: 800,
  color: "#111",
  whiteSpace: "nowrap",
};

const remove: React.CSSProperties = {
  fontSize: "12px",
  color: "#b91c1c",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  fontWeight: 700,
  padding: 0,
};

const footer: React.CSSProperties = {
  borderTop: "1px solid #eee",
  paddingTop: "14px",
  marginTop: "8px",
};

const total: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontWeight: 800,
  marginBottom: "8px",
  fontSize: "18px",
  color: "#111",
};

const footerHint: React.CSSProperties = {
  margin: "0 0 12px",
  fontSize: "12px",
  color: "#777",
};

const cta: React.CSSProperties = {
  display: "block",
  textAlign: "center",
  background: "linear-gradient(135deg,#b7791f,#8b5e14)",
  color: "white",
  padding: "14px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: 800,
  boxShadow: "0 12px 28px rgba(183,121,31,0.28)",
};

const link: React.CSSProperties = {
  display: "block",
  textAlign: "center",
  marginTop: "10px",
  fontSize: "14px",
  color: "#111",
  textDecoration: "none",
  fontWeight: 600,
};

const clearBtn: React.CSSProperties = {
  marginTop: "12px",
  width: "100%",
  background: "white",
  border: "1px solid #e5e7eb",
  padding: "11px 12px",
  borderRadius: "10px",
  fontWeight: 700,
  color: "#7c2d12",
  cursor: "pointer",
};