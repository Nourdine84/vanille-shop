"use client";

import { useState } from "react";

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    priceCents: "",
    imageUrl: "",
    stock: "0",
    description: "",
    category: "vanille",
    subCategory: "",
    isActive: true,
    isPack: false,
    packItems: "",
  });

  function handleChange(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;

    /* ================= VALIDATION ================= */

    if (!form.name || !form.slug || !form.priceCents || !form.imageUrl) {
      alert("❌ Champs obligatoires manquants");
      return;
    }

    if (form.isPack && !form.packItems.trim()) {
      alert("❌ Ajoute le contenu du pack");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      /* ================= DATA ================= */

      formData.append("name", form.name.trim());
      formData.append("slug", form.slug.trim());
      formData.append("priceCents", form.priceCents);
      formData.append("imageUrl", form.imageUrl.trim());
      formData.append("stock", form.stock || "0");
      formData.append("description", form.description.trim());
      formData.append("category", form.category.trim());

      if (form.subCategory.trim()) {
        formData.append("subCategory", form.subCategory.trim());
      }

      /* ================= FLAGS ================= */

      if (form.isActive) formData.append("isActive", "on");

      if (form.isPack) {
        formData.append("isPack", "on");

        if (form.packItems.trim()) {
          formData.append("packItems", form.packItems.trim());
        }
      }

      /* ================= CALL API ================= */

      const res = await fetch("/api/admin/create-product", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("✅ Produit créé avec succès");

        // reset propre
        setForm({
          name: "",
          slug: "",
          priceCents: "",
          imageUrl: "",
          stock: "0",
          description: "",
          category: "vanille",
          subCategory: "",
          isActive: true,
          isPack: false,
          packItems: "",
        });

        window.location.href = "/admin/products";
      } else {
        const err = await res.json();
        alert("❌ " + (err.error || "Erreur serveur"));
      }
    } catch (error) {
      console.error(error);
      alert("❌ Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={container}>
      <h1 style={title}>Créer un produit</h1>

      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          placeholder="Nom"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          style={input}
          required
        />

        <input
          placeholder="Slug"
          value={form.slug}
          onChange={(e) => handleChange("slug", e.target.value)}
          style={input}
          required
        />

        <input
          placeholder="Prix (centimes)"
          type="number"
          value={form.priceCents}
          onChange={(e) => handleChange("priceCents", e.target.value)}
          style={input}
          required
        />

        <input
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => handleChange("imageUrl", e.target.value)}
          style={input}
          required
        />

        <input
          placeholder="Stock"
          type="number"
          value={form.stock}
          onChange={(e) => handleChange("stock", e.target.value)}
          style={input}
        />

        <input
          placeholder="Catégorie"
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
          style={input}
        />

        <input
          placeholder="Sous-catégorie"
          value={form.subCategory}
          onChange={(e) => handleChange("subCategory", e.target.value)}
          style={input}
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          style={textarea}
        />

        {/* ACTIF */}
        <label style={checkboxRow}>
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              handleChange("isActive", e.target.checked)
            }
          />
          Produit actif
        </label>

        {/* PACK */}
        <label style={checkboxRow}>
          <input
            type="checkbox"
            checked={form.isPack}
            onChange={(e) =>
              handleChange("isPack", e.target.checked)
            }
          />
          Produit pack
        </label>

        {/* PACK CONTENT */}
        {form.isPack && (
          <textarea
            placeholder="Contenu du pack (ex: 10g vanille + cacao + cannelle)"
            value={form.packItems}
            onChange={(e) =>
              handleChange("packItems", e.target.value)
            }
            style={textarea}
          />
        )}

        <button
          type="submit"
          style={{
            ...btn,
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          disabled={loading}
        >
          {loading ? "Création..." : "Créer le produit"}
        </button>
      </form>
    </div>
  );
}

/* ================= STYLE ================= */

const container = {
  padding: 30,
};

const title = {
  marginBottom: 20,
};

const formStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 12,
  maxWidth: 500,
};

const input = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
};

const textarea = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
  minHeight: 80,
};

const checkboxRow = {
  display: "flex",
  gap: 10,
  alignItems: "center",
};

const btn = {
  background: "#a16207",
  color: "white",
  padding: 12,
  border: "none",
  borderRadius: 8,
  fontWeight: 600,
};