"use client";

import { useState } from "react";
import ImageUploadField from "./ImageUploadField";

/* ================= STYLES ================= */

const input: React.CSSProperties = {
  padding: "12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  width: "100%",
};

const section: React.CSSProperties = {
  background: "white",
  padding: 20,
  borderRadius: 16,
  marginBottom: 20,
  boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
  gap: 10,
};

const errorBox: React.CSSProperties = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: 12,
  borderRadius: 12,
  marginBottom: 16,
};

const successBox: React.CSSProperties = {
  background: "#dcfce7",
  color: "#166534",
  padding: 12,
  borderRadius: 12,
  marginBottom: 16,
};

const btn: React.CSSProperties = {
  width: "100%",
  padding: 16,
  background: "linear-gradient(135deg,#b7791f,#8b5e14)",
  color: "white",
  borderRadius: 12,
  border: "none",
  fontWeight: 800,
  cursor: "pointer",
};

/* ================= CONFIG ================= */

const weightFormats = [
  "10g",
  "50g",
  "100g",
  "250g",
  "500g",
  "1kg",
];

const liquidFormats = [
  "10ml",
  "50ml",
  "100ml",
  "250ml",
  "500ml",
  "1L",
];

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

/* ================= UTILS ================= */

function generateSlug(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* ================= COMPONENT ================= */

export default function ProductForm() {
  const [imageUrl, setImageUrl] = useState("");
  const [isPack, setIsPack] = useState(false);
  const [unit, setUnit] = useState<"g" | "ml">("g");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const formats =
    unit === "g"
      ? weightFormats
      : liquidFormats;

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (loading) return;

    setError("");
    setSuccess("");

    const form = e.currentTarget;

    const formData = new FormData(form);

    const hasImage =
      String(
        formData.get("imageUrl") || ""
      ).trim().length > 0;

    if (!hasImage) {
      setError("Une image est requise.");
      return;
    }

    if (isPack) {
      const price = Number(
        formData.get("priceCents") || 0
      );

      if (
        !Number.isFinite(price) ||
        price <= 0
      ) {
        setError("Prix pack invalide.");
        return;
      }
    } else {
      const hasPrice = formats.some((f) => {
        const value = Number(
          formData.get(`price_${f}`) || 0
        );

        return value > 0;
      });

      if (!hasPrice) {
        setError(
          "Ajoute au moins un prix."
        );
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch(
        "/api/admin/products",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const err = await res.json();

        throw new Error(
          err?.error || "Erreur"
        );
      }

      setSuccess(
        "Produit créé avec succès 🎉"
      );

      form.reset();

      setImageUrl("");
      setIsPack(false);
      setUnit("g");
      setName("");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="hidden"
        name="isActive"
        value="true"
      />

      {error && (
        <div style={errorBox}>
          {error}
        </div>
      )}

      {success && (
        <div style={successBox}>
          {success}
        </div>
      )}

      {/* INFOS */}
      <div style={section}>
        <h3>
          📦 Informations produit
        </h3>

        <input
          name="name"
          placeholder="Nom produit"
          required
          style={input}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <br />
        <br />

        <input
          name="slug"
          value={generateSlug(name)}
          readOnly
          style={{
            ...input,
            background: "#f3f4f6",
          }}
        />

        <br />
        <br />

        <textarea
          name="description"
          placeholder="Description"
          style={{
            ...input,
            minHeight: 100,
          }}
        />
      </div>

      {/* IMAGE */}
      <div style={section}>
        <h3>🖼 Image</h3>

        <ImageUploadField
          onChange={setImageUrl}
        />

        <input
          type="hidden"
          name="imageUrl"
          value={imageUrl}
        />
      </div>

      {/* BADGE */}
      <div style={section}>
        <h3>
          🏷 Badge marketing
        </h3>

        <select
          name="badge"
          style={input}
          defaultValue=""
        >
          <option value="">
            Aucun badge
          </option>

          {BADGES.filter(Boolean).map(
            (badge) => (
              <option
                key={badge}
                value={badge}
              >
                {badge}
              </option>
            )
          )}
        </select>
      </div>

      {/* STOCK */}
      <div style={section}>
        <h3>📊 Stock</h3>

        <input
          type="number"
          name="stock"
          required
          style={input}
        />
      </div>

      {/* TYPE */}
      <div style={section}>
        <h3>⚖️ Type</h3>

        <select
          name="unit"
          value={unit}
          onChange={(e) =>
            setUnit(
              e.target.value as "g" | "ml"
            )
          }
          disabled={isPack}
          style={input}
        >
          <option value="g">
            Grammes
          </option>

          <option value="ml">
            Liquide
          </option>
        </select>
      </div>

      {/* PACK */}
      <div style={section}>
        <label>
          <input
            type="checkbox"
            name="isPack"
            onChange={(e) =>
              setIsPack(
                e.target.checked
              )
            }
          />{" "}
          Pack
        </label>

        {isPack && (
          <>
            <br />
            <br />

            <textarea
              name="packItems"
              placeholder="Contenu du pack"
              style={input}
            />

            <br />
            <br />

            <input
              name="priceCents"
              type="number"
              placeholder="Prix pack (centimes)"
              style={input}
            />
          </>
        )}
      </div>

      {/* PRICES */}
      {!isPack && (
        <div style={section}>
          <h3>💰 Prix</h3>

          <div style={grid}>
            {formats.map((f) => (
              <input
                key={f}
                name={`price_${f}`}
                placeholder={f}
                style={input}
              />
            ))}
          </div>
        </div>
      )}

      <button style={btn}>
        {loading
          ? "Création..."
          : "Créer produit"}
      </button>
    </form>
  );
}