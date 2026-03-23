import "./globals.css";
import HeaderWrapper from "@/components/header-wrapper";
import { Providers } from "@/components/providers"; // ✅ FIX
import { ToastProvider } from "@/components/ui/toast";
import type { Metadata } from "next";
import React from "react"; // ✅ FIX TS

export const metadata: Metadata = {
  title: {
    default: "Vanille’Or | Vanille de Madagascar Premium",
    template: "%s | Vanille’Or",
  },
  description:
    "Découvrez une vanille de Madagascar premium, sélectionnée avec exigence pour les passionnés et professionnels.",
  keywords: [
    "vanille Madagascar",
    "gousse de vanille",
    "vanille premium",
    "acheter vanille",
    "vanille pâtisserie",
  ],
  openGraph: {
    title: "Vanille’Or | Vanille Premium",
    description:
      "Vanille de Madagascar haut de gamme pour particuliers et professionnels.",
    url: "https://vanille-shop.vercel.app",
    siteName: "Vanille’Or",
    images: [
      {
        url: "/images/vanille-hero.jpg",
        width: 1200,
        height: 630,
        alt: "Vanille de Madagascar premium",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <ToastProvider>
            <HeaderWrapper />
            {children}
          </ToastProvider>
        </Providers>
      </body>
    </html>
  );
}
