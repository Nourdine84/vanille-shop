import "./globals.css";
import type { Metadata } from "next";
import React from "react";
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

          {/* MINI CART 🔥 */}
          <MiniCart />

          {/* CONTENU */}
          <main style={main}>
            {children}
          </main>

          {/* FOOTER */}
          <footer style={footer}>
            © {new Date().getFullYear()} Vanille’Or
          </footer>
        </Providers>

      </body>
    </html>
  );
}

/* STYLE */

const bodyStyle = {
  margin: 0,
  background: "#f8f5ef",
  fontFamily: "system-ui, sans-serif",
};

const main = {
  minHeight: "80vh",
};

const footer = {
  textAlign: "center" as const,
  padding: "30px",
  fontSize: "13px",
  color: "#777",
};