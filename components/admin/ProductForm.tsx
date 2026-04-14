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

function normalizeImageInput(input: string) {
  const value = input.trim();
  if (!value) return "";
  if (value.startsWith("http")) return value;

  return value
    .replace(/^.*[\\/]/, "")
    .replace(/^images\//, "")
    .replace(/^products\//, "")
    .replace(/^collections\//, "");
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
  const [isPack, setIsPack] = useState(false);
  const [unit, setUnit] = useState("g");

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    try {
      setLoading(true);
      setMessage("Upload en cours...");
      setIsError(false);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data?.url) {
        throw new Error(data?.error || "Upload échoué");
      }

      setImageUrl(data.url);
      setMessage("✅ Image uploadée");
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage("Erreur upload image");
    } finally {
      setLoading(false);
    }
  }

  function handleNameChange(value: string) {
    setName(value);
    setSlug(generateSlug(value));
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage(null);
    setIsError(false);

    const form = e.currentTarget;
    const formData = new FormData(form);

    formData.set("slug", generateSlug(slug || name));

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
      } catch {}

      if (!res.ok) {
        setIsError(true);
        setMessage(data?.error || "Erreur lors de l’enregistrement");
        return;
      }

      setMessage("✅ Produit créé avec succès");
      form.reset();

      setPreview(null);
      setName("");
      setSlug("");
      setImageUrl("");
      setIsPack(false);
      setUnit("g");
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formGrid}>
      <input
        name="name"
        placeholder="Nom produit"
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
        required
        style={input}
      />

      <input
        name="slug"
        placeholder="Slug"
        value={slug}
        onChange={(e) => setSlug(generateSlug(e.target.value))}
        required
        style={input}
      />

      <input
        name="description"
        placeholder="Description"
        required
        style={{ ...input, gridColumn: "1 / -1" }}
      />

      <div style={uploadBox}>
        <input type="file" accept="image/*" onChange={handleImage} />
        {preview && <img src={preview} alt="Preview" style={previewImg} />}
      </div>

      <input
        name="imageUrl"
        placeholder="URL image"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        style={input}
      />

      <input
        name="priceCents"
        type="number"
        placeholder="Prix en centimes"
        min="1"
        required
        style={input}
      />

      <input
        name="stock"
        type="number"
        placeholder="Stock"
        min="0"
        required
        style={input}
      />

      <select name="category" style={input} defaultValue="vanille">
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
        <option value="Best Seller">⭐ Best Seller</option>
      </select>

      <select
        name="unit"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        style={input}
      >
        <option value="g">Grammes (g)</option>
        <option value="cl">Centilitres (cl)</option>
        <option value="l">Litres (L)</option>
      </select>

      <label style={checkboxRow}>
        <input type="checkbox" name="isActive" defaultChecked />
        Produit actif
      </label>

      <label style={checkboxRow}>
        <input
          type="checkbox"
          name="isPack"
          checked={isPack}
          onChange={(e) => setIsPack(e.target.checked)}
        />
        Produit pack 🎁
      </label>

      {isPack && (
        <textarea
          name="packItems"
          placeholder={
            unit === "g"
              ? "Ex : 10g vanille + 50g cacao + 100g cannelle"
              : unit === "cl"
              ? "Ex : 10cl huile + 25cl extrait + 50cl infusion"
              : "Ex : 1L huile + 1L extrait"
          }
          style={{ ...textarea, gridColumn: "1 / -1" }}
        />
      )}

      <button type="submit" style={button} disabled={loading}>
        {loading ? "Traitement..." : "Créer le produit"}
      </button>

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

const formGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "12px",
};

const input: React.CSSProperties = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const textarea: React.CSSProperties = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  minHeight: 90,
  resize: "vertical",
};

const uploadBox: React.CSSProperties = {
  gridColumn: "1 / -1",
  border: "2px dashed #ccc",
  padding: "15px",
  borderRadius: "10px",
  textAlign: "center",
};

const previewImg: React.CSSProperties = {
  width: "100%",
  maxWidth: "200px",
  marginTop: "10px",
  borderRadius: "10px",
};

const button: React.CSSProperties = {
  gridColumn: "1 / -1",
  background: "#a16207",
  color: "white",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  fontWeight: "bold",
  cursor: "pointer",
};

const checkboxRow: React.CSSProperties = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
};

const messageStyle: React.CSSProperties = {
  gridColumn: "1 / -1",
  textAlign: "center",
  fontWeight: "bold",
};