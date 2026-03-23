"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function SuccessPage() {

  useEffect(() => {
    // 🔥 TRACKING PURCHASE
    if (typeof window !== "undefined") {
      (window as any).gtag?.("event", "purchase", {
        currency: "EUR",
        value: 0,
      });
    }

    // 🔥 VIDER PANIER (source unique)
    localStorage.removeItem("cart");

  }, []);

  return (
    <div style={{ background: "#faf7f2", minHeight: "100vh" }}>

      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "80px 20px",
          textAlign: "center",
        }}
      >

        {/* ICON */}
        <div style={{ fontSize: "60px", marginBottom: "10px" }}>
          🎉
        </div>

        {/* TITLE */}
        <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
          Paiement confirmé
        </h1>

        {/* SUBTEXT */}
        <p style={{ color: "#666", fontSize: "16px" }}>
          Merci pour votre commande chez Vanille’Or
        </p>

        <p style={{ marginTop: "8px", color: "#666" }}>
          Votre colis est en cours de préparation.
        </p>

        {/* CARD */}
        <div
          style={{
            marginTop: "40px",
            background: "white",
            padding: "30px",
            borderRadius: "16px",
            boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
          }}
        >
          <h3>Suivi de votre commande</h3>

          <p style={{ marginTop: "10px", color: "#666" }}>
            📦 Préparation en cours <br />
            🚚 Expédition sous 24-48h <br />
            📧 Email de confirmation envoyé
          </p>
        </div>

        {/* TRUST */}
        <div style={{ marginTop: "30px", color: "#666", fontSize: "14px" }}>
          ✔ Paiement sécurisé validé <br />
          ✔ Produits premium sélectionnés <br />
          ✔ Origine Madagascar garantie
        </div>

        {/* CTA */}
        <div style={{ marginTop: "40px" }}>
          <Link
            href="/products"
            style={{
              display: "inline-block",
              background: "#a16207",
              color: "white",
              padding: "14px 24px",
              borderRadius: "10px",
              textDecoration: "none",
              fontWeight: "600",
              marginBottom: "10px",
            }}
          >
            Continuer mes achats
          </Link>

          <br />

          <Link
            href="/"
            style={{
              display: "inline-block",
              marginTop: "10px",
              color: "#a16207",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Retour à l’accueil
          </Link>
        </div>

        {/* BRAND STORY */}
        <div
          style={{
            marginTop: "60px",
            fontSize: "14px",
            color: "#888",
            maxWidth: "600px",
            marginInline: "auto",
          }}
        >
          Chez Vanille’Or, chaque produit est sélectionné avec exigence pour offrir
          une qualité exceptionnelle aux passionnés et professionnels.
        </div>

      </div>
    </div>
  );
}