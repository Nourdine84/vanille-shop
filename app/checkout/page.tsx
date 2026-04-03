
"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/cart-store";
import CrossSell from "@/components/cross-sell";

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

type CheckoutApiResponse = {
  url?: string;
  error?: string;
};

/* =========================
   UTILS
========================= */

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

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
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={modalTitle}>❌ Paiement échoué</h2>

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
      <span style={{ fontWeight: bold ? 700 : 400 }}>{value}</span>
    </div>
  );
}

/* =========================
   PAGE
========================= */

export default function CheckoutPage() {
  const { cart } = useCart();

  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
      }
    };

    checkMobile();

    if (typeof window !== "undefined") {
      window.addEventListener("resize", checkMobile);

      const params = new URLSearchParams(window.location.search);

      if (params.get("error")) {
        setErrorMessage("Le paiement a été annulé ou refusé.");
        setErrorOpen(true);
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", checkMobile);
      }
    };
  }, []);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (acc: number, item: CartItem) => acc + item.priceCents * item.quantity,
      0
    );
  }, [cart]);

  const freeShippingThreshold = 5000;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 490;
  const total = subtotal + shippingCost;

  const handleCheckout = async () => {
    if (loading) return;

    if (!cart.length) {
      setErrorMessage("Votre panier est vide.");
      setErrorOpen(true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart,
          shippingCost,
        }),
      });

      let data: CheckoutApiResponse = {};

      try {
        data = await res.json();
      } catch {
        throw new Error("Réponse serveur invalide.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la création du paiement.");
      }

      if (!data.url) {
        throw new Error("Lien de paiement introuvable.");
      }

      if (typeof window !== "undefined") {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error("❌ CHECKOUT ERROR:", error);

      setErrorMessage(
        error?.message || "Une erreur est survenue lors du paiement."
      );
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (cart.length === 0) {
    return (
      <>
        <ErrorModal
          open={errorOpen}
          message={errorMessage}
          onClose={() => setErrorOpen(false)}
        />

        <div style={page}>
          <div style={container}>
            <h1 style={title}>Votre panier est vide</h1>

            <p style={emptyText}>
              Ajoutez des produits avant de passer au paiement.
            </p>
          </div>
        </div>
      </>
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
          <h1 style={title}>Finalisation de votre commande</h1>

          <div
            style={{
              ...grid,
              gridTemplateColumns: isMobile ? "1fr" : "1fr 400px",
              gap: isMobile ? "20px" : "40px",
            }}
          >
            {/* PRODUITS */}
            <div>
              <div style={card}>
                <h2 style={sectionTitle}>Votre sélection</h2>

                {cart.map((item: CartItem) => (
                  <div
                    key={item.id}
                    style={{
                      ...itemRow,
                      alignItems: isMobile ? "flex-start" : "center",
                    }}
                  >
                    <img
                      src={item.imageUrl || "/images/product-vanille.jpg"}
                      alt={item.name}
                      style={{
                        ...image,
                        width: isMobile ? "72px" : "80px",
                        height: isMobile ? "72px" : "80px",
                      }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={name}>{item.name}</p>
                      <p style={qty}>Quantité : {item.quantity}</p>
                      <p style={price}>
                        {formatPrice(item.priceCents * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RÉSUMÉ */}
            <div>
              <div
                style={{
                  ...summary,
                  position: isMobile ? "relative" : "sticky",
                  top: isMobile ? 0 : "20px",
                }}
              >
                <h2 style={sectionTitle}>Résumé</h2>

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

                <hr style={divider} />

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
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.85 : 1,
                  }}
                >
                  {loading ? "Redirection..." : "Payer en sécurité 🔒"}
                </button>

                <p style={secureText}>Paiement sécurisé via Stripe</p>
              </div>

              <div style={{ marginTop: "20px" }}>
                <CrossSell />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================
   STYLES
========================= */

const page = {
  background: "#faf7f2",
  minHeight: "100vh",
  overflowX: "hidden" as const,
};

const container = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "30px 16px 40px",
};

const title = {
  textAlign: "center" as const,
  marginBottom: "30px",
  fontSize: "28px",
  color: "#111",
};

const emptyText = {
  textAlign: "center" as const,
  color: "#666",
  marginTop: "8px",
};

const grid = {
  display: "grid",
  gap: "40px",
  alignItems: "start",
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
};

const summary = {
  ...card,
};

const sectionTitle = {
  marginTop: 0,
  marginBottom: "18px",
  fontSize: "22px",
  color: "#111",
};

const itemRow = {
  display: "flex",
  gap: "15px",
  marginBottom: "15px",
};

const image = {
  borderRadius: "10px",
  objectFit: "cover" as const,
  flexShrink: 0,
};

const name = {
  fontWeight: 600,
  margin: 0,
  color: "#111",
  lineHeight: 1.4,
};

const qty = {
  color: "#666",
  fontSize: "14px",
  margin: "6px 0",
};

const price = {
  color: "#a16207",
  fontWeight: 600,
  margin: 0,
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  margin: "10px 0",
  color: "#222",
};

const divider = {
  border: "none",
  borderTop: "1px solid #eee",
  margin: "16px 0",
};

const cta = {
  marginTop: "20px",
  width: "100%",
  padding: "16px",
  borderRadius: "12px",
  color: "white",
  border: "none",
  fontSize: "16px",
  fontWeight: 600,
};

const secureText = {
  marginTop: "12px",
  marginBottom: 0,
  textAlign: "center" as const,
  color: "#666",
  fontSize: "13px",
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
  padding: "16px",
};

const modal = {
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  width: "100%",
  maxWidth: "350px",
  textAlign: "center" as const,
  boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
};

const modalTitle = {
  marginBottom: "10px",
};

const modalText = {
  fontSize: "14px",
  color: "#666",
  marginBottom: "20px",
  lineHeight: 1.5,
};

const primaryBtn = {
  width: "100%",
  padding: "12px",
  background: "#a16207",
  color: "white",
  borderRadius: "10px",
  border: "none",
  marginBottom: "10px",
  cursor: "pointer",
  fontWeight: 600,
};

const secondaryBtn = {
  width: "100%",
  padding: "10px",
  background: "#f3f4f6",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  color: "#111",
};