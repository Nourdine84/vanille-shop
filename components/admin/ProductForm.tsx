"use client";

import { useState } from "react";

/* =========================
   UTILS
========================= */

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProductForm() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  /* =========================
     IMAGE
  ========================= */

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPreview(base64);
    };

    reader.readAsDataURL(file);
  }

  /* =========================
     AUTO SLUG
  ========================= */

  function handleNameChange(value: string) {
    setName(value);
    setSlug(generateSlug(value));
  }

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage(null);
    setIsError(false);

    const form = e.currentTarget;
    const formData = new FormData(form);

    /* 🔥 IMAGE SAFE */
    if (preview) {
      formData.set("imageUrl", preview);
    }

    /* 🔥 NORMALISATION IMAGE */
    const imageUrl = formData.get("imageUrl")?.toString() || "";
    if (imageUrl && !imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {
      formData.set("imageUrl", `/products/${imageUrl}`);
    }

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setIsError(true);
        setMessage(data.error || "Erreur");
        return;
      }

      setMessage("Produit créé avec succès");
      setIsError(false);

      form.reset();
      setPreview(null);
      setName("");
      setSlug("");

    } catch (error) {
      setIsError(true);
      setMessage("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <form onSubmit={handleSubmit} style={formGrid}>
      
      {/* NOM */}
      <input
        name="name"
        placeholder="Nom produit"
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
        required
        style={input}
      />

      {/* SLUG */}
      <input
        name="slug"
        placeholder="Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        required
        style={input}
      />

      {/* DESCRIPTION */}
      <input
        name="description"
        placeholder="Description"
        required
        style={{ ...input, gridColumn: "1 / -1" }}
      />

      {/* IMAGE */}
      <div style={uploadBox}>
        <input type="file" accept="image/*" onChange={handleImage} />
        {preview && <img src={preview} style={previewImg} />}
      </div>

      <input
        name="imageUrl"
        placeholder="Nom fichier (ex: vanille.jpg)"
        style={input}
      />

      {/* PRIX */}
      <input
        name="priceCents"
        type="number"
        placeholder="Prix en centimes"
        required
        style={input}
      />

      {/* STOCK */}
      <input
        name="stock"
        type="number"
        placeholder="Stock"
        required
        style={input}
      />

      {/* CATEGORY */}
      <select name="category" style={input}>
        <option value="vanille">Vanille</option>
        <option value="epices">Épices</option>
      </select>

      {/* SUB CATEGORY */}
      <input
        name="subCategory"
        placeholder="Sous-catégorie (ex: gourmet)"
        style={input}
      />

      {/* 🔥 COLLECTION */}
      <select name="collection" style={input}>
        <option value="">Collection</option>
        <option value="premium">Premium</option>
        <option value="pro">Professionnel</option>
        <option value="gourmet">Gourmet</option>
      </select>

      {/* BADGE */}
      <select name="badge" style={input}>
        <option value="">Aucun badge</option>
        <option value="Nouveau">🔥 Nouveau</option>
        <option value="Promo">💸 Promo</option>
        <option value="Best Seller">⭐ Best Seller</option>
        <option value="Top Vente">🚀 Top vente</option>
      </select>

      {/* ACTIVE */}
      <label style={checkboxRow}>
        <input type="checkbox" name="isActive" defaultChecked />
        Produit actif
      </label>

      {/* SUBMIT */}
      <button type="submit" style={button} disabled={loading}>
        {loading ? "Enregistrement..." : "Créer le produit"}
      </button>

      {/* MESSAGE */}
      {message && (
        <p
          style={{
            ...messageStyle,
            color: isError ? "#dc2626" : "#16a34a",
          }}
        >
          {message}
        </p>
      )}
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
  cursor: "pointer",
};

const checkboxRow = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
};

const messageStyle = {
  gridColumn: "1 / -1",
  textAlign: "center" as const,
  fontWeight: "bold",
};