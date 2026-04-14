"use client";

import { UIProvider } from "./ui-providers";
import { CartProvider } from "@/lib/cart-context";

export default function Providers({ children }: any) {
  return (
    <UIProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </UIProvider>
  );
}