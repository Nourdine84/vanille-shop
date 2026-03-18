"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "../../lib/cart-store";

export default function SuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="container py-16">
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          textAlign: "center",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "32px",
        }}
      >
        <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "16px" }}>
          Paiement réussi
        </h1>

        <p style={{ color: "#4b5563", marginBottom: "24px" }}>
          Merci pour votre commande. Votre panier a bien été vidé.
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link href="/" className="btn-secondary">
            Retour accueil
          </Link>

          <Link href="/products" className="btn-primary">
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  );
}