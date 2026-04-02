"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { useSearchParams } from "next/navigation";

type StoredCartItem = {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
};

export default function SuccessPage() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();

  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;

    const sessionId =
      searchParams.get("session_id") || Date.now().toString();

    let total = 0;
    let items: Array<{
      item_id: string;
      item_name: string;
      price: number;
      quantity: number;
    }> = [];

    try {
      const stored = localStorage.getItem("cart");

      if (stored) {
        const cart: StoredCartItem[] = JSON.parse(stored);

        total = cart.reduce(
          (acc, item) => acc + item.priceCents * item.quantity,
          0
        );

        items = cart.map((item) => ({
          item_id: item.id,
          item_name: item.name,
          price: item.priceCents / 100,
          quantity: item.quantity,
        }));
      }
    } catch (e) {
      console.error("❌ Cart parse error:", e);
    }

    /* 🔥 TRACKING GOOGLE */
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "purchase", {
        transaction_id: sessionId,
        currency: "EUR",
        value: total / 100,
        items,
      });
    }

    /* 🔥 CLEAR CART */
    setTimeout(() => {
      clearCart();
      localStorage.removeItem("cart");
    }, 0);
  }, [clearCart, searchParams]);

  return (
    <div style={page}>
      <div style={wrapper}>
        {/* ICON */}
        <div style={icon}>🎉</div>

        {/* TITLE */}
        <h1 style={title}>Paiement confirmé</h1>

        <p style={subtitle}>
          Merci pour votre commande chez <strong>Vanille’Or</strong>
        </p>

        <p style={subtext}>
          Votre colis est en cours de préparation.
        </p>

        {/* STATUS BOX */}
        <div style={statusBox}>
          <h3 style={{ marginBottom: 10 }}>
            Suivi de votre commande
          </h3>

          <p style={statusText}>
            📦 Préparation en cours <br />
            🚚 Expédition sous 24-48h <br />
            📧 Email de confirmation envoyé
          </p>
        </div>

        {/* TRUST */}
        <div style={trust}>
          ✔ Paiement sécurisé validé <br />
          ✔ Produits premium sélectionnés <br />
          ✔ Origine Madagascar garantie
        </div>

        {/* ACTIONS */}
        <div style={actions}>
          <Link href="/products" style={btnPrimary}>
            Continuer mes achats
          </Link>

          <Link href="/" style={btnSecondary}>
            Retour à l’accueil
          </Link>
        </div>

        {/* BRAND STORY */}
        <div style={footer}>
          Chez Vanille’Or, chaque produit est sélectionné avec exigence
          pour offrir une qualité exceptionnelle aux passionnés et professionnels.
        </div>
      </div>
    </div>
  );
}

/* ================= STYLE ================= */

const page = {
  background: "#faf7f2",
  minHeight: "100vh",
};

const wrapper = {
  maxWidth: "900px",
  margin: "0 auto",
  padding: "80px 20px",
  textAlign: "center" as const,
};

const icon = {
  fontSize: "60px",
  marginBottom: "10px",
};

const title = {
  fontSize: "32px",
  marginBottom: "10px",
};

const subtitle = {
  color: "#666",
  fontSize: "16px",
};

const subtext = {
  marginTop: "8px",
  color: "#666",
};

const statusBox = {
  marginTop: "40px",
  background: "white",
  padding: "30px",
  borderRadius: "16px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
};

const statusText = {
  marginTop: "10px",
  color: "#666",
  lineHeight: 1.6,
};

const trust = {
  marginTop: "30px",
  color: "#666",
  fontSize: "14px",
};

const actions = {
  marginTop: "40px",
  display: "flex",
  flexDirection: "column" as const,
  gap: "10px",
};

const btnPrimary = {
  background: "#a16207",
  color: "white",
  padding: "14px 24px",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: "600",
};

const btnSecondary = {
  color: "#a16207",
  textDecoration: "none",
  fontWeight: "600",
};

const footer = {
  marginTop: "60px",
  fontSize: "14px",
  color: "#888",
  maxWidth: "600px",
  marginInline: "auto",
};