"use client";

import { useState } from "react";

type ProductFormState = {
  name: string;
  slug: string;
  priceCents: string;
  imageUrl: string;
  stock: string;
  description: string;
  category: string;
  subCategory: string;
  badge: string;
  isActive: boolean;
  isPack: boolean;
  packItems: string;
};

const BADGES = [
  "",
  "Top Vente",
  "Nouveau",
  "Best Seller",
  "Promo",
  "Premium",
  "Édition limitée",
  "Artisan",
];

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<ProductFormState>({
    name: "",
    slug: "",
    priceCents: "",
    imageUrl: "",
    stock: "0",
    description: "",
    category: "vanille",
    subCategory: "",
    badge: "",
    isActive: true,
    isPack: false,
    packItems: "",
  });

  const stockNumber = Number(form.stock);
  const isOutOfStock = Number.isFinite(stockNumber) && stockNumber <= 0;

  function handleChange<K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function generateSlug(value: string) {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setError("");

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

    const stock = Number(form.stock);
    if (!Number.isFinite(stock) || stock < 0) {
      setError("Stock invalide");
      return;
    }

    if (form.isPack && !form.packItems.trim()) {
      setError("Ajoute le contenu du pack");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name.trim());
      formData.append("slug", form.slug.trim());
      formData.append("priceCents", String(price));
      formData.append("imageUrl", form.imageUrl.trim());
      formData.append("stock", String(stock));
      formData.append("description", form.description.trim());
      formData.append("category", form.category.trim());

      if (form.subCategory.trim()) {
        formData.append("subCategory", form.subCategory.trim());
      }

      if (form.badge.trim()) {
        formData.append("badge", form.badge.trim());
      }

      if (form.isActive) {
        formData.append("isActive", "on");
      }

      if (form.isPack) {
        formData.append("isPack", "on");
        formData.append("packItems", form.packItems.trim());
      }

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
          badge: "",
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

  return (
    <div style={container}>
      <h1 style={title}>Créer un produit</h1>

      {error && <p style={errorStyle}>❌ {error}</p>}

      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          placeholder="Nom"
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              name: e.target.value,
              slug: generateSlug(e.target.value),
            }))
          }
          style={input}
        />

        <input
          placeholder="Slug"
          value={form.slug}
          onChange={(e) => handleChange("slug", generateSlug(e.target.value))}
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

        {form.imageUrl && (
          <img
            src={form.imageUrl}
            alt="Aperçu produit"
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

        {isOutOfStock && (
          <div style={outOfStockBox}>
            ⚠️ Stock à 0 : le produit sera marqué en rupture côté boutique.
          </div>
        )}

        <select
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
          style={input}
        >
          <option value="vanille">Vanille</option>
          <option value="epices">Épices</option>
          <option value="pack">Pack</option>
        </select>

        <input
          placeholder="Sous-catégorie (optionnel)"
          value={form.subCategory}
          onChange={(e) => handleChange("subCategory", e.target.value)}
          style={input}
        />

        <select
          value={form.badge}
          onChange={(e) => handleChange("badge", e.target.value)}
          style={input}
        >
          <option value="">Aucun badge marketing</option>
          {BADGES.filter(Boolean).map((badge) => (
            <option key={badge} value={badge}>
              {badge}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          style={textarea}
        />

        <label style={checkboxRow}>
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => handleChange("isActive", e.target.checked)}
          />
          {form.isActive ? "Produit actif" : "Produit inactif"}
        </label>

        <label style={checkboxRow}>
          <input
            type="checkbox"
            checked={form.isPack}
            onChange={(e) => handleChange("isPack", e.target.checked)}
          />
          Produit pack
        </label>

        {form.isPack && (
          <textarea
            placeholder="Contenu du pack"
            value={form.packItems}
            onChange={(e) => handleChange("packItems", e.target.value)}
            style={textarea}
          />
        )}

        <button style={btn} disabled={loading}>
          {loading ? "Création..." : "Créer le produit"}
        </button>
      </form>
    </div>
  );
}

/* STYLE */

const container: React.CSSProperties = {
  padding: 30,
};

const title: React.CSSProperties = {
  marginBottom: 20,
};

const errorStyle: React.CSSProperties = {
  color: "#dc2626",
  marginBottom: 15,
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
  maxWidth: 560,
};

const input: React.CSSProperties = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ddd",
  fontSize: 14,
};

const textarea: React.CSSProperties = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ddd",
  minHeight: 90,
  fontSize: 14,
};

const preview: React.CSSProperties = {
  width: "100%",
  maxHeight: 220,
  objectFit: "cover",
  borderRadius: 12,
  border: "1px solid #eee",
};

const checkboxRow: React.CSSProperties = {
  display: "flex",
  gap: 10,
  alignItems: "center",
  fontSize: 14,
  fontWeight: 600,
};

const outOfStockBox: React.CSSProperties = {
  background: "#fff7ed",
  color: "#9a3412",
  border: "1px solid #fed7aa",
  padding: 12,
  borderRadius: 10,
  fontSize: 13,
  fontWeight: 600,
};

const btn: React.CSSProperties = {
  background: "linear-gradient(135deg,#b7791f,#8b5e14)",
  color: "white",
  padding: 14,
  border: "none",
  borderRadius: 10,
  fontWeight: 800,
  cursor: "pointer",
};