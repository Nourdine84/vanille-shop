"use client";

import { useState } from "react";

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

/* 🔥 NORMALISATION IMAGE ULTRA SAFE */
function normalizeImageInput(input: string) {
  const value = input.trim();

  if (!value) return "";

  // URL externe → OK
  if (value.startsWith("http")) return value;

  // 🔥 On garde uniquement le nom du fichier
  const fileName = value
    .replace(/^.*[\\/]/, "") // enlève dossier
    .replace(/^images\//, "")
    .replace(/^products\//, "")
    .replace(/^collections\//, "");

  return fileName;
}

/* =========================
   COMPONENT
========================= */

export default function ProductForm() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  /* =========================
     IMAGE PREVIEW
  ========================= */

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // 🔥 IMPORTANT → nom fichier seulement
    setImageUrl(file.name);
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

    /* 🔥 SLUG SAFE */
    formData.set("slug", generateSlug(slug || name));

    /* 🔥 IMAGE SAFE */
    const normalizedImage = normalizeImageInput(
      formData.get("imageUrl")?.toString() || ""
    );

    formData.set("imageUrl", normalizedImage);

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      let data: any = null;

      try {
        data = await res.json();
      } catch {
        // fallback si redirect serveur
      }

      if (!res.ok) {
        setIsError(true);
        setMessage(data?.error || "Erreur lors de l’enregistrement");
        return;
      }

      /* ✅ SUCCESS */
      setMessage("✅ Produit créé avec succès");
      setIsError(false);

      form.reset();
      setPreview(null);
      setName("");
      setSlug("");
      setImageUrl("");

    } catch (error) {
      console.error("❌ PRODUCT FORM ERROR:", error);
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
        onChange={(e) => setSlug(generateSlug(e.target.value))}
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

      {/* IMAGE UPLOAD */}
      <div style={uploadBox}>
        <input type="file" accept="image/*" onChange={handleImage} />
        {preview && (
          <img src={preview} alt="Preview produit" style={previewImg} />
        )}
      </div>

      {/* IMAGE NAME */}
      <input
        name="imageUrl"
        placeholder="Nom fichier (ex: cannelle.jpg)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        style={input}
      />

      {/* PRIX */}
      <input
        name="priceCents"
        type="number"
        placeholder="Prix en centimes"
        min="1"
        required
        style={input}
      />

      {/* STOCK */}
      <input
        name="stock"
        type="number"
        placeholder="Stock"
        min="0"
        required
        style={input}
      />

      {/* CATEGORY */}
      <select name="category" style={input} defaultValue="vanille">
        <option value="vanille">Vanille</option>
        <option value="epices">Épices</option>
      </select>

      {/* SUB CATEGORY */}
      <input
        name="subCategory"
        placeholder="Sous-catégorie (ex: gourmet)"
        style={input}
      />

      {/* BADGE */}
      <select name="badge" style={input} defaultValue="">
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