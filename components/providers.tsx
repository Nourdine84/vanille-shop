"use client";

import { UIProvider } from "./ui-providers";
import { CartProvider } from "@/lib/cart-context";

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <UIProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </UIProvider>
  );
}