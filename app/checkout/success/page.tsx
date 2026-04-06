"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";

export default function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  const { clearCart } = useCart();

  const [visible, setVisible] = useState(false);
  const [redirectTimer, setRedirectTimer] = useState(6);

  useEffect(() => {
    setTimeout(() => setVisible(true), 200);

    // 🔥 clear panier safe
    try {
      clearCart();
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart");
      }
    } catch (e) {
      console.warn("Cart cleanup error:", e);
    }

    // 🔥 auto redirect clean
    const interval = setInterval(() => {
      setRedirectTimer((prev) => {
        if (prev <= 1) {
          window.location.assign("/products");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={container}>
      <div
        style={{
          ...card,
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translateY(0px)"
            : "translateY(30px)",
        }}
      >
        {/* LOGO */}
        <div style={logoWrapper}>
          <Image
            src="/logo-vanilleor.png" // 🔥 FIX LOGO
            alt="Vanille’Or"
            width={150}
            height={60}
            priority
          />
        </div>

        {/* ICON */}
        <div style={iconWrap}>
          <div style={iconCircle}>✓</div>
        </div>

        <h1 style={title}>Commande confirmée</h1>

        <p style={subtitle}>
          Merci pour votre confiance chez{" "}
          <strong style={{ color: "#a16207" }}>
            Vanille’Or
          </strong>
        </p>

        {sessionId && (
          <p style={orderId}>
            Référence : {sessionId.slice(0, 12)}
          </p>
        )}

        {/* TIMELINE */}
        <div style={timeline}>
          <Step text="Paiement" active />
          <Step text="Préparation" />
          <Step text="Expédition" />
          <Step text="Livraison" />
        </div>

        {/* INFO PREMIUM */}
        <div style={infoBox}>
          <p>📦 Préparation en cours</p>
          <p>🚚 Expédition sous 24-48h</p>
          <p>📧 Confirmation envoyée par email</p>
        </div>

        {/* CTA */}
        <div style={actions}>
          <Link href="/products" style={primaryBtn}>
            Continuer mes achats
          </Link>

          <Link href="/b2b" style={secondaryBtn}>
            Accéder à l’offre pro
          </Link>
        </div>

        {/* REDIRECT */}
        <p style={redirectText}>
          Redirection automatique dans {redirectTimer}s
        </p>
      </div>
    </div>
  );
}

/* =========================
   STEP COMPONENT
========================= */

function Step({ text, active = false }: { text: string; active?: boolean }) {
  return (
    <div style={step}>
      <div
        style={{
          ...dot,
          background: active ? "#16a34a" : "#ddd",
        }}
      />
      <span
        style={{
          color: active ? "#111" : "#999",
          fontWeight: active ? 600 : 400,
        }}
      >
        {text}
      </span>
    </div>
  );
}

/* =========================
   STYLES PREMIUM
========================= */

const container = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(180deg,#f8f4ee,#fcfaf7)",
  padding: "20px",
};

const card = {
  background: "white",
  padding: "45px 30px",
  borderRadius: "26px",
  textAlign: "center" as const,
  maxWidth: "540px",
  width: "100%",
  boxShadow: "0 30px 70px rgba(0,0,0,0.08)",
  transition: "all 0.4s ease",
};

const logoWrapper = {
  marginBottom: "25px",
};

const iconWrap = {
  display: "flex",
  justifyContent: "center",
  marginBottom: "15px",
};

const iconCircle = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "#16a34a",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "28px",
  fontWeight: 700,
};

const title = {
  fontSize: "32px",
  marginBottom: "10px",
};

const subtitle = {
  color: "#666",
  marginBottom: "10px",
};

const orderId = {
  fontSize: "12px",
  color: "#999",
};

/* TIMELINE */

const timeline = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "30px",
  marginBottom: "30px",
};

const step = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  gap: "6px",
  fontSize: "12px",
};

const dot = {
  width: "10px",
  height: "10px",
  borderRadius: "50%",
};

/* INFO */

const infoBox = {
  background: "#faf7f2",
  padding: "18px",
  borderRadius: "16px",
  marginBottom: "22px",
  border: "1px solid #eee",
};

/* CTA */

const actions = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "10px",
};

const primaryBtn = {
  padding: "15px",
  background: "linear-gradient(135deg,#a16207,#7c4a03)",
  color: "white",
  borderRadius: "14px",
  textDecoration: "none",
  fontWeight: 700,
};

const secondaryBtn = {
  padding: "13px",
  background: "#f3f4f6",
  borderRadius: "14px",
  textDecoration: "none",
  color: "#111",
};

/* REDIRECT */

const redirectText = {
  marginTop: "15px",
  fontSize: "12px",
  color: "#999",
};