"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

/* =========================
   UTILS
========================= */

function generateSlug(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function normalizeImage(input: string) {
  if (!input) return "";

  return input
    .trim()
    .replace(/^\/+/, "")
    .replace(/^products\//, "")
    .replace(/^images\//, "")
    .replace(/^image\//, "")
    .replace(/^imae\//, "");
}

export default function EditProductPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
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
     SAVE
  ========================= */

  const handleSave = async () => {
    setLoading(true);

    const cleanProduct = {
      ...product,
      slug: generateSlug(product.slug || product.name),
      imageUrl: normalizeImage(product.imageUrl || ""),
    };

    await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cleanProduct),
    });

    setLoading(false);
    router.push("/admin/products");
  };

  if (!product) return <div style={{ padding: 40 }}>Chargement...</div>;

  return (
    <div style={container}>
      <h1 style={title}>✏️ Modifier produit</h1>

      <div style={form}>
        {/* NOM */}
        <input
          placeholder="Nom"
          value={product.name || ""}
          onChange={(e) =>
            setProduct({ ...product, name: e.target.value })
          }
          style={input}
        />

        {/* SLUG */}
        <input
          placeholder="Slug"
          value={product.slug || ""}
          onChange={(e) =>
            setProduct({
              ...product,
              slug: generateSlug(e.target.value),
            })
          }
          style={input}
        />

        {/* PRIX */}
        <input
          placeholder="Prix (centimes)"
          type="number"
          value={product.priceCents || ""}
          onChange={(e) =>
            setProduct({
              ...product,
              priceCents: Number(e.target.value),
            })
          }
          style={input}
        />

        {/* STOCK */}
        <input
          placeholder="Stock"
          type="number"
          value={product.stock || ""}
          onChange={(e) =>
            setProduct({
              ...product,
              stock: Number(e.target.value),
            })
          }
          style={input}
        />

        {/* IMAGE */}
        <input
          placeholder="Image (ex: cannelle.jpg)"
          value={product.imageUrl || ""}
          onChange={(e) =>
            setProduct({
              ...product,
              imageUrl: e.target.value,
            })
          }
          style={input}
        />

        {/* CATEGORY */}
        <select
          value={product.category || "vanille"}
          onChange={(e) =>
            setProduct({
              ...product,
              category: e.target.value,
            })
          }
          style={input}
        >
          <option value="vanille">Vanille</option>
          <option value="epices">Épices</option>
        </select>

        {/* BADGE */}
        <select
          value={product.badge || ""}
          onChange={(e) =>
            setProduct({
              ...product,
              badge: e.target.value || null,
            })
          }
          style={input}
        >
          <option value="">Aucun badge</option>
          <option value="Nouveau">🔥 Nouveau</option>
          <option value="Promo">💸 Promo</option>
          <option value="Best Seller">⭐ Best Seller</option>
          <option value="Top Vente">🚀 Top vente</option>
        </select>

        {/* ACTIVE */}
        <label style={checkboxRow}>
          <input
            type="checkbox"
            checked={product.isActive || false}
            onChange={(e) =>
              setProduct({
                ...product,
                isActive: e.target.checked,
              })
            }
          />
          Produit actif
        </label>

        {/* DESCRIPTION */}
        <textarea
          placeholder="Description"
          value={product.description || ""}
          onChange={(e) =>
            setProduct({
              ...product,
              description: e.target.value,
            })
          }
          style={textarea}
        />

        {/* SAVE */}
        <button onClick={handleSave} style={btn}>
          {loading ? "Enregistrement..." : "💾 Sauvegarder"}
        </button>
      </div>
    </div>
  );
}

/* ========================= STYLE ========================= */

const container = { padding: "40px" };

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

const checkboxRow = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
};