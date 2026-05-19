import "./globals.css";
import type { Metadata } from "next";
import React from "react";

import Header from "@/components/header";
import Footer from "@/components/Footer";
import Providers from "@/components/providers";
import MiniCart from "@/components/mini-cart";

import "react-quill/dist/quill.snow.css";

export const metadata: Metadata = {
  title: "Vanille’Or - Vanille premium de Madagascar",
  description:
    "Vanille premium de Madagascar pour particuliers et professionnels.",
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
          <MiniCart />

          {/* MAIN */}
          <main style={main}>
            {children}
          </main>

          {/* FOOTER */}
          <Footer />

        </Providers>
      </body>
    </html>
  );
}

/* =========================
   STYLES
========================= */

const bodyStyle: React.CSSProperties = {
  margin: 0,
  background: "#f8f5ef",
  fontFamily: "system-ui, -apple-system, sans-serif",
  overflowX: "hidden",
};

const main: React.CSSProperties = {
  minHeight: "80vh",
};