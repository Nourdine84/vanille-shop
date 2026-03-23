"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type UIContextType = {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  function openCart() {
    setIsCartOpen(true);
  }

  function closeCart() {
    setIsCartOpen(false);
  }

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