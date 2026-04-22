import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import Header from "@/components/header";
import Providers from "@/components/providers";
import MiniCart from "@/components/mini-cart";
import "react-quill/dist/quill.snow.css";

export const metadata: Metadata = {
  title: "Vanille’Or - Vanille premium de Madagascar",
  description:
    "Vanille de Madagascar haut de gamme pour particuliers et professionnels.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body suppressHydrationWarning style={bodyStyle}>
        <Providers>
          {/* HEADER */}
          <Header />

          {/* MINI CART */}
          <div id="cart-root">
            <MiniCart />
          </div>

          {/* CONTENU */}
          <main style={main}>
            {children}
          </main>

          {/* FOOTER PREMIUM */}
          <footer style={footer}>
            <div style={footerContainer}>
              {/* BRAND */}
              <div>
                <h3 style={footerTitle}>Vanille’Or</h3>
                <p style={footerText}>
                  L’excellence de Madagascar <br />
                  Vanille & épices premium <br />
                  Qualité professionnelle accessible
                </p>
              </div>

              {/* NAV */}
              <div>
                <h4 style={footerSubtitle}>Navigation</h4>
                <FooterLink href="/products" label="Produits" />
                <FooterLink href="/collections/vanille" label="Vanille" />
                <FooterLink href="/collections/epices" label="Épices" />
                <FooterLink href="/b2b" label="Professionnels" />
              </div>

              {/* SUPPORT */}
              <div>
                <h4 style={footerSubtitle}>Support</h4>
                <FooterLink href="/reclamation" label="Réclamation / SAV" />
                <FooterLink href="/contact" label="Contact" />
                <FooterLink href="/about" label="À propos" />
              </div>
            </div>

            {/* FOOTER BOTTOM */}
            <div style={footerBottom}>
              <div style={footerLine} />
              <p style={footerBottomText}>
                © {new Date().getFullYear()} Vanille’Or — Tous droits réservés
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}

/* ================= COMPONENT ================= */

function FooterLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link href={href} className="footer-link" style={footerLink}>
      {label}
    </Link>
  );
}

/* ================= STYLES ================= */

const bodyStyle: React.CSSProperties = {
  margin: 0,
  background: "#f8f5ef",
  fontFamily: "system-ui, -apple-system, sans-serif",
};

const container: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  width: "100%", // 🔥 FIX stabilité responsive (important)
};

const main: React.CSSProperties = {
  minHeight: "80vh",
  padding: 0,
};

/* ================= FOOTER ================= */

const footer: React.CSSProperties = {
  background: "#0f0f0f",
  color: "#fff",
  padding: "60px 20px 25px",
  marginTop: "60px",
};

const footerContainer: React.CSSProperties = {
  maxWidth: "1100px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "40px",
};

const footerTitle: React.CSSProperties = {
  fontSize: "22px",
  marginBottom: "12px",
  color: "#d4af37",
  fontWeight: 800,
};

const footerSubtitle: React.CSSProperties = {
  fontSize: "14px",
  marginBottom: "12px",
  color: "#bbb",
  fontWeight: 700,
};

const footerText: React.CSSProperties = {
  fontSize: "13px",
  color: "#999",
  lineHeight: "1.7",
};

const footerLink: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  color: "#ccc",
  textDecoration: "none",
  marginBottom: "8px",
};

/* ================= BOTTOM ================= */

const footerBottom: React.CSSProperties = {
  marginTop: "40px",
  textAlign: "center",
};

const footerLine: React.CSSProperties = {
  width: "100%",
  height: "1px",
  background: "#222",
  marginBottom: "15px",
};

const footerBottomText: React.CSSProperties = {
  fontSize: "12px",
  color: "#666",
};