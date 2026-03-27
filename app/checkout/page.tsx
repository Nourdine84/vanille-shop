"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";

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

        <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
          {message}
        </p>

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

type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
  imageUrl?: string;
};

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function CheckoutPage() {
  const { cart } = useCart();

  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setMounted(true);

    // ✅ GESTION RETOUR STRIPE
    const params = new URLSearchParams(window.location.search);

    if (params.get("error")) {
      setErrorMessage("Le paiement a été annulé ou refusé.");
      setErrorOpen(true);
    }
  }, []);

  if (!mounted) return null;

  const subtotal = cart.reduce(
    (acc: number, item: CartItem) =>
      acc + item.priceCents * item.quantity,
    0
  );

  const freeShippingThreshold = 5000;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 490;
  const total = subtotal + shippingCost;

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

      if (!res.ok) {
        throw new Error("Erreur serveur");
      }

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Erreur de redirection Stripe");
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

  return (
    <>
      <ErrorModal
        open={errorOpen}
        message={errorMessage}
        onClose={() => setErrorOpen(false)}
      />

      <div style={{ background: "#faf7f2", minHeight: "100vh" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 20px" }}>
          <h1 style={{ textAlign: "center", marginBottom: "40px", fontSize: "32px" }}>
            Finalisation de votre commande
          </h1>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "40px" }}>
            
            {/* GAUCHE */}
            <div>
              <div style={cardStyle}>
                <h2>Votre sélection</h2>

                {cart.map((item: CartItem) => (
                  <div key={item.id} style={itemRowStyle}>
                    <img
                      src={item.imageUrl || "/images/product-vanille.jpg"}
                      alt={item.name}
                      style={itemImageStyle}
                    />

                    <div>
                      <p style={{ fontWeight: 600 }}>{item.name}</p>
                      <p style={{ color: "#666" }}>
                        Quantité : {item.quantity}
                      </p>
                      <p style={{ color: "#a16207", fontWeight: 600 }}>
                        {formatPrice(item.priceCents * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DROITE */}
            <div>
              <div style={{ ...cardStyle, position: "sticky", top: "20px" }}>
                <h2>Résumé</h2>

                <PriceRow label="Sous-total" value={formatPrice(subtotal)} />
                <PriceRow
                  label="Livraison"
                  value={shippingCost === 0 ? "Offerte" : formatPrice(shippingCost)}
                />

                <hr />

                <PriceRow label="Total" value={formatPrice(total)} bold />

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  style={{
                    ...checkoutButtonStyle,
                    background: loading ? "#999" : "#a16207",
                  }}
                >
                  {loading ? "Redirection..." : "Payer en sécurité 🔒"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* =========================
   UI
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
    <div style={{ display: "flex", justifyContent: "space-between", margin: "10px 0" }}>
      <span>{label}</span>
      <span style={{ fontWeight: bold ? 700 : 400 }}>{value}</span>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "16px",
};

const itemRowStyle = {
  display: "flex",
  gap: "15px",
  marginBottom: "15px",
};

const itemImageStyle = {
  width: "80px",
  height: "80px",
  borderRadius: "10px",
};

const checkoutButtonStyle = {
  marginTop: "20px",
  width: "100%",
  padding: "16px",
  borderRadius: "12px",
  color: "white",
  border: "none",
};

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modal = {
  background: "white",
  padding: "30px",
  borderRadius: "16px",
  width: "320px",
  textAlign: "center" as const,
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