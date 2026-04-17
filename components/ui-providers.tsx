"use client";

import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

type UIContextType = {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  resetUI: () => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const resetUI = () => {
    setIsCartOpen(false);

    if (typeof document !== "undefined") {
      document.body.style.overflow = "auto";
      document.body.style.pointerEvents = "auto";
    }
  };

  useEffect(() => {
    resetUI();
  }, [pathname]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.body.style.overflow = isCartOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCartOpen]);

  const value = useMemo(
    () => ({
      isCartOpen,
      openCart,
      closeCart,
      resetUI,
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