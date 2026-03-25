"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { CSSProperties } from "react";

export default function HomePage() {
  return (
    <div style={{ background: "#faf7f2" }}>
      
      {/* HERO */}
      <section style={{ height: "90vh", position: "relative" }}>
        <motion.img
          src="/images/hero-vanille.jpg"
          alt="Vanille Madagascar"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          style={heroImg}
        />

        {/* overlay */}
        <div style={overlay} />

        {/* CONTENT */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={heroContent}
        >
          <div style={heroBox}>
            <h1 style={heroTitle}>Vanille’Or</h1>

            <p style={heroSubtitle}>
              L’excellence de la vanille de Madagascar
            </p>

            <Link href="/products" style={ctaPrimary}>
              Découvrir nos produits
            </Link>
          </div>
        </motion.div>
      </section>

      {/* UNIVERS */}
      <section style={section}>
        <h2 style={sectionTitle}>Nos univers</h2>

        <div style={grid}>
          {/* VANILLE */}
          <Link href="/collections/vanille" style={linkReset}>
            <motion.div whileHover={{ scale: 1.03 }} style={card}>
              <img src="/images/vanille.jpg" alt="Vanille" style={img} />
              <h3>🌿 Vanille</h3>
              <p>Gousses, poudre, caviar</p>
            </motion.div>
          </Link>

          {/* EPICES */}
          <Link href="/collections/epices" style={linkReset}>
            <motion.div whileHover={{ scale: 1.03 }} style={card}>
              <img src="/images/epices.jpg" alt="Epices" style={img} />
              <h3>🌶️ Épices</h3>
              <p>Cannelle, cacao, poivre, girofle</p>
            </motion.div>
          </Link>
        </div>
      </section>

      {/* B2B */}
      <section style={{ ...section, background: "white" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <h2>Offre professionnelle</h2>

          <p style={textMuted}>
            Besoin de grandes quantités ? Nous proposons des offres adaptées aux professionnels.
          </p>

          <Link href="/b2b" style={ctaPrimary}>
            Demander un devis
          </Link>
        </div>
      </section>

      {/* STORY */}
      <section style={section}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h2>Notre engagement</h2>

          <p style={textMuted}>
            Chez Vanille’Or, nous travaillons directement avec des producteurs à Madagascar
            pour garantir une qualité exceptionnelle et une traçabilité complète.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={footer}>
        © {new Date().getFullYear()} Vanille’Or — Développé par{" "}
        <span style={{ fontWeight: 600 }}>AKM.Consulting</span>
      </footer>
    </div>
  );
}

/* ========================= */
/* 🎨 STYLES */
/* ========================= */

const heroImg: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  filter: "brightness(0.6)",
};

const overlay: CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))",
};

const heroContent: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0 20px",
  zIndex: 2,
};

const heroBox: CSSProperties = {
  textAlign: "center",
  color: "white",
  maxWidth: "700px",
};

const heroTitle: CSSProperties = {
  fontSize: "52px",
  marginBottom: "20px",
  letterSpacing: "1px",
};

const heroSubtitle: CSSProperties = {
  fontSize: "18px",
  marginBottom: "30px",
  opacity: 0.9,
};

const section: CSSProperties = {
  padding: "70px 20px",
  maxWidth: "1100px",
  margin: "0 auto",
};

const sectionTitle: CSSProperties = {
  textAlign: "center",
  marginBottom: "40px",
};

const grid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "20px",
};

const card: CSSProperties = {
  background: "white",
  borderRadius: "16px",
  overflow: "hidden",
  padding: "15px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  cursor: "pointer",
};

const img: CSSProperties = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderRadius: "12px",
  marginBottom: "10px",
};

const ctaPrimary: CSSProperties = {
  background: "#a16207",
  color: "white",
  padding: "16px 28px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: "600",
  display: "inline-block",
};

const textMuted: CSSProperties = {
  marginTop: "10px",
  color: "#666",
};

const footer: CSSProperties = {
  textAlign: "center",
  padding: "30px",
  fontSize: "13px",
  color: "#777",
};

const linkReset: CSSProperties = {
  textDecoration: "none",
  color: "inherit",
};