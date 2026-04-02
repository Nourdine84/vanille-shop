"use client";

import { useState } from "react";
import ImageUploadField from "@/components/admin/ImageUploadField";

export default function ProductForm() {
  const [loading, setLoading] = useState(false);

  return (
    <form
      action="/api/admin/products"
      method="POST"
      style={formGrid}
      onSubmit={() => setLoading(true)}
    >
      <input name="name" placeholder="Nom produit" style={input} required />
      <input name="slug" placeholder="Slug" style={input} required />

      <input
        name="description"
        placeholder="Description"
        style={input}
        required
      />

      {/* IMAGE */}
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

      {/* CATEGORY */}
      <select name="category" defaultValue="vanille" style={input}>
        <option value="vanille">Vanille</option>
        <option value="epices">Épices</option>
      </select>

      <input
        name="subCategory"
        placeholder="Sous-catégorie"
        style={input}
      />

      {/* 🔥 BADGE */}
      <select name="badge" style={input} defaultValue="">
        <option value="">Aucun badge</option>
        <option value="BESTSELLER">🔥 Bestseller</option>
        <option value="NEW">🆕 Nouveau</option>
        <option value="PREMIUM">💎 Premium</option>
        <option value="PROMO">🏷 Promo</option>
      </select>

      {/* ACTIVE */}
      <label style={checkboxRow}>
        <input type="checkbox" name="isActive" defaultChecked />
        Produit actif
      </label>

      <div style={{ gridColumn: "1 / -1" }}>
        <button type="submit" style={primaryBtn} disabled={loading}>
          {loading ? "Création..." : "Créer le produit"}
        </button>
      </div>
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
  cursor: "pointer",
};