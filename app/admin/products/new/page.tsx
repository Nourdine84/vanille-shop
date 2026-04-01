"use client";

import { useState } from "react";

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    priceCents: "",
    imageUrl: "",
    stock: "",
    category: "vanille",
    subCategory: "",
    isActive: true,
  });

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.slug || !form.priceCents) {
      alert("Champs obligatoires manquants");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          priceCents: Number(form.priceCents),
          stock: Number(form.stock || 0),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Produit créé avec succès");
        window.location.href = "/admin/products";
      } else {
        alert(data?.error || "Erreur création");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 600, margin: "auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        🧾 Créer un produit
      </h1>

      <input placeholder="Nom" onChange={(e) => handleChange("name", e.target.value)} style={input} />
      <input placeholder="Slug" onChange={(e) => handleChange("slug", e.target.value)} style={input} />
      <input placeholder="Prix (centimes)" onChange={(e) => handleChange("priceCents", e.target.value)} style={input} />
      <input placeholder="Stock" onChange={(e) => handleChange("stock", e.target.value)} style={input} />
      <input placeholder="Image URL" onChange={(e) => handleChange("imageUrl", e.target.value)} style={input} />
      <input placeholder="Catégorie (vanille / epices)" onChange={(e) => handleChange("category", e.target.value)} style={input} />
      <input placeholder="Sous-catégorie" onChange={(e) => handleChange("subCategory", e.target.value)} style={input} />

      <textarea
        placeholder="Description"
        onChange={(e) => handleChange("description", e.target.value)}
        style={{ ...input, height: 100 }}
      />

      <label style={{ display: "block", marginTop: 10 }}>
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => handleChange("isActive", e.target.checked)}
        />{" "}
        Produit actif
      </label>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={button}
      >
        {loading ? "Création..." : "Créer le produit"}
      </button>
    </div>
  );
}

/* ========================= STYLE ========================= */

const input = {
  display: "block",
  width: "100%",
  marginTop: 10,
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ddd",
};

const button = {
  marginTop: 20,
  padding: 14,
  background: "#a16207",
  color: "white",
  width: "100%",
  borderRadius: 10,
  border: "none",
  fontWeight: 600,
  cursor: "pointer",
};