"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-store";

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    let total = 0;
    let items: any[] = [];

    const stored = localStorage.getItem("cart");

    if (stored) {
      const cart = JSON.parse(stored);

      total = cart.reduce(
        (acc: number, item: any) =>
          acc + item.priceCents * item.quantity,
        0
      );

      items = cart.map((item: any) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.priceCents / 100,
        quantity: item.quantity,
      }));
    }

    // 🔥 TRACKING
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "purchase", {
        currency: "EUR",
        value: total / 100,
        items,
      });
    }

    // 🔥 FIX CRITIQUE → async pour éviter freeze UI
    setTimeout(() => {
      clearCart();
    }, 0);

  }, [clearCart]);

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
        <div style={{ fontSize: "60px", marginBottom: "10px" }}>
          🎉
        </div>

        <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
          Paiement confirmé
        </h1>

        <p style={{ color: "#666", fontSize: "16px" }}>
          Merci pour votre commande chez Vanille’Or
        </p>

        <p style={{ marginTop: "8px", color: "#666" }}>
          Votre colis est en cours de préparation.
        </p>

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

        <div style={{ marginTop: "30px", color: "#666", fontSize: "14px" }}>
          ✔ Paiement sécurisé validé <br />
          ✔ Produits premium sélectionnés <br />
          ✔ Origine Madagascar garantie
        </div>

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