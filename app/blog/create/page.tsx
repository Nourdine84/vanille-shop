"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateBlogPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Erreur création article");
      }

      // ✅ SUCCESS
      setSuccess(true);
      e.currentTarget.reset();

      // 🔥 UX PRO → redirect après 1.2s
      setTimeout(() => {
        router.push("/admin/blog");
      }, 1200);

    } catch (err: any) {
      console.error("CREATE BLOG ERROR:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={container}>
      <h1 style={title}>✍️ Créer un article</h1>

      <form onSubmit={handleSubmit} style={form}>
        {/* TITLE */}
        <input
          name="title"
          placeholder="Titre de l’article"
          required
          style={input}
        />

        {/* SLUG */}
        <input
          name="slug"
          placeholder="Slug (optionnel)"
          style={input}
        />

        {/* EXCERPT */}
        <textarea
          name="excerpt"
          placeholder="Résumé (SEO)"
          rows={3}
          style={textarea}
        />

        {/* CONTENT */}
        <textarea
          name="content"
          placeholder="Contenu HTML ou texte"
          rows={10}
          required
          style={textarea}
        />

        {/* IMAGE */}
        <input
          name="coverImage"
          placeholder="URL image (Cloudinary ou local)"
          style={input}
        />

        {/* SUBMIT */}
        <button type="submit" style={button} disabled={loading}>
          {loading ? "Création..." : "Créer l’article"}
        </button>
      </form>

      {/* SUCCESS MODAL */}
      {success && (
        <div style={successModal}>
          ✅ Article créé avec succès
        </div>
      )}
    </div>
  );
}

/* ================= STYLE ================= */

const container: React.CSSProperties = {
  maxWidth: "700px",
  margin: "40px auto",
  padding: "20px",
};

const title: React.CSSProperties = {
  fontSize: "28px",
  marginBottom: "20px",
};

const form: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const input: React.CSSProperties = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
};

const textarea: React.CSSProperties = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
};

const button: React.CSSProperties = {
  background: "#a16207",
  color: "white",
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  fontWeight: 700,
  cursor: "pointer",
};

const successModal: React.CSSProperties = {
  position: "fixed",
  top: 20,
  right: 20,
  background: "#16a34a",
  color: "white",
  padding: "12px 18px",
  borderRadius: "10px",
  fontWeight: 600,
};