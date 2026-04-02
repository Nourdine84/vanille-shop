"use client";

import { useState } from "react";

export default function ProductForm() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);

      // injecte dans le champ caché
      const input = document.getElementById("imageUrl") as HTMLInputElement;
      if (input) input.value = base64;
    };

    reader.readAsDataURL(file);
  }

  return (
    <form
      action="/api/admin/products"
      method="POST"
      onSubmit={() => setLoading(true)}
      style={formGrid}
    >
      <input name="name" placeholder="Nom produit" required style={input} />
      <input name="slug" placeholder="Slug (URL)" required style={input} />

      <input
        name="description"
        placeholder="Description"
        required
        style={input}
      />

      {/* 🔥 UPLOAD IMAGE */}
      <div style={uploadBox}>
        <input type="file" accept="image/*" onChange={handleImage} />

        {preview && (
          <img src={preview} style={previewImg} />
        )}
      </div>

      {/* 🔥 URL MANUELLE (fallback) */}
      <input
        name="imageUrl"
        id="imageUrl"
        placeholder="Ou coller URL image"
        style={input}
      />

      <input
        name="priceCents"
        type="number"
        placeholder="Prix en centimes"
        required
        style={input}
      />

      <input
        name="stock"
        type="number"
        placeholder="Stock"
        required
        style={input}
      />

      {/* CATÉGORIE */}
      <select name="category" style={input}>
        <option value="vanille">Vanille</option>
        <option value="epices">Épices</option>
      </select>

      <input
        name="subCategory"
        placeholder="Sous-catégorie"
        style={input}
      />

      {/* BADGE */}
      <select name="badge" style={input}>
        <option value="">Aucun badge</option>
        <option value="Nouveau">🔥 Nouveau</option>
        <option value="Promo">💸 Promo</option>
        <option value="Best-seller">⭐ Best Seller</option>
      </select>

      {/* ACTIVE */}
      <label style={checkboxRow}>
        <input type="checkbox" name="isActive" defaultChecked />
        Produit actif
      </label>

      <button type="submit" style={button} disabled={loading}>
        {loading ? "Création..." : "Créer le produit"}
      </button>
    </form>
  );
}

/* ================= STYLE ================= */

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "12px",
};

const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const uploadBox = {
  gridColumn: "1 / -1",
  border: "2px dashed #ccc",
  padding: "15px",
  borderRadius: "10px",
  textAlign: "center" as const,
};

const previewImg = {
  width: "100%",
  maxWidth: "200px",
  marginTop: "10px",
  borderRadius: "10px",
};

const button = {
  gridColumn: "1 / -1",
  background: "#a16207",
  color: "white",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  fontWeight: "bold",
};

const checkboxRow = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
};