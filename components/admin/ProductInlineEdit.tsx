"use client";

import { useState } from "react";

export default function ProductInlineEdit({ product }: any) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.priceCents);
  const [stock, setStock] = useState(product.stock);
  const [loading, setLoading] = useState(false);

  async function save() {
    setLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: JSON.stringify({
          id: product.id,
          name,
          priceCents: Number(price),
          stock: Number(stock),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setEditing(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  if (!editing) {
    return (
      <button onClick={() => setEditing(true)} style={btn}>
        ✏️ Edit
      </button>
    );
  }

  return (
    <div style={box}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      />
      <input
        type="number"
        value={stock}
        onChange={(e) => setStock(Number(e.target.value))}
      />

      <button onClick={save} disabled={loading}>
        💾 Save
      </button>

      <button onClick={() => setEditing(false)}>❌</button>
    </div>
  );
}

const btn = {
  background: "#2563eb",
  color: "white",
  padding: "6px 10px",
  borderRadius: "6px",
  border: "none",
};

const box = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "6px",
};