"use client";

import { useState } from "react";

/* ================= STYLE ================= */

const section = {
  background: "white",
  padding: 20,
  borderRadius: 16,
  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  marginBottom: 20,
};

const input = {
  padding: "12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  width: "100%",
};

export default function ProductForm() {
  const [preview, setPreview] = useState<string | null>(null);

  const handlePreview = (file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  return (
    <form
      action="/api/admin/products"
      method="POST"
      encType="multipart/form-data"
      style={{ maxWidth: 900 }}
    >
      {/* ================= INFOS ================= */}
      <div style={section}>
        <h3>📦 Informations produit</h3>

        <input name="name" placeholder="Nom produit" required style={input} />
        <br /><br />

        <input name="slug" placeholder="Slug" required style={input} />
        <br /><br />

        <textarea
          name="description"
          placeholder="Description"
          style={{ ...input, minHeight: 100 }}
        />
      </div>

      {/* ================= IMAGE ================= */}
      <div style={section}>
        <h3>🖼 Image produit</h3>

        {preview && (
          <img
            src={preview}
            style={{
              width: 180,
              borderRadius: 12,
              marginBottom: 10,
            }}
          />
        )}

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={(e) => handlePreview(e.target.files?.[0] || null)}
        />

        <br /><br />

        <input
          name="imageUrl"
          placeholder="OU URL image (fallback)"
          style={input}
        />
      </div>

      {/* ================= STOCK + CATEGORY ================= */}
      <div style={section}>
        <h3>📊 Stock & Catégorie</h3>

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          required
          style={input}
        />

        <br /><br />

        <select name="category" style={input}>
          <option value="vanille">Vanille</option>
          <option value="epices">Épices</option>
        </select>

        <br /><br />

        <select name="badge" style={input}>
          <option value="">Aucun badge</option>
          <option value="Best Seller">🔥 Best Seller</option>
          <option value="Top Vente">🏆 Top Vente</option>
          <option value="Promo">💸 Promo</option>
          <option value="Nouveau">✨ Nouveau</option>
        </select>
      </div>

      {/* ================= PRICING PREMIUM ================= */}
      <div style={section}>
        <h3>💰 Pricing (centimes)</h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {["10g","50g","100g","250g","500g","1kg"].map((f) => (
            <input
              key={f}
              name={`price_${f}`}
              type="number"
              placeholder={f}
              style={input}
            />
          ))}
        </div>
      </div>

      {/* ================= CTA ================= */}
      <button
        style={{
          width: "100%",
          padding: 16,
          background: "linear-gradient(135deg,#b7791f,#8b5e14)",
          color: "white",
          borderRadius: 12,
          border: "none",
          fontWeight: 800,
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        Ajouter produit
      </button>
    </form>
  );
}