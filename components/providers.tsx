"use client";

import { ReactNode } from "react";
import { CartProvider } from "@/lib/cart-store";
import { UIProvider } from "@/lib/ui-store";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UIProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </UIProvider>
  );
}