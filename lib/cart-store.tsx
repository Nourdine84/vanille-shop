"use client";

import { useEffect, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
  imageUrl?: string;
};

// 🔥 STATE GLOBAL (clé du fix)
let globalCart: CartItem[] = [];
let listeners: ((cart: CartItem[]) => void)[] = [];

function notify() {
  listeners.forEach((l) => l(globalCart));
}

function save(cart: CartItem[]) {
  globalCart = cart;
  localStorage.setItem("cart", JSON.stringify(cart));
  notify();
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(globalCart);

  // 🔥 sync avec global store
  useEffect(() => {
    listeners.push(setCart);

    return () => {
      listeners = listeners.filter((l) => l !== setCart);
    };
  }, []);

  // 🔥 load initial
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) {
      globalCart = JSON.parse(stored);
      notify();
    }
  }, []);

  const addToCart = (item: CartItem) => {
    const existing = globalCart.find((i) => i.id === item.id);

    let newCart: CartItem[];

    if (existing) {
      newCart = globalCart.map((i) =>
        i.id === item.id
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
    } else {
      newCart = [...globalCart, item];
    }

    save(newCart);
  };

  const removeFromCart = (id: string) => {
    const newCart = globalCart.filter((i) => i.id !== id);
    save(newCart);
  };

  const updateQuantity = (id: string, quantity: number) => {
    const newCart = globalCart.map((i) =>
      i.id === id ? { ...i, quantity } : i
    );
    save(newCart);
  };

  const clearCart = () => {
    globalCart = [];
    localStorage.removeItem("cart");
    notify();
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}