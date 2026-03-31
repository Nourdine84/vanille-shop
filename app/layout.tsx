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

          {/* MINI CART (sécurisé côté client) */}
          <MiniCart />

          {/* CONTENT */}
          <main style={main}>{children}</main>

          {/* FOOTER */}
          <footer style={footer}>
            <div style={footerContainer}>
              {/* BRAND */}
              <div>
                <h3 style={footerTitle}>Vanille’Or</h3>
                <p style={footerText}>
                  Vanille premium de Madagascar <br />
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
   STYLES
========================= */

const bodyStyle: React.CSSProperties = {
  margin: 0,
  background: "#f8f5ef",
  fontFamily: "system-ui, sans-serif",
};

const main: React.CSSProperties = {
  minHeight: "80vh",
};

/* FOOTER */

const footer: React.CSSProperties = {
  background: "#111",
  color: "#fff",
  padding: "50px 20px 20px",
};

const footerContainer: React.CSSProperties = {
  maxWidth: "1100px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "30px",
};

const footerTitle: React.CSSProperties = {
  fontSize: "20px",
  marginBottom: "10px",
  color: "#a16207",
};

const footerSubtitle: React.CSSProperties = {
  fontSize: "14px",
  marginBottom: "10px",
  color: "#ddd",
};

const footerText: React.CSSProperties = {
  fontSize: "13px",
  color: "#aaa",
  lineHeight: "1.6",
};

const footerLink: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  color: "#ccc",
  textDecoration: "none",
  marginBottom: "6px",
};

const footerBottom: React.CSSProperties = {
  marginTop: "30px",
  paddingTop: "15px",
  borderTop: "1px solid #222",
  textAlign: "center",
  fontSize: "12px",
  color: "#777",
};