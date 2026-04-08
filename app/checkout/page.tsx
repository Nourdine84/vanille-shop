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

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function CheckoutPage() {
  const { cart } = useCart();

  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + item.priceCents * item.quantity,
      0
    );
  }, [cart]);

  const freeShippingThreshold = 5000;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 490;
  const total = subtotal + shippingCost;

  const remaining = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckout = async () => {
    if (!cart.length) return;

    try {
      setLoading(true);

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Erreur paiement");
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div style={page}>
      {/* HERO */}
      <section style={hero}>
        <div style={heroOverlay} />

        <div style={heroContent}>
          <p style={heroTag}>VanilleOr</p>

          <h1 style={heroTitle}>
            Finalisez votre commande en toute sérénité
          </h1>

          <p style={heroSub}>
            Paiement sécurisé • Livraison rapide • Qualité premium
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <div style={container}>
        <div style={grid}>
          
          {/* LEFT */}
          <div>
            <div style={card}>
              <h2 style={sectionTitle}>Votre panier</h2>

              {cart.map((item) => (
                <div key={item.id} style={itemRow}>
                  <img
                    src={item.imageUrl || "/images/default.jpg"}
                    style={image}
                  />

                  <div style={{ flex: 1 }}>
                    <p style={name}>{item.name}</p>
                    <p style={meta}>Quantité : {item.quantity}</p>
                  </div>

                  <p style={price}>
                    {formatPrice(item.priceCents * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* TRUST */}
            <div style={trust}>
              <p>✔ Paiement sécurisé Stripe</p>
              <p>✔ Produits premium Madagascar</p>
              <p>✔ Expédition rapide & suivie</p>
            </div>

            <CrossSell />
          </div>

          {/* RIGHT */}
          <div style={summary}>
            <h2 style={sectionTitle}>Résumé</h2>

            {/* 🔥 LIVRAISON PREMIUM */}
            {remaining > 0 ? (
              <div style={shippingBox}>
                Ajoutez encore{" "}
                <strong>{formatPrice(remaining)}</strong> pour bénéficier de la{" "}
                <strong>livraison offerte</strong>
              </div>
            ) : (
              <div style={shippingFree}>
                Livraison offerte appliquée 🎉
              </div>
            )}

            <div style={row}>
              <span>Sous-total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div style={row}>
              <span>Livraison</span>
              <span>
                {shippingCost === 0
                  ? "Offerte"
                  : formatPrice(shippingCost)}
              </span>
            </div>

            <hr />

            <div style={totalRow}>
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <button
              onClick={handleCheckout}
              style={{
                ...cta,
                opacity: loading ? 0.7 : 1,
              }}
              disabled={loading}
            >
              {loading ? "Redirection..." : "Payer maintenant 🔒"}
            </button>

            <p style={secure}>
              Paiement sécurisé via Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLE ================= */

const page = {
  background: "#f8f5ef",
  minHeight: "100vh",
};

/* HERO */

const hero = {
  position: "relative" as const,
  height: "280px",
  backgroundImage: "url('/images/hero-vanille.jpg')",
  backgroundSize: "cover",
};

const heroOverlay = {
  position: "absolute" as const,
  inset: 0,
  background: "rgba(0,0,0,0.6)",
};

const heroContent = {
  position: "relative" as const,
  zIndex: 2,
  textAlign: "center" as const,
  color: "white",
  paddingTop: "70px",
};

const heroTag = {
  color: "#d4af37",
  fontSize: "26px",
  fontWeight: 900,
  letterSpacing: "0.3em",
};

const heroTitle = {
  fontSize: "28px",
  marginTop: "10px",
};

const heroSub = {
  color: "#ddd",
};

/* LAYOUT */

const container = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "30px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "30px",
};

/* CARD */

const card = {
  background: "white",
  borderRadius: "16px",
  padding: "20px",
};

const itemRow = {
  display: "flex",
  gap: "15px",
  marginBottom: "15px",
  alignItems: "center",
};

const image = {
  width: "70px",
  height: "70px",
  borderRadius: "10px",
  objectFit: "cover" as const,
};

const name = { fontWeight: 700 };

const meta = {
  fontSize: "13px",
  color: "#666",
};

const price = { fontWeight: 700 };

/* TRUST */

const trust = {
  marginTop: "20px",
  background: "#fff7ed",
  padding: "15px",
  borderRadius: "12px",
};

/* SUMMARY */

const summary = {
  background: "white",
  borderRadius: "16px",
  padding: "20px",
  position: "sticky" as const,
  top: "20px",
};

const sectionTitle = {
  fontSize: "20px",
  marginBottom: "15px",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
};

const totalRow = {
  display: "flex",
  justifyContent: "space-between",
  fontWeight: 800,
  fontSize: "18px",
};

/* SHIPPING UX */

const shippingBox = {
  background: "#fff4df",
  padding: "12px",
  borderRadius: "12px",
  marginBottom: "15px",
  fontSize: "14px",
};

const shippingFree = {
  background: "#ecfdf5",
  padding: "12px",
  borderRadius: "12px",
  marginBottom: "15px",
  color: "#065f46",
  fontWeight: 600,
};

/* CTA */

const cta = {
  marginTop: "20px",
  width: "100%",
  padding: "14px",
  background: "linear-gradient(135deg,#b7791f,#8b5e14)",
  color: "white",
  borderRadius: "12px",
  border: "none",
  fontWeight: 800,
  cursor: "pointer",
};

const secure = {
  textAlign: "center" as const,
  marginTop: "10px",
  fontSize: "12px",
  color: "#777",
};