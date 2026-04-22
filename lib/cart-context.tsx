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
  isReady: boolean;
};

/* ================= CONTEXT ================= */

const CartContext = createContext<CartContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  /* ================= HYDRATION ================= */

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

      let updated: CartItem[];

      if (existing) {
        updated = prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      } else {
        updated = [...prev, item];
      }

      try {
        localStorage.setItem("cart", JSON.stringify(updated));
      } catch {}

      return updated;
    });

    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("cart:add", {
          detail: {
            name: item.name,
          },
        })
      );
    }, 0);
  }

  function removeFromCart(id: string) {
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== id);

      try {
        localStorage.setItem("cart", JSON.stringify(updated));
      } catch {}

      return updated;
    });
  }

  function updateQuantity(id: string, quantity: number) {
    setCart((prev) => {
      let updated: CartItem[];

      if (quantity <= 0) {
        updated = prev.filter((item) => item.id !== id);
      } else {
        updated = prev.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
      }

      try {
        localStorage.setItem("cart", JSON.stringify(updated));
      } catch {}

      return updated;
    });
  }

  function clearCart() {
    try {
      localStorage.removeItem("cart");
    } catch {}

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
        isReady: isHydrated,
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