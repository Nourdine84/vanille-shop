"use client";

import { useState } from "react";

export default function BlogForm() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  /* ================= UPLOAD CLOUDINARY ================= */

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // preview immédiat
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();

      if (json.url) {
        setImageUrl(json.url);
      } else {
        console.error("Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  }

  /* ================= SUBMIT ================= */

  function handleSubmit() {
    setLoading(true);
  }

  return (
    <form
      action="/api/admin/blog"
      method="POST"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
      style={form}
    >
      {/* TITRE */}
      <input name="title" placeholder="Titre" required style={input} />

      {/* SLUG */}
      <input name="slug" placeholder="Slug (SEO)" required style={input} />

      {/* EXCERPT */}
      <input name="excerpt" placeholder="Résumé" style={input} />

      {/* CONTENT */}
      <textarea
        name="content"
        placeholder="Contenu HTML (éditeur riche)"
        required
        style={textarea}
      />

      {/* 🔥 UPLOAD IMAGE */}
      <div style={uploadBox}>
        <label style={uploadLabel}>Image couverture</label>

        <input type="file" accept="image/*" onChange={handleUpload} />
      </div>

      {/* PREVIEW */}
      {preview && (
        <img src={preview} style={previewImg} />
      )}

      {/* 🔥 URL IMAGE AUTO */}
      <input type="hidden" name="coverImage" value={imageUrl} />

      {/* FALLBACK MANUEL */}
      <input
        placeholder="Ou coller une URL image"
        style={input}
        onChange={(e) => setImageUrl(e.target.value)}
      />

      {/* SUBMIT */}
      <button type="submit" style={btn} disabled={loading}>
        {loading ? "Création en cours..." : "Créer article"}
      </button>
    </form>
  );
}

/* ================= STYLE ================= */

const form = {
  display: "grid",
  gap: 14,
};

const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const textarea = {
  minHeight: "140px",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const btn = {
  background: "#a16207",
  color: "white",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  fontWeight: "bold",
  cursor: "pointer",
};

const previewImg = {
  width: "100%",
  maxHeight: "220px",
  objectFit: "cover" as const,
  borderRadius: "12px",
};

const uploadBox = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "6px",
};

const uploadLabel = {
  fontWeight: "600",
};