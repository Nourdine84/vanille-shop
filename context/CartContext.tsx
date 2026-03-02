"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl?: string | null;
  quantity: number;
};

export type CartContextType = {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalCents: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "vanille_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Charger depuis localStorage au premier rendu
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log("📦 Chargé depuis localStorage:", parsed);
        setItems(parsed);
      } else {
        console.log("📦 Aucune donnée dans localStorage");
      }
    } catch (error) {
      console.error("❌ Erreur chargement localStorage:", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sauvegarder dans localStorage à chaque modification
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        console.log("💾 Sauvegardé dans localStorage:", items);
      } catch (error) {
        console.error("❌ Erreur sauvegarde localStorage:", error);
      }
    }
  }, [items, isInitialized]);

  const addToCart = (product: Omit<CartItem, "quantity">, quantity = 1) => {
    console.log("➕ Ajout au panier:", product, quantity);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (id: string) => {
    console.log("➖ Retrait du panier:", id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    console.log("🔄 Mise à jour quantité:", id, quantity);
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((i) => i.id !== id);
      return prev.map((i) => (i.id === id ? { ...i, quantity } : i));
    });
  };

  const clearCart = () => {
    console.log("🗑️ Vidage du panier");
    setItems([]);
  };

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalCents = items.reduce((acc, i) => acc + i.priceCents * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalCents,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}