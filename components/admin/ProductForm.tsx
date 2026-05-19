"use client";

import { useState } from "react";
import ImageUploadField from "./ImageUploadField";

/* ================= STYLES ================= */

const input: React.CSSProperties = {
  padding: "12px",
  borderRadius: 10,
  border: "1px solid #ddd",
  width: "100%",
  background: "white",
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
  gridTemplateColumns:
    "repeat(auto-fit,minmax(120px,1fr))",
  gap: 10,
};

const errorBox: React.CSSProperties = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: 12,
  borderRadius: 12,
  marginBottom: 16,
  fontWeight: 700,
};

const successBox: React.CSSProperties = {
  background: "#dcfce7",
  color: "#166534",
  padding: 12,
  borderRadius: 12,
  marginBottom: 16,
  fontWeight: 700,
};

const btn: React.CSSProperties = {
  width: "100%",
  padding: 16,
  background:
    "linear-gradient(135deg,#b7791f,#8b5e14)",
  color: "white",
  borderRadius: 12,
  border: "none",
  fontWeight: 800,
  cursor: "pointer",
  fontSize: 15,
};

const label: React.CSSProperties = {
  display: "block",
  marginBottom: 10,
  fontWeight: 700,
};

const helper: React.CSSProperties = {
  color: "#666",
  fontSize: 13,
  marginTop: 8,
};

const title: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 18,
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
  const [imageUrl, setImageUrl] =
    useState("");

  const [isPack, setIsPack] =
    useState(false);

  const [unit, setUnit] =
    useState<"g" | "ml">("g");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [name, setName] =
    useState("");

  const [category, setCategory] =
    useState("vanille");

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
      setError(
        "Une image produit est requise."
      );

      return;
    }

    const stock = Number(
      formData.get("stock") || 0
    );

    if (
      !Number.isFinite(stock) ||
      stock < 0
    ) {
      setError("Stock invalide.");

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
        setError(
          "Prix pack invalide."
        );

        return;
      }
    } else {
      const hasPrice = formats.some(
        (f) => {
          const value = Number(
            formData.get(
              `price_${f}`
            ) || 0
          );

          return value > 0;
        }
      );

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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.error ||
            "Erreur serveur"
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
      setCategory("vanille");

    } catch (err: any) {
      setError(
        err?.message ||
          "Erreur inconnue"
      );
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
        <h3 style={title}>
          📦 Informations produit
        </h3>

        <label style={label}>
          Nom produit
        </label>

        <input
          name="name"
          placeholder="Ex : Vanille Gourmet"
          required
          style={input}
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <br />
        <br />

        <label style={label}>
          Slug auto généré
        </label>

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

        <label style={label}>
          Description
        </label>

        <textarea
          name="description"
          placeholder="Description produit..."
          style={{
            ...input,
            minHeight: 120,
            resize: "vertical",
          }}
        />
      </div>

      {/* CATEGORY */}

      <div style={section}>
        <h3 style={title}>
          🗂 Catégorie produit
        </h3>

        <select
          name="category"
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
          style={input}
        >
          <option value="vanille">
            🌿 Vanille
          </option>

          <option value="epices">
            🌶 Épices
          </option>

          <option value="pack">
            🎁 Pack
          </option>
        </select>

        <p style={helper}>
          Cette catégorie permettra
          le tri et l’affichage
          automatique sur le site.
        </p>
      </div>

      {/* IMAGE */}

      <div style={section}>
        <h3 style={title}>
          🖼 Image produit
        </h3>

        <ImageUploadField
          onChange={setImageUrl}
        />

        <input
          type="hidden"
          name="imageUrl"
          value={imageUrl}
        />

        <p style={helper}>
          Utilise une image premium
          optimisée pour le catalogue.
        </p>
      </div>

      {/* BADGE */}

      <div style={section}>
        <h3 style={title}>
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
        <h3 style={title}>
          📊 Stock
        </h3>

        <input
          type="number"
          name="stock"
          required
          min="0"
          placeholder="Ex : 25"
          style={input}
        />
      </div>

      {/* TYPE */}

      <div style={section}>
        <h3 style={title}>
          ⚖️ Type produit
        </h3>

        <select
          name="unit"
          value={unit}
          onChange={(e) =>
            setUnit(
              e.target.value as
                | "g"
                | "ml"
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
        <h3 style={title}>
          🎁 Produit pack
        </h3>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontWeight: 700,
          }}
        >
          <input
            type="checkbox"
            name="isPack"
            checked={isPack}
            onChange={(e) => {
              const checked =
                e.target.checked;

              setIsPack(checked);

              if (checked) {
                setCategory("pack");
              }
            }}
          />

          Ce produit est un pack
        </label>

        {isPack && (
          <>
            <br />

            <textarea
              name="packItems"
              placeholder="Contenu du pack..."
              style={{
                ...input,
                minHeight: 100,
              }}
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
          <h3 style={title}>
            💰 Prix par format
          </h3>

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

      {/* SUBMIT */}

      <button
        style={btn}
        disabled={loading}
      >
        {loading
          ? "Création..."
          : "Créer produit"}
      </button>
    </form>
  );
}