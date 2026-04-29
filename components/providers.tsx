"use client";

import { UIProvider } from "./ui-providers";
import { CartProvider } from "@/lib/cart-context";
import { ToastProvider } from "@/components/ui/toast";

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <UIProvider>
      <CartProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </CartProvider>
    </UIProvider>
  );
}