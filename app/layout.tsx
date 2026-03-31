import "./globals.css";
import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import Header from "@/components/header";
import Providers from "@/components/providers";
import MiniCart from "@/components/mini-cart";

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
      <body style={bodyStyle}>
        <Providers>
          {/* HEADER */}
          <Header />

          {/* MINI CART */}
          <MiniCart />

          {/* CONTENT */}
          <main style={main}>{children}</main>

          {/* FOOTER PREMIUM */}
          <footer style={footer}>
            <div style={footerContainer}>
              
              {/* BRAND */}
              <div style={footerCol}>
                <h3 style={footerTitle}>Vanille’Or</h3>
                <p style={footerText}>
                  Vanille premium de Madagascar <br />
                  Qualité professionnelle accessible
                </p>
              </div>

              {/* NAV */}
              <div style={footerCol}>
                <h4 style={footerSubtitle}>Navigation</h4>
                <FooterLink href="/products" label="Produits" />
                <FooterLink href="/collections/vanille" label="Vanille" />
                <FooterLink href="/collections/epices" label="Épices" />
                <FooterLink href="/b2b" label="Professionnels" />
              </div>

              {/* SUPPORT */}
              <div style={footerCol}>
                <h4 style={footerSubtitle}>Support</h4>
                <FooterLink href="/reclamation" label="Réclamation / SAV" />
                <FooterLink href="/contact" label="Contact" />
                <FooterLink href="/about" label="À propos" />
              </div>
            </div>

            {/* BOTTOM */}
            <div style={footerBottom}>
              © {new Date().getFullYear()} Vanille’Or — Tous droits réservés
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}

/* =========================
   COMPONENT
========================= */
function FooterLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link href={href} style={footerLink}>
      {label}
    </Link>
  );
}

/* =========================
   STYLE
========================= */

const bodyStyle = {
  margin: 0,
  background: "#f8f5ef",
  fontFamily: "system-ui, sans-serif",
};

const main = {
  minHeight: "80vh",
};

/* FOOTER */

const footer = {
  background: "#111",
  color: "#fff",
  padding: "50px 20px 20px",
};

const footerContainer = {
  maxWidth: "1100px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "30px",
};

const footerCol = {};

const footerTitle = {
  fontSize: "20px",
  marginBottom: "10px",
  color: "#a16207",
};

const footerSubtitle = {
  fontSize: "14px",
  marginBottom: "10px",
  color: "#ddd",
};

const footerText = {
  fontSize: "13px",
  color: "#aaa",
  lineHeight: "1.6",
};

const footerLink = {
  display: "block",
  fontSize: "13px",
  color: "#ccc",
  textDecoration: "none",
  marginBottom: "6px",
};

const footerBottom = {
  marginTop: "30px",
  paddingTop: "15px",
  borderTop: "1px solid #222",
  textAlign: "center" as const,
  fontSize: "12px",
  color: "#777",
};