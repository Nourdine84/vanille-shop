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
  const [redirectTimer, setRedirectTimer] = useState(5);

  useEffect(() => {
    setTimeout(() => setVisible(true), 200);

    clearCart();
    localStorage.removeItem("cart");

    const interval = setInterval(() => {
      setRedirectTimer((prev) => {
        if (prev <= 1) {
          window.location.href = "/products";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [clearCart]);

  return (
    <div style={container}>
      <div
        style={{
          ...card,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0px)" : "translateY(20px)",
        }}
      >
        {/* LOGO */}
        <div style={logoWrapper}>
          <Image
            src="/logo.png"
            alt="Vanille’Or"
            width={150}
            height={60}
            priority
          />
        </div>

        {/* ICON */}
        <div style={icon}>🎉</div>

        <h1 style={title}>Commande validée</h1>

        <p style={subtitle}>
          Merci pour votre confiance chez{" "}
          <strong style={{ color: "#a16207" }}>Vanille’Or</strong>
        </p>

        {sessionId && (
          <p style={orderId}>
            Référence : {sessionId.slice(0, 12)}
          </p>
        )}

        {/* TIMELINE */}
        <div style={timeline}>
          <Step text="Paiement confirmé" active />
          <Step text="Préparation" />
          <Step text="Expédition" />
          <Step text="Livraison" />
        </div>

        {/* INFO */}
        <div style={infoBox}>
          <p>📦 Préparation en cours</p>
          <p>🚚 Expédition sous 24-48h</p>
          <p>📧 Email envoyé avec les détails</p>
        </div>

        {/* CTA */}
        <div style={actions}>
          <Link href="/products" style={primaryBtn}>
            Continuer mes achats
          </Link>

          <Link href="/b2b" style={secondaryBtn}>
            Offre professionnelle
          </Link>
        </div>

        <p style={redirectText}>
          Redirection automatique dans {redirectTimer}s
        </p>
      </div>
    </div>
  );
}

function Step({ text, active = false }: { text: string; active?: boolean }) {
  return (
    <div style={step}>
      <div
        style={{
          ...dot,
          background: active ? "#16a34a" : "#ddd",
        }}
      />
      <span style={{ color: active ? "#111" : "#999" }}>{text}</span>
    </div>
  );
}

/* STYLES */

const container = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f8f5ef",
  padding: "20px",
};

const card = {
  background: "white",
  padding: "40px 30px",
  borderRadius: "22px",
  textAlign: "center" as const,
  maxWidth: "520px",
  width: "100%",
  boxShadow: "0 25px 60px rgba(0,0,0,0.08)",
  transition: "all 0.4s ease",
};

const logoWrapper = { marginBottom: "20px" };
const icon = { fontSize: "44px", marginBottom: "15px" };
const title = { fontSize: "30px", marginBottom: "10px" };
const subtitle = { color: "#666", marginBottom: "10px" };
const orderId = { fontSize: "12px", color: "#999" };

const timeline = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "25px",
  marginBottom: "25px",
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

const infoBox = {
  background: "#faf7f2",
  padding: "18px",
  borderRadius: "14px",
  marginBottom: "20px",
};

const actions = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "10px",
};

const primaryBtn = {
  padding: "14px",
  background: "#a16207",
  color: "white",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: 600,
};

const secondaryBtn = {
  padding: "12px",
  background: "#f3f4f6",
  borderRadius: "12px",
  textDecoration: "none",
  color: "#111",
};

const redirectText = {
  marginTop: "15px",
  fontSize: "12px",
  color: "#999",
};
