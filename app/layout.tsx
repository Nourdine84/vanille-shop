import "./globals.css";
import type { Metadata } from "next";
import React from "react";

import Header from "@/components/header";
import Footer from "@/components/Footer";
import Providers from "@/components/providers";
import MiniCart from "@/components/mini-cart";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

import "react-quill/dist/quill.snow.css";

const DEFAULT_TITLE = "Vanille’Or — Vanille premium de Madagascar";
const OG_IMAGE = "/images/logo-vanilleor.png";

export const metadata: Metadata = {
  // Résout les URLs relatives (OG, canonical de chaque page) en absolu.
  metadataBase: new URL(SITE_URL),

  title: DEFAULT_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,

  keywords: [
    "vanille de Madagascar",
    "vanille premium",
    "gousse de vanille",
    "caviar de vanille",
    "poudre de vanille",
    "extrait de vanille",
    "épices premium",
    "Vanille’Or",
  ],

  authors: [{ name: SITE_NAME }],

  // Pas de canonical global ici : chaque page définit le sien. Un canonical
  // "/" au niveau racine ferait pointer toutes les pages vers l'accueil.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: OG_IMAGE,
    shortcut: OG_IMAGE,
    apple: OG_IMAGE,
  },

  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "fr_FR",
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      { url: OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
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