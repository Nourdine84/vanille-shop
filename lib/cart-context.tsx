"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

/* ================= TYPES ================= */

export type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  imageUrl?: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

/* ================= CONTEXT ================= */

const CartContext = createContext<CartContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const shouldReset = sessionStorage.getItem("order_success");

    if (shouldReset === "true") {
      localStorage.removeItem("cart");
      sessionStorage.removeItem("order_success");
      setCart([]);
      setIsHydrated(true);
      return;
    }

    const stored = localStorage.getItem("cart");

    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch {
        setCart([]);
      }
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, isHydrated]);

  /* ================= ACTIONS ================= */

  function addToCart(item: CartItem) {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);

      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }

      return [...prev, item];
    });

    /* 🔥 TOAST EVENT GLOBAL */
    window.dispatchEvent(
      new CustomEvent("cart:add", {
        detail: {
          name: item.name,
        },
      })
    );
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) return removeFromCart(id);

    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }

  function clearCart() {
    localStorage.removeItem("cart");
    setCart([]);
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ================= HOOK ================= */

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
