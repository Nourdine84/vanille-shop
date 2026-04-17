"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "@/lib/cart-context";
import { useUIStore } from "@/components/ui-providers";

function getLogo() {
  return "/images/logo-vanilleor.png";
}

export default function SuccessPage() {
  const { clearCart } = useCart();
  const { resetUI } = useUIStore();

  // 🔥 GUARD ANTI BOUCLE
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    // ✅ reset data UNE FOIS
    clearCart();

    // ✅ reset UI UNE FOIS
    resetUI();

    // ✅ sécurité DOM
    if (typeof window !== "undefined") {
      document.body.style.overflow = "auto";
      document.body.style.pointerEvents = "auto";
    }

    window.scrollTo({ top: 0 });

  }, []); // 🔥 IMPORTANT → ARRAY VIDE

  return (
    <div style={page}>
      <section style={hero}>
        <div style={overlay} />

        <div style={content}>
          <img
            src={getLogo()}
            alt="VanilleOr"
            style={logo}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/images/default.jpg";
            }}
          />

          <h1 style={title}>Commande validée 🎉</h1>

          <p style={text}>
            Merci pour votre confiance. Votre commande a été confirmée avec succès.
          </p>

          <p style={subText}>
            Vous recevrez un email de confirmation dans quelques instants.
          </p>

          <div style={actions}>
            <Link href="/products" style={btnPrimary}>
              Continuer mes achats
            </Link>

            <Link href="/" style={btnGhost}>
              Retour accueil
            </Link>
          </div>

          <div style={trust}>
            <p>✔ Paiement sécurisé Stripe</p>
            <p>✔ Expédition rapide depuis la France</p>
            <p>✔ Qualité premium Madagascar</p>
          </div>

          <p style={signature}>
            Développé par <strong>Akm.Consulting</strong>
          </p>
        </div>
      </section>
    </div>
  );
}

/* ================= STYLES ================= */

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "#000",
};

const hero: React.CSSProperties = {
  position: "relative",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundImage: "url('/images/hero-vanille.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const overlay: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(180deg, rgba(0,0,0,0.7), rgba(0,0,0,0.85))",
};

const content: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  textAlign: "center",
  color: "white",
  maxWidth: "600px",
  padding: "20px",
};

const logo: React.CSSProperties = {
  width: "180px",
  marginBottom: "25px",
};

const title: React.CSSProperties = {
  fontSize: "34px",
  fontWeight: 800,
  marginBottom: "15px",
};

const text: React.CSSProperties = {
  fontSize: "16px",
  marginBottom: "10px",
  color: "#ddd",
};

const subText: React.CSSProperties = {
  fontSize: "14px",
  color: "#bbb",
  marginBottom: "25px",
};

const actions: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  flexWrap: "wrap",
};

const btnPrimary: React.CSSProperties = {
  background: "linear-gradient(135deg,#b7791f,#8b5e14)",
  color: "white",
  padding: "14px 22px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: 700,
};

const btnGhost: React.CSSProperties = {
  background: "rgba(255,255,255,0.1)",
  color: "white",
  padding: "14px 22px",
  borderRadius: "12px",
  textDecoration: "none",
  border: "1px solid rgba(255,255,255,0.2)",
};

const trust: React.CSSProperties = {
  marginTop: "30px",
  fontSize: "13px",
  color: "#ccc",
};

const signature: React.CSSProperties = {
  marginTop: "30px",
  fontSize: "12px",
  color: "#888",
};