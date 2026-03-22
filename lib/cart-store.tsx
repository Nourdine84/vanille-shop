
import { create } from "zustand";

type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
  imageUrl?: string;
};

type CartStore = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
};

export const useCartStore = create<CartStore>((set) => ({
  cart: [],

  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find((i) => i.id === item.id);

      if (existing) {
        return {
          cart: state.cart.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }

      return { cart: [...state.cart, item] };
    }),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    })),

  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),
}));