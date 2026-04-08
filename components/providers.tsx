"use client";

import { UIProvider } from "./ui-providers";
import MiniCart from "./mini-cart";

export default function Providers({ children }: any) {
  return (
    <UIProvider>
      {children}
      <MiniCart /> {/* 🔥 GLOBAL */}
    </UIProvider>
  );
}