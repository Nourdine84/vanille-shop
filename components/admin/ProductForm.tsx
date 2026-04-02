"use client";

import ImageUploadField from "@/components/admin/ImageUploadField";

export default function ProductForm() {
  return (
    <form action="/api/admin/products" method="POST" style={formGrid}>
      <input name="name" placeholder="Nom produit" style={input} required />
      <input name="slug" placeholder="Slug" style={input} required />

      <input
        name="description"
        placeholder="Description"
        style={input}
        required
      />

      {/* ✅ Upload image CLIENT */}
      <ImageUploadField />

      <input
        name="priceCents"
        type="number"
        min="0"
        placeholder="Prix centimes"
        style={input}
        required
      />

      <input
        name="stock"
        type="number"
        min="0"
        placeholder="Stock"
        style={input}
        required
      />

      <select name="category" defaultValue="vanille" style={input}>
        <option value="vanille">Vanille</option>
        <option value="epices">Épices</option>
      </select>

      <input
        name="subCategory"
        placeholder="Sous-catégorie"
        style={input}
      />

      <label style={checkboxRow}>
        <input type="checkbox" name="isActive" defaultChecked />
        Produit actif
      </label>

      <div style={{ gridColumn: "1 / -1" }}>
        <button type="submit" style={primaryBtn}>
          Créer le produit
        </button>
      </div>
    </form>
  );
}

/* styles */
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

const checkboxRow = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
};

const primaryBtn = {
  background: "#a16207",
  color: "white",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
};