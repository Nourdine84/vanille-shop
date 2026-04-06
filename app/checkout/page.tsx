"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import CrossSell from "@/components/cross-sell";

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

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

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
        <div style={modalIcon}>❌</div>
        <h2 style={modalTitle}>Paiement impossible</h2>
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

function PriceRow({
  label,
  value,
  bold = false,
  valueColor,
}: {
  label: string;
  value: string;
  bold?: boolean;
  valueColor?: string;
}) {
  return (
    <div style={row}>
      <span style={{ color: "#5b5b5b" }}>{label}</span>
      <span
        style={{
          fontWeight: bold ? 700 : 500,
          color: valueColor || "#111",
        }}
      >
        {value}
      </span>
    </div>
  );
}

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
        setIsMobile(window.innerWidth < 900);
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
      (acc: number, item: CartItem) =>
        acc + item.priceCents * item.quantity,
      0
    );
  }, [cart]);

  const freeShippingThreshold = 5000;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 490;
  const total = subtotal + shippingCost;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckout = async () => {
    if (loading) return;

    if (!cart.length) {
      setErrorMessage("Votre panier est vide.");
      setErrorOpen(true);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
        }),
      });

      const data: CheckoutApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la création du paiement.");
      }

      if (!data.url) {
        throw new Error("Lien de paiement introuvable.");
      }

      window.location.assign(data.url);
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
          <div style={heroBand}>
            <div style={heroInner}>
              <p style={heroKicker}>VanilleOr</p>
              <h1 style={heroTitle}>Votre panier est vide</h1>
              <p style={heroSubtitle}>
                Ajoutez des produits premium avant de passer au paiement.
              </p>
            </div>
          </div>

          <div style={container}>
            <div style={emptyCard}>
              <p style={emptyText}>
                Découvrez nos vanilles, épices et sélections signature.
              </p>

              <div style={emptyActions}>
                <Link href="/products" style={catalogBtn}>
                  Voir le catalogue
                </Link>
                <Link href="/" style={ghostBtn}>
                  Retour à l’accueil
                </Link>
              </div>
            </div>
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
        <div style={heroBand}>
          <div style={heroInner}>
            <p style={heroKicker}>Finalisation</p>
            <h1 style={heroTitle}>Un dernier pas avant votre commande</h1>
            <p style={heroSubtitle}>
              Paiement sécurisé, sélection premium, expérience simple et rapide.
            </p>
          </div>
        </div>

        <div style={container}>
          <div
            style={{
              ...grid,
              gridTemplateColumns: isMobile ? "1fr" : "minmax(0, 1fr) 390px",
            }}
          >
            <div style={leftCol}>
              <div style={card}>
                <div style={sectionHeader}>
                  <div>
                    <p style={sectionEyebrow}>Votre sélection</p>
                    <h2 style={sectionTitle}>Produits de votre panier</h2>
                  </div>

                  <Link href="/cart" style={sectionLink}>
                    Modifier le panier
                  </Link>
                </div>

                <div style={itemsList}>
                  {cart.map((item: CartItem) => (
                    <div key={item.id} style={itemRow}>
                      <div style={imageWrap}>
                        <img
                          src={item.imageUrl || "/products/default.jpg"}
                          alt={item.name}
                          style={image}
                        />
                      </div>

                      <div style={itemContent}>
                        <div style={itemTop}>
                          <p style={name}>{item.name}</p>
                          <p style={itemTotal}>
                            {formatPrice(item.priceCents * item.quantity)}
                          </p>
                        </div>

                        <div style={itemMeta}>
                          <span>Quantité : {item.quantity}</span>
                          <span>
                            Prix unitaire : {formatPrice(item.priceCents)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={trustCard}>
                <div style={trustItem}>✔ Paiement sécurisé via Stripe</div>
                <div style={trustItem}>✔ Produits soigneusement sélectionnés</div>
                <div style={trustItem}>✔ Expédition rapide et suivi clair</div>
              </div>

              <div style={{ marginTop: 24 }}>
                <CrossSell />
              </div>
            </div>

            <div style={rightCol}>
              <div style={summaryCard}>
                <p style={summaryEyebrow}>Résumé</p>
                <h2 style={summaryTitle}>Votre commande</h2>

                {remainingForFreeShipping > 0 ? (
                  <div style={shippingInfoBox}>
                    Ajoutez encore{" "}
                    <strong>{formatPrice(remainingForFreeShipping)}</strong> pour
                    profiter de la livraison offerte.
                  </div>
                ) : (
                  <div style={shippingFreeBox}>
                    Livraison offerte appliquée à votre commande.
                  </div>
                )}

                <div style={summaryRows}>
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
                    valueColor={shippingCost === 0 ? "#15803d" : undefined}
                  />
                </div>

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
                    background: loading
                      ? "linear-gradient(135deg, #9ca3af, #6b7280)"
                      : "linear-gradient(135deg, #b7791f, #8b5e14)",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.9 : 1,
                  }}
                >
                  {loading ? "Redirection vers Stripe..." : "Payer en sécurité 🔒"}
                </button>

                <p style={secureText}>
                  En cliquant, vous serez redirigé vers Stripe pour finaliser le
                  paiement en toute sécurité.
                </p>

                <div style={paymentLogos}>
                  <span style={paymentChip}>Stripe</span>
                  <span style={paymentChip}>Visa</span>
                  <span style={paymentChip}>Mastercard</span>
                  <span style={paymentChip}>CB</span>
                </div>
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
  background: "linear-gradient(180deg, #f8f4ee 0%, #fcfaf7 100%)",
  minHeight: "100vh",
};

const heroBand = {
  background: "linear-gradient(135deg, #111111 0%, #2a2117 100%)",
  color: "white",
  padding: "56px 20px 42px",
};

const heroInner = {
  maxWidth: "1100px",
  margin: "0 auto",
};

const heroKicker = {
  margin: 0,
  color: "#f4d7a1",
  fontSize: "13px",
  letterSpacing: "0.18em",
  textTransform: "uppercase" as const,
};

const heroTitle = {
  margin: "12px 0 10px",
  fontSize: "clamp(30px, 5vw, 50px)",
  lineHeight: 1.08,
  fontWeight: 800,
};

const heroSubtitle = {
  margin: 0,
  maxWidth: "700px",
  color: "rgba(255,255,255,0.78)",
  fontSize: "16px",
  lineHeight: 1.7,
};

const container = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "28px 16px 48px",
};

const grid = {
  display: "grid",
  gap: "28px",
  alignItems: "start",
};

const leftCol = {};
const rightCol = {};

const card = {
  background: "rgba(255,255,255,0.96)",
  borderRadius: "22px",
  padding: "24px",
  boxShadow: "0 18px 40px rgba(20,20,20,0.06)",
  border: "1px solid rgba(180,140,80,0.12)",
};

const sectionHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  marginBottom: "18px",
  flexWrap: "wrap" as const,
};

const sectionEyebrow = {
  margin: 0,
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.14em",
  color: "#b7791f",
  fontWeight: 700,
};

const sectionTitle = {
  margin: "6px 0 0",
  fontSize: "24px",
  color: "#111",
};

const sectionLink = {
  textDecoration: "none",
  color: "#8b5e14",
  fontWeight: 700,
  fontSize: "14px",
};

const itemsList = {
  display: "grid",
  gap: "16px",
};

const itemRow = {
  display: "grid",
  gridTemplateColumns: "92px minmax(0, 1fr)",
  gap: "16px",
  alignItems: "center",
  padding: "14px",
  background: "#fcfaf7",
  borderRadius: "18px",
  border: "1px solid #efe5d6",
};

const imageWrap = {
  width: "92px",
  height: "92px",
  borderRadius: "16px",
  overflow: "hidden" as const,
  background: "white",
  border: "1px solid #eee4d4",
};

const image = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
  display: "block",
};

const itemContent = {
  minWidth: 0,
};

const itemTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "16px",
  marginBottom: "8px",
  flexWrap: "wrap" as const,
};

const name = {
  margin: 0,
  color: "#111",
  fontWeight: 700,
  lineHeight: 1.4,
};

const itemTotal = {
  margin: 0,
  color: "#8b5e14",
  fontWeight: 800,
  whiteSpace: "nowrap" as const,
};

const itemMeta = {
  display: "flex",
  gap: "14px",
  flexWrap: "wrap" as const,
  color: "#666",
  fontSize: "14px",
};

const trustCard = {
  marginTop: "20px",
  background: "linear-gradient(135deg, #fff8eb, #faf4e8)",
  borderRadius: "20px",
  padding: "18px 20px",
  border: "1px solid #eeddbb",
  display: "grid",
  gap: "10px",
};

const trustItem = {
  color: "#4b3a21",
  fontWeight: 500,
};

const summaryCard = {
  background: "linear-gradient(180deg, #ffffff 0%, #fffaf2 100%)",
  borderRadius: "24px",
  padding: "24px",
  boxShadow: "0 18px 40px rgba(20,20,20,0.07)",
  border: "1px solid rgba(180,140,80,0.16)",
  position: "sticky" as const,
  top: "20px",
};

const summaryEyebrow = {
  margin: 0,
  color: "#b7791f",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase" as const,
};

const summaryTitle = {
  margin: "8px 0 18px",
  fontSize: "28px",
  color: "#111",
};

const shippingInfoBox = {
  background: "#fff4df",
  color: "#7a5312",
  borderRadius: "16px",
  padding: "14px 16px",
  fontSize: "14px",
  lineHeight: 1.6,
  marginBottom: "18px",
  border: "1px solid #f1ddb0",
};

const shippingFreeBox = {
  background: "#edf9ef",
  color: "#166534",
  borderRadius: "16px",
  padding: "14px 16px",
  fontSize: "14px",
  lineHeight: 1.6,
  marginBottom: "18px",
  border: "1px solid #cfead4",
};

const summaryRows = {
  display: "grid",
  gap: "4px",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  margin: "10px 0",
};

const divider = {
  border: "none",
  borderTop: "1px solid #ece4d8",
  margin: "18px 0",
};

const cta = {
  marginTop: "20px",
  width: "100%",
  padding: "16px 18px",
  borderRadius: "16px",
  color: "white",
  border: "none",
  fontSize: "16px",
  fontWeight: 800,
  letterSpacing: "0.01em",
  boxShadow: "0 12px 24px rgba(139,94,20,0.18)",
};

const secureText = {
  marginTop: "14px",
  marginBottom: 0,
  textAlign: "center" as const,
  color: "#666",
  fontSize: "13px",
  lineHeight: 1.6,
};

const paymentLogos = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  flexWrap: "wrap" as const,
  marginTop: "18px",
};

const paymentChip = {
  background: "white",
  border: "1px solid #eadfce",
  borderRadius: "999px",
  padding: "8px 12px",
  fontSize: "12px",
  fontWeight: 700,
  color: "#57442a",
};

const emptyCard = {
  background: "rgba(255,255,255,0.96)",
  borderRadius: "24px",
  padding: "28px",
  marginTop: "20px",
  textAlign: "center" as const,
  boxShadow: "0 18px 40px rgba(20,20,20,0.06)",
};

const emptyText = {
  margin: 0,
  color: "#666",
  fontSize: "16px",
};

const emptyActions = {
  marginTop: "20px",
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  flexWrap: "wrap" as const,
};

const catalogBtn = {
  display: "inline-block",
  textDecoration: "none",
  background: "linear-gradient(135deg, #b7791f, #8b5e14)",
  color: "white",
  padding: "14px 18px",
  borderRadius: "14px",
  fontWeight: 800,
};

const ghostBtn = {
  display: "inline-block",
  textDecoration: "none",
  background: "white",
  color: "#111",
  padding: "14px 18px",
  borderRadius: "14px",
  fontWeight: 700,
  border: "1px solid #e8dfd2",
};

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.56)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
  padding: "16px",
};

const modal = {
  background: "white",
  padding: "26px",
  borderRadius: "22px",
  width: "100%",
  maxWidth: "380px",
  textAlign: "center" as const,
  boxShadow: "0 22px 50px rgba(0,0,0,0.18)",
};

const modalIcon = {
  fontSize: "30px",
  marginBottom: "8px",
};

const modalTitle = {
  margin: "0 0 10px",
  color: "#111",
};

const modalText = {
  fontSize: "14px",
  color: "#666",
  marginBottom: "20px",
  lineHeight: 1.6,
};

const primaryBtn = {
  width: "100%",
  padding: "12px",
  background: "linear-gradient(135deg, #b7791f, #8b5e14)",
  color: "white",
  borderRadius: "12px",
  border: "none",
  marginBottom: "10px",
  cursor: "pointer",
  fontWeight: 700,
};

const secondaryBtn = {
  width: "100%",
  padding: "11px",
  background: "#f5f5f5",
  borderRadius: "12px",
  border: "1px solid #e5e5e5",
  cursor: "pointer",
  color: "#111",
  fontWeight: 600,
};