"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD PRODUCT
  ========================= */

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`/api/admin/products/${id}`);
      const data = await res.json();
      setProduct(data);
    };

    if (id) fetchProduct();
  }, [id]);

  /* =========================
     UPDATE
  ========================= */

  const handleSave = async () => {
    setLoading(true);

    await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    setLoading(false);
    router.push("/admin/products");
  };

  if (!product) return <div style={{ padding: 40 }}>Chargement...</div>;

  return (
    <div style={container}>
      <h1 style={title}>✏️ Modifier produit</h1>

      <div style={form}>
        <input
          placeholder="Nom"
          value={product.name || ""}
          onChange={(e) =>
            setProduct({ ...product, name: e.target.value })
          }
          style={input}
        />

        <input
          placeholder="Slug"
          value={product.slug || ""}
          onChange={(e) =>
            setProduct({ ...product, slug: e.target.value })
          }
          style={input}
        />

        <input
          placeholder="Prix (centimes)"
          value={product.priceCents || ""}
          onChange={(e) =>
            setProduct({ ...product, priceCents: Number(e.target.value) })
          }
          style={input}
        />

        <input
          placeholder="Image URL"
          value={product.imageUrl || ""}
          onChange={(e) =>
            setProduct({ ...product, imageUrl: e.target.value })
          }
          style={input}
        />

        <textarea
          placeholder="Description"
          value={product.description || ""}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          style={textarea}
        />

        <button onClick={handleSave} style={btn}>
          {loading ? "Enregistrement..." : "💾 Sauvegarder"}
        </button>
      </div>
    </div>
  );
}

/* ========================= STYLE ========================= */

const container = {
  padding: "40px",
};

const title = {
  fontSize: "26px",
  marginBottom: "20px",
};

const form = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "12px",
  maxWidth: "500px",
};

const input = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const textarea = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  minHeight: "100px",
};

const btn = {
  background: "#a16207",
  color: "white",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
};