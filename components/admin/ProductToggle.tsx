"use client";

import { useState } from "react";

export default function ProductToggle({
  productId,
  initialState,
}: {
  productId: string;
  initialState: boolean;
}) {
  const [active, setActive] = useState(initialState);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/products/toggle", {
        method: "POST",
        body: JSON.stringify({
          id: productId,
          isActive: !active,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setActive(!active);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      style={{
        background: active ? "#16a34a" : "#6b7280",
        color: "white",
        border: "none",
        padding: "6px 10px",
        borderRadius: "8px",
        fontSize: "12px",
        cursor: "pointer",
      }}
    >
      {active ? "🟢 Actif" : "⚫ Inactif"}
    </button>
  );
}