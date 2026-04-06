"use client";

import { useState } from "react";

export default function ProductForm() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  /* =========================
     IMAGE HANDLER
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
     SUBMIT (🔥 VERSION PRO)
  ========================= */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage(null);
    setIsError(false);

    const form = e.currentTarget;
    const formData = new FormData(form);

    // inject preview image si présent
    if (preview) {
      formData.set("imageUrl", preview);
    }

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setIsError(true);
        setMessage(data.error || "Erreur lors de la création");
        return;
      }

      setMessage("Produit créé avec succès");
      setIsError(false);

      form.reset();
      setPreview(null);

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
      <input name="name" placeholder="Nom produit" required style={input} />
      <input name="slug" placeholder="Slug (URL)" required style={input} />

      <input
        name="description"
        placeholder="Description"
        required
        style={input}
      />

      {/* IMAGE */}
      <div style={uploadBox}>
        <input type="file" accept="image/*" onChange={handleImage} />
        {preview && <img src={preview} style={previewImg} />}
      </div>

      <input
        name="imageUrl"
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

      <select name="category" style={input}>
        <option value="vanille">Vanille</option>
        <option value="epices">Épices</option>
      </select>

      <input
        name="subCategory"
        placeholder="Sous-catégorie"
        style={input}
      />

      <select name="badge" style={input}>
        <option value="">Aucun badge</option>
        <option value="Nouveau">🔥 Nouveau</option>
        <option value="Promo">💸 Promo</option>
        <option value="Best-seller">⭐ Best Seller</option>
      </select>

      <label style={checkboxRow}>
        <input type="checkbox" name="isActive" defaultChecked />
        Produit actif
      </label>

      <button type="submit" style={button} disabled={loading}>
        {loading ? "Création..." : "Créer le produit"}
      </button>

      {/* MESSAGE UX */}
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
