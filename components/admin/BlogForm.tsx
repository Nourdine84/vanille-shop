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
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  }

  /* ================= SUBMIT ================= */

  const action = "/api/admin/blog";

  return (
    <form
      action={action}
      method="POST"
      encType="multipart/form-data"
      onSubmit={() => setLoading(true)}
      style={form}
    >
      {/* ID (EDIT) */}
      {initialData?.id && (
        <input type="hidden" name="id" value={initialData.id} />
      )}

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

      {/* URL */}
      <input type="hidden" name="coverImage" value={imageUrl} />

      <input
        placeholder="Ou coller URL image"
        defaultValue={imageUrl}
        style={input}
        onChange={(e) => setImageUrl(e.target.value)}
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

/* STYLE */

const form = { display: "grid", gap: 14 };

const input = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
};

const textarea = {
  minHeight: 160,
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
};

const btn = {
  background: "#a16207",
  color: "white",
  padding: 12,
  borderRadius: 10,
  border: "none",
  fontWeight: "bold",
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