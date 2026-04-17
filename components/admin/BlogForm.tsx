"use client";

import { useState } from "react";

type BlogPost = {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
};

export default function BlogForm({
  initialData,
}: {
  initialData?: BlogPost;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [preview, setPreview] = useState<string | null>(
    initialData?.coverImage || null
  );

  const [imageUrl, setImageUrl] = useState(
    initialData?.coverImage || ""
  );

  /* ================= IMAGE UPLOAD ================= */

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

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
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Erreur upload image");
    }
  }

  /* ================= SUBMIT (🔥 FIX) ================= */

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur serveur");
      }

      setSuccess("Article créé avec succès ✨");

      // reset form
      e.currentTarget.reset();
      setPreview(null);
      setImageUrl("");

    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  /* ================= RENDER ================= */

  return (
    <form onSubmit={handleSubmit} style={form}>
      {/* ERROR */}
      {error && <div style={errorBox}>{error}</div>}

      {/* SUCCESS */}
      {success && <div style={successBox}>{success}</div>}

      {/* TITLE */}
      <input
        name="title"
        defaultValue={initialData?.title}
        placeholder="Titre"
        required
        style={input}
      />

      {/* SLUG */}
      <input
        name="slug"
        defaultValue={initialData?.slug}
        placeholder="Slug"
        required
        style={input}
      />

      {/* EXCERPT */}
      <input
        name="excerpt"
        defaultValue={initialData?.excerpt || ""}
        placeholder="Résumé"
        style={input}
      />

      {/* CONTENT */}
      <textarea
        name="content"
        defaultValue={initialData?.content}
        placeholder="Contenu HTML"
        required
        style={textarea}
      />

      {/* IMAGE */}
      <div style={uploadBox}>
        <label style={label}>Image couverture</label>
        <input type="file" accept="image/*" onChange={handleUpload} />
      </div>

      {/* PREVIEW */}
      {preview && <img src={preview} style={previewImg} />}

      {/* URL cachée */}
      <input type="hidden" name="coverImage" value={imageUrl} />

      {/* URL fallback */}
      <input
        placeholder="Ou coller URL image"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        style={input}
      />

      <button style={btn} disabled={loading}>
        {loading
          ? "Enregistrement..."
          : initialData
          ? "Mettre à jour"
          : "Créer article"}
      </button>
    </form>
  );
}

/* ================= STYLE ================= */

const form = { display: "grid", gap: 14 };

const input = {
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ddd",
};

const textarea = {
  minHeight: 160,
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ddd",
};

const btn = {
  background: "linear-gradient(135deg,#b7791f,#8b5e14)",
  color: "white",
  padding: 14,
  borderRadius: 12,
  border: "none",
  fontWeight: "bold",
  cursor: "pointer",
};

const previewImg = {
  width: "100%",
  maxHeight: 240,
  objectFit: "cover" as const,
  borderRadius: 12,
};

const uploadBox = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 6,
};

const label = {
  fontWeight: "600",
};

/* UX PREMIUM */

const errorBox = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: 10,
  borderRadius: 8,
};

const successBox = {
  background: "#dcfce7",
  color: "#166534",
  padding: 10,
  borderRadius: 8,
};