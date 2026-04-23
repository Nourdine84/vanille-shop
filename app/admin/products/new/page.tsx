"use client";

import { useState } from "react";

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  /* ================= SUBMIT ================= */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setError("");

    /* ================= VALIDATION ================= */

    if (!form.name.trim() || !form.slug.trim()) {
      setError("Nom et slug requis");
      return;
    }

    const price = Number(form.priceCents);
    if (!Number.isFinite(price) || price <= 0) {
      setError("Prix invalide");
      return;
    }

    if (!form.imageUrl.trim()) {
      setError("Image requise");
      return;
    }

    if (form.isPack && !form.packItems.trim()) {
      setError("Ajoute le contenu du pack");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      /* ================= DATA ================= */

      formData.append("name", form.name.trim());
      formData.append("slug", form.slug.trim());
      formData.append("priceCents", String(price));
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
        formData.append("packItems", form.packItems.trim());
      }

      /* ================= API ================= */

      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("✅ Produit créé avec succès");

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
        const err = await res.json().catch(() => null);
        setError(err?.error || "Erreur serveur");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  /* ================= UI ================= */

  return (
    <div style={container}>
      <h1 style={title}>Créer un produit</h1>

      {error && <p style={errorStyle}>❌ {error}</p>}

      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          placeholder="Nom"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          style={input}
        />

        <input
          placeholder="Slug"
          value={form.slug}
          onChange={(e) => handleChange("slug", e.target.value)}
          style={input}
        />

        <input
          placeholder="Prix (centimes)"
          type="number"
          value={form.priceCents}
          onChange={(e) => handleChange("priceCents", e.target.value)}
          style={input}
        />

        <input
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => handleChange("imageUrl", e.target.value)}
          style={input}
        />

        {/* PREVIEW IMAGE 🔥 */}
        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="preview"
            style={preview}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}

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

        {/* ACTIVE */}
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

        {form.isPack && (
          <textarea
            placeholder="Contenu du pack"
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

const container = { padding: 30 };

const title = { marginBottom: 20 };

const errorStyle = {
  color: "#dc2626",
  marginBottom: 15,
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

const preview = {
  width: "100%",
  maxHeight: 200,
  objectFit: "cover" as const,
  borderRadius: 10,
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