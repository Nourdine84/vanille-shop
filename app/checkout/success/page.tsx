"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";

export default function SuccessPage() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  const { clearCart } = useCart();

  /* =========================
     🔥 CLEAR CART (CRITIQUE)
  ========================= */
  useEffect(() => {
    console.log("🧹 CLEAR CART AFTER PAYMENT");

    clearCart();

    // sécurité : vider localStorage direct
    localStorage.removeItem("cart");
  }, []);

  return (
    <div style={container}>
      
      <div style={card}>
        
        {/* ICON */}
        <div style={icon}>✅</div>

        <h1 style={title}>Commande confirmée</h1>

        <p style={subtitle}>
          Merci pour votre achat chez <strong>Vanille’Or</strong>.
        </p>

        {sessionId && (
          <p style={orderId}>
            Référence : {sessionId.slice(0, 12)}
          </p>
        )}

        <div style={infoBox}>
          <p>📦 Préparation en cours</p>
          <p>🚚 Expédition sous 24-48h</p>
          <p>📧 Email de confirmation envoyé</p>
        </div>

        <div style={actions}>
          <Link href="/products" style={primaryBtn}>
            Continuer mes achats
          </Link>

          <Link href="/b2b" style={secondaryBtn}>
            Offre professionnelle
          </Link>
        </div>
      </div>
    </div>
  );
}

/* STYLE */

const container = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f8f5ef",
};

const card = {
  background: "white",
  padding: "40px",
  borderRadius: "20px",
  textAlign: "center" as const,
  maxWidth: "500px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
};

const icon = {
  fontSize: "50px",
  marginBottom: "20px",
};

const title = {
  fontSize: "28px",
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

const infoBox = {
  marginTop: "20px",
  marginBottom: "20px",
  color: "#444",
  lineHeight: "1.8",
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
  borderRadius: "10px",
  textDecoration: "none",
};

const secondaryBtn = {
  padding: "12px",
  background: "#f3f4f6",
  borderRadius: "10px",
  textDecoration: "none",
  color: "#111",
};