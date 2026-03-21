"use client";

import { create } from "zustand";

export type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
};

type CartStore = {
  cart: CartItem[];
  loadCart: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
};

export const useCartStore = create<CartStore>((set, get) => ({
  cart: [],

  loadCart: () => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("cart");
    if (stored) {
      set({ cart: JSON.parse(stored) });
    }
  },

  addToCart: (item) => {
    const cart = get().cart;
    const existing = cart.find((i) => i.id === item.id);

    let updatedCart;

    if (existing) {
      updatedCart = cart.map((i) =>
        i.id === item.id
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
    } else {
      updatedCart = [...cart, item];
    }

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    set({ cart: updatedCart });
  },

  removeFromCart: (id) => {
    const updatedCart = get().cart.filter((i) => i.id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    set({ cart: updatedCart });
  },
}));