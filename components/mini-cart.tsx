"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { useUIStore } from "@/components/ui-providers";

type MiniCartProps = {
  open?: boolean;
  onClose?: () => void;
};

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function MiniCart({ open, onClose }: MiniCartProps) {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const { isCartOpen, closeCart } = useUIStore();

  const isOpen = open ?? isCartOpen;
  const handleClose = onClose ?? closeCart;

  if (!isOpen) return null;

  const subtotal = cart.reduce(
    (acc, item) => acc + item.priceCents * item.quantity,
    0
  );

  const freeShippingThreshold = 5000;
  const remaining = Math.max(0, freeShippingThreshold - subtotal);
  const isFreeShipping = subtotal >= freeShippingThreshold;

  return (
    <>
      <div style={styles.overlay} onClick={handleClose} />

      <aside style={styles.cart}>
        {/* HEADER */}
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>Votre panier</h2>
          <button onClick={handleClose} style={styles.closeBtn}>
            ✕
          </button>
        </div>

        {/* SHIPPING BOX */}
        <div style={styles.shippingBox}>
          {isFreeShipping ? (
            <span>🚚 Livraison offerte 🎉</span>
          ) : (
            <>
              <span>
                Encore <strong>{formatPrice(remaining)}</strong> pour la livraison offerte
              </span>
              <div style={styles.shippingHint}>
                🎯 Ajoutez un produit pour économiser la livraison
              </div>
            </>
          )}
        </div>

        {/* LIST */}
        <div style={styles.list}>
          {cart.length === 0 ? (
            <p style={styles.empty}>Votre panier est vide</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} style={styles.itemRow}>
                <img
                  src={item.imageUrl || "/products/default.jpg"}
                  alt={item.name}
                  style={styles.image}
                />

                <div style={styles.itemInfo}>
                  <p style={styles.name}>{item.name}</p>

                  <div style={styles.qtyRow}>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      style={styles.qtyBtn}
                    >
                      −
                    </button>

                    <span style={styles.qtyValue}>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      style={styles.qtyBtn}
                    >
                      +
                    </button>
                  </div>

                  <p style={styles.price}>
                    {formatPrice(item.priceCents * item.quantity)}
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  style={styles.removeBtn}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        {cart.length > 0 && (
          <div style={styles.footer}>
            <div style={styles.totalRow}>
              <span>Total</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            <Link
              href="/checkout"
              style={styles.checkoutBtn}
              onClick={handleClose}
            >
              Payer maintenant 🔒
            </Link>

            <button onClick={handleClose} style={styles.continueBtn}>
              Continuer mes achats
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

/* =========================
   STYLES PREMIUM
========================= */

const styles = {
  overlay: {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    zIndex: 110,
  },
  cart: {
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
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
    borderBottom: "1px solid #eee",
  },
  headerTitle: {
    margin: 0,
    fontSize: "22px",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
  },
  shippingBox: {
    padding: "14px 20px",
    background: "#fef3c7",
    fontSize: "14px",
    color: "#7c4a03",
  },
  shippingHint: {
    fontSize: "12px",
    marginTop: "5px",
  },
  list: {
    flex: 1,
    overflowY: "auto" as const,
    padding: "20px",
  },
  empty: {
    textAlign: "center" as const,
    color: "#777",
  },
  itemRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "18px",
  },
  image: {
    width: "70px",
    height: "70px",
    borderRadius: "10px",
    objectFit: "cover" as const,
  },
  itemInfo: {
    flex: 1,
  },
  name: {
    fontWeight: 600,
  },
  qtyRow: {
    display: "flex",
    gap: "8px",
  },
  qtyBtn: {
    padding: "4px 10px",
    border: "1px solid #ddd",
    cursor: "pointer",
  },
  qtyValue: {
    fontWeight: 600,
  },
  price: {
    color: "#a16207",
    fontWeight: 600,
  },
  removeBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
  },
  footer: {
    padding: "20px",
    borderTop: "1px solid #eee",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
  },
  checkoutBtn: {
    display: "block",
    width: "100%",
    padding: "14px",
    background: "#a16207",
    color: "white",
    borderRadius: "10px",
    textAlign: "center" as const,
    textDecoration: "none",
    marginBottom: "10px",
  },
  continueBtn: {
    width: "100%",
    padding: "12px",
    background: "#f3f4f6",
    border: "none",
    borderRadius: "10px",
  },
};