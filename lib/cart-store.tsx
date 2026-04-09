"use client";

import { useEffect, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
  imageUrl?: string;
};

let globalCart: CartItem[] = [];
let listeners: ((cart: CartItem[]) => void)[] = [];

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
  } catch {
    globalCart = [];
  }
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    loadFromStorage();
    setCart([...globalCart]);

    const timeout = setTimeout(() => {
      notify();
    }, 50);

    listeners.push(setCart);

    return () => {
      clearTimeout(timeout);
      listeners = listeners.filter((l) => l !== setCart);
    };
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

  const updateQuantity = (id: string, quantity: number) => {
    let newCart =
      quantity <= 0
        ? globalCart.filter((i) => i.id !== id)
        : globalCart.map((i) =>
            i.id === id ? { ...i, quantity } : i
          );

    save(newCart);
  };

  const removeFromCart = (id: string) => {
    save(globalCart.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    globalCart = [];
    localStorage.removeItem("cart");
    notify();
  };

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
}