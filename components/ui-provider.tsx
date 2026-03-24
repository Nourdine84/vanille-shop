"use client";

import { createContext, useContext, useState } from "react";

type UIContextType = {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const UIContext = createContext<UIContextType | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <UIContext.Provider value={{ isCartOpen, openCart, closeCart }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUIStore() {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error("useUIStore must be used within UIProvider");
  }

  return context;
}