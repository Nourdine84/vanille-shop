"use client";

import { createContext, useContext, useState } from "react";

type UIContextType = {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => {
    console.log("🟢 OPEN CART"); // 🔥 DEBUG
    setIsCartOpen(true);
  };

  const closeCart = () => {
    console.log("🔴 CLOSE CART"); // 🔥 DEBUG
    setIsCartOpen(false);
  };

  return (
    <UIContext.Provider value={{ isCartOpen, openCart, closeCart }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUIStore() {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error("❌ UIProvider manquant !");
  }

  return context;
}