"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  imageUrl?: string;
  quantity: number;
};

type CartState = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addToCart: (item) => {
        console.log("🛒 STORE ADD", item);

        const existing = get().cart.find((i) => i.id === item.id);

        if (existing) {
          set({
            cart: get().cart.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({
            cart: [...get().cart, item],
          });
        }
      },

      removeFromCart: (id) => {
        set({
          cart: get().cart.filter((item) => item.id !== id),
        });
      },

      clearCart: () => {
        set({ cart: [] });
      },
    }),
    {
      name: "cart-storage", // 🔥 stockage navigateur
    }
  )
);