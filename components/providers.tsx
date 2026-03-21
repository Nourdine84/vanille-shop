"use client";

import { useEffect } from "react";
import { useCartStore } from "../lib/cart-store";

export default function Providers({ children }: any) {
  const loadCart = useCartStore((state) => state.loadCart);

  useEffect(() => {
    loadCart();
  }, []);

  return children;
}