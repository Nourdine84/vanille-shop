"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  quantity: number;
  imageUrl?: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function normalizeCartItem(item: Partial<CartItem>): CartItem | null {
  if (!item.id || !item.name) return null;

  const priceCents = Number(item.priceCents);
  const quantity = Number(item.quantity);

  if (!Number.isFinite(priceCents) || priceCents <= 0) return null;

  return {
    id: item.id,
    name: item.name,
    priceCents,
    quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
    imageUrl: item.imageUrl || "",
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      if (!raw) {
        setHydrated(true);
        return;
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        setHydrated(true);
        return;
      }

      const safeCart = parsed
        .map((item) => normalizeCartItem(item))
        .filter(Boolean) as CartItem[];

      setCart(safeCart);
    } catch (error) {
      console.error("Cart hydration error:", error);
      setCart([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Cart persist error:", error);
    }
  }, [cart, hydrated]);

  const value = useMemo<CartContextType>(
    () => ({
      cart,

      addToCart: (item) => {
        const normalized = normalizeCartItem(item);
        if (!normalized) return;

        setCart((prev) => {
          const existing = prev.find((p) => p.id === normalized.id);

          if (existing) {
            return prev.map((p) =>
              p.id === normalized.id
                ? { ...p, quantity: p.quantity + normalized.quantity }
                : p
            );
          }

          return [...prev, normalized];
        });
      },

      removeFromCart: (id) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          setCart((prev) => prev.filter((item) => item.id !== id));
          return;
        }

        setCart((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, quantity } : item
          )
        );
      },

      clearCart: () => {
        setCart([]);
      },
    }),
    [cart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}