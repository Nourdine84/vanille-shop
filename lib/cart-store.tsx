"use client";

import { useEffect, useState } from "react";

/* =========================
   TYPES
========================= */

export type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
  imageUrl?: string;
};

/* =========================
   GLOBAL STORE
========================= */

let globalCart: CartItem[] = [];
let listeners: ((cart: CartItem[]) => void)[] = [];

/* =========================
   HELPERS
========================= */

function notify() {
  listeners.forEach((l) => l([...globalCart]));
}

function save(cart: CartItem[]) {
  globalCart = cart;

  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  notify();
}

function loadFromStorage() {
  if (typeof window === "undefined") return;

  try {
    const stored = localStorage.getItem("cart");
    if (stored) {
      globalCart = JSON.parse(stored);
    }
  } catch (error) {
    console.error("❌ CART LOAD ERROR:", error);
    globalCart = [];
  }
}

/* =========================
   HOOK
========================= */

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  /* 🔄 Init + Sync */
  useEffect(() => {
    loadFromStorage();
    setCart([...globalCart]);

    listeners.push(setCart);

    return () => {
      listeners = listeners.filter((l) => l !== setCart);
    };
  }, []);

  /* =========================
     ACTIONS
  ========================= */

  const addToCart = (item: CartItem) => {
    const existing = globalCart.find((i) => i.id === item.id);

    let newCart: CartItem[];

    if (existing) {
      const newQty = existing.quantity + item.quantity;

      if (newQty <= 0) {
        newCart = globalCart.filter((i) => i.id !== item.id);
      } else {
        newCart = globalCart.map((i) =>
          i.id === item.id
            ? { ...i, quantity: newQty }
            : i
        );
      }
    } else {
      if (item.quantity <= 0) return;

      newCart = [...globalCart, item];
    }

    save(newCart);
  };

  const updateQuantity = (id: string, quantity: number) => {
    let newCart: CartItem[];

    if (quantity <= 0) {
      newCart = globalCart.filter((i) => i.id !== id);
    } else {
      newCart = globalCart.map((i) =>
        i.id === id ? { ...i, quantity } : i
      );
    }

    save(newCart);
  };

  const removeFromCart = (id: string) => {
    const newCart = globalCart.filter((i) => i.id !== id);
    save(newCart);
  };

  const clearCart = () => {
    globalCart = [];

    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }

    notify();
  };

  /* =========================
     EXPORT
  ========================= */

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
}