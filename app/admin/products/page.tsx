"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  priceCents: number;
  stock: number;
  isActive: boolean;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const updateProduct = async (product: Product) => {
    setLoadingId(product.id);

    try {
      await fetch("/api/admin/update-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
    } catch (error) {
      console.error(error);
      alert("Erreur update");
    } finally {
      setLoadingId(null);
    }
  };

  const updateField = (
    id: string,
    field: keyof Product,
    value: any
  ) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  return (
    <div style={container}>
      <h1 style={title}>🛠 Admin Produits</h1>

      {products.map((product) => (
        <div key={product.id} style={card}>
          <input
            value={product.name}
            onChange={(e) =>
              updateField(product.id, "name", e.target.value)
            }
            style={input}
          />

          <input
            type="number"
            value={product.priceCents}
            onChange={(e) =>
              updateField(
                product.id,
                "priceCents",
                Number(e.target.value)
              )
            }
            style={input}
          />

          <input
            type="number"
            value={product.stock}
            onChange={(e) =>
              updateField(
                product.id,
                "stock",
                Number(e.target.value)
              )
            }
            style={input}
          />

          <label style={switchRow}>
            Actif
            <input
              type="checkbox"
              checked={product.isActive}
              onChange={(e) =>
                updateField(
                  product.id,
                  "isActive",
                  e.target.checked
                )
              }
            />
          </label>

          <button
            onClick={() => updateProduct(product)}
            style={btn}
            disabled={loadingId === product.id}
          >
            {loadingId === product.id ? "..." : "Sauvegarder"}
          </button>
        </div>
      ))}
    </div>
  );
}

/* 🎨 STYLE */

const container = {
  padding: "40px",
  background: "#faf7f2",
  minHeight: "100vh",
};

const title = {
  fontSize: "28px",
  marginBottom: "20px",
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "15px",
  display: "flex",
  gap: "10px",
  flexWrap: "wrap" as const,
  alignItems: "center",
};

const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const btn = {
  background: "#a16207",
  color: "white",
  border: "none",
  padding: "10px 14px",
  borderRadius: "8px",
  cursor: "pointer",
};

const switchRow = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
};