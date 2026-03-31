"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";
import CrossSell from "@/components/cross-sell";

/* =========================
   MODAL ERREUR
========================= */
function ErrorModal({
  open,
  message,
  onClose,
}: {
  open: boolean;
  message: string;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2 style={{ marginBottom: "10px" }}>❌ Paiement échoué</h2>

        <p style={modalText}>{message}</p>

        <button style={primaryBtn} onClick={onClose}>
          Réessayer
        </button>

        <button style={secondaryBtn} onClick={onClose}>
          Continuer mes achats
        </button>
      </div>
    </div>
  );
}

/* =========================
   TYPES
========================= */
type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
  imageUrl?: string;
};

/* =========================
   UTILS
========================= */
function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

/* =========================
   PAGE
========================= */
export default function CheckoutPage() {
  const { cart } = useCart();

  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setMounted(true);

    const params = new URLSearchParams(window.location.search);

    if (params.get("error")) {
      setErrorMessage("Le paiement a été annulé ou refusé.");
      setErrorOpen(true);
    }
  }, []);

  if (!mounted) return null;

  /* =========================
     CALCULS
  ========================= */
  const subtotal = cart.reduce(
    (acc: number, item: CartItem) =>
      acc + item.priceCents * item.quantity,
    0
  );

  const freeShippingThreshold = 5000;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 490;
  const total = subtotal + shippingCost;

  /* =========================
     CHECKOUT
  ========================= */
  const handleCheckout = async () => {
    if (!cart.length) {
      setErrorMessage("Votre panier est vide");
      setErrorOpen(true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart,
          shippingCost,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur paiement");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Erreur Stripe");
      }
    } catch (error: any) {
      console.error(error);

      setErrorMessage(
        error?.message ||
          "Une erreur est survenue lors du paiement."
      );
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     EMPTY STATE
  ========================= */
  if (cart.length === 0) {
    return (
      <div style={page}>
        <div style={container}>
          <h1 style={title}>Votre panier est vide</h1>
          <p style={{ textAlign: "center" }}>
            Ajoutez des produits avant de passer au paiement.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ErrorModal
        open={errorOpen}
        message={errorMessage}
        onClose={() => setErrorOpen(false)}
      />

      <div style={page}>
        <div style={container}>
          <h1 style={title}>
            Finalisation de votre commande
          </h1>

          <div style={grid}>
            
            {/* PRODUITS */}
            <div>
              <div style={card}>
                <h2>Votre sélection</h2>

                {cart.map((item: CartItem) => (
                  <div key={item.id} style={itemRow}>
                    <img
                      src={
                        item.imageUrl ||
                        "/images/product-vanille.jpg"
                      }
                      alt={item.name}
                      style={image}
                    />

                    <div>
                      <p style={name}>{item.name}</p>
                      <p style={qty}>
                        Quantité : {item.quantity}
                      </p>
                      <p style={price}>
                        {formatPrice(
                          item.priceCents * item.quantity
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RÉSUMÉ + CROSS SELL */}
            <div>
              <div style={summary}>
                <h2>Résumé</h2>

                <PriceRow
                  label="Sous-total"
                  value={formatPrice(subtotal)}
                />

                <PriceRow
                  label="Livraison"
                  value={
                    shippingCost === 0
                      ? "Offerte"
                      : formatPrice(shippingCost)
                  }
                />

                <hr />

                <PriceRow
                  label="Total"
                  value={formatPrice(total)}
                  bold
                />

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  style={{
                    ...cta,
                    background: loading ? "#999" : "#a16207",
                  }}
                >
                  {loading
                    ? "Redirection..."
                    : "Payer en sécurité 🔒"}
                </button>
              </div>

              {/* 🔥 CROSS SELL */}
              <CrossSell />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================
   COMPONENTS
========================= */
function PriceRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div style={row}>
      <span>{label}</span>
      <span style={{ fontWeight: bold ? 700 : 400 }}>
        {value}
      </span>
    </div>
  );
}

/* =========================
   STYLE
========================= */

const page = {
  background: "#faf7f2",
  minHeight: "100vh",
  overflowX: "hidden" as const,
};

const container = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "30px 20px",
};

const title = {
  textAlign: "center" as const,
  marginBottom: "30px",
  fontSize: "28px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 400px",
  gap: "40px",
};

/* 🔥 responsive inline safe */
if (typeof window !== "undefined" && window.innerWidth < 768) {
  (grid as any).display = "block";
}

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
};

const summary = {
  ...card,
  position: "sticky" as const,
  top: "20px",
};

const itemRow = {
  display: "flex",
  gap: "15px",
  marginBottom: "15px",
};

const image = {
  width: "80px",
  height: "80px",
  borderRadius: "10px",
  objectFit: "cover" as const,
};

const name = {
  fontWeight: 600,
};

const qty = {
  color: "#666",
  fontSize: "14px",
};

const price = {
  color: "#a16207",
  fontWeight: 600,
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  margin: "10px 0",
};

const cta = {
  marginTop: "20px",
  width: "100%",
  padding: "16px",
  borderRadius: "12px",
  color: "white",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
};

/* MODAL */

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modal = {
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  width: "90%",
  maxWidth: "350px",
  textAlign: "center" as const,
};

const modalText = {
  fontSize: "14px",
  color: "#666",
  marginBottom: "20px",
};

const primaryBtn = {
  width: "100%",
  padding: "12px",
  background: "#a16207",
  color: "white",
  borderRadius: "10px",
  border: "none",
  marginBottom: "10px",
};

const secondaryBtn = {
  width: "100%",
  padding: "10px",
  background: "#f3f4f6",
  borderRadius: "10px",
  border: "none",
};