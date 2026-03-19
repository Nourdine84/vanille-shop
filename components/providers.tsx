
"use client";

import { CartProvider } from "../lib/cart-store";
import { ToastProvider } from "./ui/toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </ToastProvider>
  );
}