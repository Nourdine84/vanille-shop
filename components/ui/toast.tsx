"use client";

import { createContext, useContext, useState } from "react";

const ToastContext = createContext<any>(null);

export function ToastProvider({ children }: any) {
  const [message, setMessage] = useState("");

  function showToast(msg: string) {
    setMessage(msg);

    setTimeout(() => {
      setMessage("");
    }, 2000);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {message && (
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
            animation: "slideUp 0.3s ease",
          }}
        >
          {message}
        </div>
      )}

      {/* ANIMATION CSS */}
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