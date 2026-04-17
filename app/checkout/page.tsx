"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/cart-context";
import CrossSell from "@/components/cross-sell";

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

      if (!res.ok) throw new Error(data.error || "Erreur checkout");

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

      <div style={container}>
        <div style={grid}>
          <div>
            <div style={card}>
              <h2 style={sectionTitle}>Votre panier</h2>

              {cart.length === 0 ? (
                <p style={meta}>Votre panier est vide.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} style={itemRow}>
                    <img
                      src={item.imageUrl || "/images/default.jpg"}
                      alt={item.name}
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
                ))
              )}
            </div>

            <div style={trust}>
              <p>✔ Paiement sécurisé Stripe</p>
              <p>✔ Produits premium Madagascar</p>
              <p>✔ Expédition rapide & suivie</p>
            </div>

            <CrossSell />
          </div>

          <div style={summary}>
            <h2 style={sectionTitle}>Résumé</h2>

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
                {shippingCost === 0 ? "Offerte" : formatPrice(shippingCost)}
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
              disabled={loading || cart.length === 0}
            >
              {loading ? "Redirection..." : "Payer maintenant 🔒"}
            </button>

            <p style={secure}>Paiement sécurisé via Stripe</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const page: React.CSSProperties = {
  background: "#f8f5ef",
  minHeight: "100vh",
};

const hero: React.CSSProperties = {
  position: "relative",
  height: "280px",
  backgroundImage: "url('/images/hero-vanille.jpg')",
  backgroundSize: "cover",
};

const heroOverlay: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
};

const heroContent: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  textAlign: "center",
  color: "white",
  paddingTop: "70px",
};

const heroTag: React.CSSProperties = {
  color: "#d4af37",
  fontSize: "26px",
  fontWeight: 900,
  letterSpacing: "0.3em",
};

const heroTitle: React.CSSProperties = {
  fontSize: "28px",
  marginTop: "10px",
};

const heroSub: React.CSSProperties = {
  color: "#ddd",
};

const container: React.CSSProperties = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "30px",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "30px",
};

const card: React.CSSProperties = {
  background: "white",
  borderRadius: "16px",
  padding: "20px",
};

const itemRow: React.CSSProperties = {
  display: "flex",
  gap: "15px",
  marginBottom: "15px",
  alignItems: "center",
};

const image: React.CSSProperties = {
  width: "70px",
  height: "70px",
  borderRadius: "10px",
  objectFit: "cover",
};

const name: React.CSSProperties = {
  fontWeight: 700,
};

const meta: React.CSSProperties = {
  fontSize: "13px",
  color: "#666",
};

const price: React.CSSProperties = {
  fontWeight: 700,
};

const trust: React.CSSProperties = {
  marginTop: "20px",
  background: "#fff7ed",
  padding: "15px",
  borderRadius: "12px",
};

const summary: React.CSSProperties = {
  background: "white",
  borderRadius: "16px",
  padding: "20px",
  position: "sticky",
  top: "20px",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "20px",
  marginBottom: "15px",
};

const row: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
};

const totalRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontWeight: 800,
  fontSize: "18px",
};

const shippingBox: React.CSSProperties = {
  background: "#fff4df",
  padding: "12px",
  borderRadius: "12px",
  marginBottom: "15px",
  fontSize: "14px",
};

const shippingFree: React.CSSProperties = {
  background: "#ecfdf5",
  padding: "12px",
  borderRadius: "12px",
  marginBottom: "15px",
  color: "#065f46",
  fontWeight: 600,
};

const cta: React.CSSProperties = {
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

const secure: React.CSSProperties = {
  textAlign: "center",
  marginTop: "10px",
  fontSize: "12px",
  color: "#777",
};