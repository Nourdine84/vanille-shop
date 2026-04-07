"use client";

import { createContext, useContext, useMemo, useState } from "react";

type UIContextType = {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const value = useMemo(
    () => ({
      isCartOpen,
      openCart,
      closeCart,
    }),
    [isCartOpen]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUIStore() {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error("UIProvider manquant");
  }

  return context;
}