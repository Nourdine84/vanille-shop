"use client";

import Link from "next/link";

function getLogo() {
  return "/images/logo-vanilleor.png";
}

export default function SuccessPage() {
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
            Merci pour votre confiance. Votre commande a été confirmée avec
            succès.
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

const page = {
  minHeight: "100vh",
  background: "#000",
};

const hero = {
  position: "relative" as const,
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundImage: "url('/images/hero-vanille.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const overlay = {
  position: "absolute" as const,
  inset: 0,
  background: "linear-gradient(180deg, rgba(0,0,0,0.7), rgba(0,0,0,0.85))",
};

const content = {
  position: "relative" as const,
  zIndex: 2,
  textAlign: "center" as const,
  color: "white",
  maxWidth: "600px",
  padding: "20px",
};

const logo = {
  width: "180px",
  marginBottom: "25px",
  objectFit: "contain" as const,
};

const title = {
  fontSize: "34px",
  fontWeight: 800,
  marginBottom: "15px",
};

const text = {
  fontSize: "16px",
  marginBottom: "10px",
  color: "#ddd",
};

const subText = {
  fontSize: "14px",
  color: "#bbb",
  marginBottom: "25px",
};

const actions = {
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  flexWrap: "wrap" as const,
};

const btnPrimary = {
  background: "linear-gradient(135deg,#b7791f,#8b5e14)",
  color: "white",
  padding: "14px 22px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: 700,
};

const btnGhost = {
  background: "rgba(255,255,255,0.1)",
  backdropFilter: "blur(10px)",
  color: "white",
  padding: "14px 22px",
  borderRadius: "12px",
  textDecoration: "none",
  border: "1px solid rgba(255,255,255,0.2)",
};

const trust = {
  marginTop: "30px",
  fontSize: "13px",
  color: "#ccc",
  lineHeight: 1.6,
};

const signature = {
  marginTop: "30px",
  fontSize: "12px",
  color: "#888",
};