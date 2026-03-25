import "./globals.css";
import HeaderWrapper from "@/components/header-wrapper";
import { ToastProvider } from "@/components/ui/toast";
import { UIProvider } from "@/components/ui-provider";
import Analytics from "@/app/analytics";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Vanille’Or",
  description: "Vanille premium de Madagascar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <UIProvider>
          <ToastProvider>
            <HeaderWrapper />
            {children}
          </ToastProvider>
        </UIProvider>

        <Analytics />
      </body>
    </html>
  );
}