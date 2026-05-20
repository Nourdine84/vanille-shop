"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/lib/cart-context";

/* =========================
   PAGE
========================= */

export default function CancelPage() {
  const { cart } = useCart();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
      });
    }
  }, []);

  return (
    <div style={page}>
      <section style={hero}>
        <div style={overlay} />

        <div style={content}>
          {/* LOGO */}

          <img
            src="/images/logo-vanilleor.png"
            alt="VanilleOr"
            style={logo}
          />

          {/* TITLE */}

          <p style={tag}>
            Paiement interrompu
          </p>

          <h1 style={title}>
            Votre commande n’a pas été finalisée
          </h1>

          <p style={subtitle}>
            Aucun paiement n’a été débité.
            Votre panier est toujours disponible.
          </p>

          {/* BOX */}

          <div style={box}>
            <p style={boxText}>
              Vous pouvez reprendre votre commande
              à tout moment en toute sécurité.
            </p>

            <div style={trust}>
              <p>
                ✔ Paiement sécurisé Stripe
              </p>

              <p>
                ✔ Livraison rapide & suivie
              </p>

              <p>
                ✔ Produits premium Madagascar
              </p>
            </div>
          </div>

          {/* CTA */}

          <div style={actions}>
            <Link
              href="/checkout"
              style={primaryBtn}
            >
              Reprendre le paiement
            </Link>

            <Link
              href="/products"
              style={secondaryBtn}
            >
              Continuer mes achats
            </Link>
          </div>

          {/* CART INFO */}

          {cart.length > 0 && (
            <p style={cartInfo}>
              Votre panier contient encore{" "}
              <strong>
                {cart.length}
              </strong>{" "}
              article
              {cart.length > 1 ? "s" : ""}.
            </p>
          )}

          {/* SUPPORT */}

          <div style={supportBox}>
            <p style={supportText}>
              Une question concernant votre commande ?
            </p>

            <Link
              href="/support"
              style={supportBtn}
            >
              Contacter le support
            </Link>
          </div>

          {/* SIGNATURE */}

          <p style={signature}>
            VanilleOr — L’excellence de la vanille et des épices premium
          </p>
        </div>
      </section>
    </div>
  );
}

/* =========================
   STYLES
========================= */

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
  backgroundImage:
    "url('/images/hero-vanille.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const overlay: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(180deg, rgba(0,0,0,0.75), rgba(0,0,0,0.9))",
};

const content: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  textAlign: "center",
  color: "white",
  maxWidth: "700px",
  padding: "20px",
};

const logo: React.CSSProperties = {
  width: "180px",
  marginBottom: "30px",
};

const tag: React.CSSProperties = {
  color: "#d4af37",
  fontSize: "13px",
  fontWeight: 800,
  letterSpacing: "0.25em",
  textTransform: "uppercase",
  marginBottom: "14px",
};

const title: React.CSSProperties = {
  fontSize: "42px",
  fontWeight: 900,
  lineHeight: 1.2,
  marginBottom: "18px",
};

const subtitle: React.CSSProperties = {
  color: "#d6d6d6",
  fontSize: "16px",
  lineHeight: 1.7,
  marginBottom: "30px",
};

const box: React.CSSProperties = {
  background:
    "rgba(255,255,255,0.08)",

  border:
    "1px solid rgba(255,255,255,0.12)",

  borderRadius: "22px",

  padding: "24px",

  backdropFilter: "blur(10px)",

  marginBottom: "30px",
};

const boxText: React.CSSProperties = {
  fontSize: "15px",
  color: "#f1f1f1",
  lineHeight: 1.7,
};

const trust: React.CSSProperties = {
  marginTop: "20px",
  color: "#d1d1d1",
  fontSize: "14px",
  lineHeight: 1.9,
};

const actions: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "14px",
  flexWrap: "wrap",
};

const primaryBtn: React.CSSProperties = {
  background:
    "linear-gradient(135deg,#b7791f,#8b5e14)",

  color: "white",

  padding: "15px 24px",

  borderRadius: "14px",

  textDecoration: "none",

  fontWeight: 800,
};

const secondaryBtn: React.CSSProperties = {
  background:
    "rgba(255,255,255,0.1)",

  color: "white",

  padding: "15px 24px",

  borderRadius: "14px",

  textDecoration: "none",

  border:
    "1px solid rgba(255,255,255,0.16)",

  fontWeight: 700,
};

const cartInfo: React.CSSProperties = {
  marginTop: "28px",
  color: "#d4af37",
  fontSize: "14px",
};

const supportBox: React.CSSProperties = {
  marginTop: "34px",
};

const supportText: React.CSSProperties = {
  color: "#bdbdbd",
  marginBottom: "14px",
};

const supportBtn: React.CSSProperties = {
  display: "inline-block",
  background: "#111",
  color: "white",
  padding: "12px 20px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: 700,
};

const signature: React.CSSProperties = {
  marginTop: "40px",
  color: "#888",
  fontSize: "12px",
};