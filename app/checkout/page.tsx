"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
   HELPERS
========================= */

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

function getSafeImage(image?: string) {
  if (!image) return "/images/default.jpg";

  if (image.startsWith("http")) return image;

  if (image.startsWith("/")) return image;

  return `/images/${image}`;
}

/* =========================
   UI COMPONENTS
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
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div style={row}>
      <span style={{ color: "#5b5b5b" }}>{label}</span>
      <span style={{ fontWeight: bold ? 700 : 500 }}>{value}</span>
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
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("error")) {
        setErrorMessage("Le paiement a été annulé ou refusé.");
        setErrorOpen(true);
      }
    }
  }, []);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (acc: number, item: CartItem) =>
        acc + item.priceCents * item.quantity,
      0
    );
  }, [cart]);

  const shippingCost = subtotal >= 5000 ? 0 : 490;
  const total = subtotal + shippingCost;

  /* =========================
     CHECKOUT
  ========================= */

  const handleCheckout = async () => {
    if (loading) return;

    if (!cart.length) {
      setErrorMessage("Votre panier est vide.");
      setErrorOpen(true);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: cart, // ✅ FIX CRITIQUE
        }),
      });

      const data: CheckoutApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur paiement");
      }

      if (!data.url) {
        throw new Error("Lien Stripe invalide");
      }

      window.location.href = data.url;

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

  if (!cart.length) {
    return (
      <>
        <ErrorModal
          open={errorOpen}
          message={errorMessage}
          onClose={() => setErrorOpen(false)}
        />

        <div style={page}>
          <h1>Votre panier est vide</h1>
          <Link href="/products">Voir les produits</Link>
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
        <h1>Finaliser votre commande</h1>

        {/* LISTE PRODUITS */}
        {cart.map((item: CartItem) => (
          <div key={item.id} style={itemRow}>
            <img
              src={getSafeImage(item.imageUrl)}
              alt={item.name}
              style={image}
            />

            <div>
              <p>{item.name}</p>
              <p>Quantité : {item.quantity}</p>
              <p>{formatPrice(item.priceCents)}</p>
            </div>
          </div>
        ))}

        {/* TOTAL */}
        <div style={{ marginTop: 20 }}>
          <PriceRow label="Sous-total" value={formatPrice(subtotal)} />
          <PriceRow
            label="Livraison"
            value={shippingCost === 0 ? "Offerte" : formatPrice(shippingCost)}
          />
          <PriceRow label="Total" value={formatPrice(total)} bold />
        </div>

        {/* CTA */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          style={cta}
        >
          {loading ? "Redirection..." : "Payer 🔒"}
        </button>

        <CrossSell />
      </div>
    </>
  );
}

/* =========================
   STYLES
========================= */

const page = {
  padding: 30,
};

const itemRow = {
  display: "flex",
  gap: 10,
  marginBottom: 15,
};

const image = {
  width: 80,
  height: 80,
  objectFit: "cover" as const,
};

const cta = {
  marginTop: 20,
  padding: 15,
  background: "#a16207",
  color: "white",
  border: "none",
  borderRadius: 10,
  cursor: "pointer",
};

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modal = {
  background: "white",
  padding: 20,
  borderRadius: 12,
};

const modalIcon = { fontSize: 30 };
const modalTitle = { marginBottom: 10 };
const modalText = { marginBottom: 15 };

const primaryBtn = {
  background: "#a16207",
  color: "white",
  padding: 10,
  borderRadius: 8,
  border: "none",
};

const secondaryBtn = {
  background: "#eee",
  padding: 10,
  borderRadius: 8,
  border: "none",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
};