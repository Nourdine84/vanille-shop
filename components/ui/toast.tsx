"use client";

import { createContext, useContext, useState } from "react";

type ToastType = "success" | "error" | "warning" | "info";

type ToastState = {
  message: string;
  type: ToastType;
};

const ToastContext = createContext<any>(null);

export function ToastProvider({ children }: any) {
  const [toast, setToast] = useState<ToastState | null>(null);

  function showToast(
    message: string,
    type: ToastType = "info",
    duration = 2500
  ) {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, duration);
  }

  const colors = {
    success: "#16a34a",
    error: "#dc2626",
    warning: "#f59e0b",
    info: "#2563eb",
  };

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            right: "30px",
            background: "#111",
            color: "white",
            padding: "16px 22px",
            borderRadius: "14px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
            fontSize: "14px",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            borderLeft: `4px solid ${colors[toast.type]}`,
            animation: "slideUp 0.3s ease",
          }}
        >
          <span>{icons[toast.type]}</span>
          <span>{toast.message}</span>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}