"use client";

import Link from "next/link";
import { useState } from "react";

type ProductFormState = {
  name: string;
  slug: string;
  priceCents: string;
  imageUrl: string;
  stock: string;
  description: string;
  category: string;
  subCategory: string;
  badge: string;
  isActive: boolean;
  isPack: boolean;
  packItems: string;
};

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

function getBadgeStyle(badge: string): React.CSSProperties {
  switch (badge) {
    case "Promo":
      return {
        background: "#dc2626",
        color: "white",
      };

    case "Premium":
      return {
        background: "#a16207",
        color: "white",
      };

    case "Best Seller":
      return {
        background: "#111827",
        color: "white",
      };

    case "Nouveau":
      return {
        background: "#16a34a",
        color: "white",
      };

    default:
      return {
        background: "#f3f4f6",
        color: "#111",
      };
  }
}

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] =
    useState<ProductFormState>({
      name: "",
      slug: "",
      priceCents: "",
      imageUrl: "",
      stock: "0",
      description: "",
      category: "vanille",
      subCategory: "",
      badge: "",
      isActive: true,
      isPack: false,
      packItems: "",
    });

  const stockNumber = Number(form.stock);

  const isOutOfStock =
    Number.isFinite(stockNumber) &&
    stockNumber <= 0;

  function handleChange<
    K extends keyof ProductFormState
  >(
    key: K,
    value: ProductFormState[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function generateSlug(value: string) {
    return value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (loading) return;

    setError("");

    if (
      !form.name.trim() ||
      !form.slug.trim()
    ) {
      setError("Nom et slug requis");
      return;
    }

    const price = Number(form.priceCents);

    if (
      !Number.isFinite(price) ||
      price <= 0
    ) {
      setError("Prix invalide");
      return;
    }

    if (!form.imageUrl.trim()) {
      setError("Image requise");
      return;
    }

    const stock = Number(form.stock);

    if (
      !Number.isFinite(stock) ||
      stock < 0
    ) {
      setError("Stock invalide");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append(
        "name",
        form.name.trim()
      );

      formData.append(
        "slug",
        form.slug.trim()
      );

      formData.append(
        "priceCents",
        String(price)
      );

      formData.append(
        "imageUrl",
        form.imageUrl.trim()
      );

      formData.append(
        "stock",
        String(stock)
      );

      formData.append(
        "description",
        form.description.trim()
      );

      formData.append(
        "category",
        form.category.trim()
      );

      if (form.badge.trim()) {
        formData.append(
          "badge",
          form.badge.trim()
        );
      }

      if (form.subCategory.trim()) {
        formData.append(
          "subCategory",
          form.subCategory.trim()
        );
      }

      if (form.isActive) {
        formData.append(
          "isActive",
          "on"
        );
      }

      if (form.isPack) {
        formData.append(
          "isPack",
          "on"
        );

        formData.append(
          "packItems",
          form.packItems.trim()
        );
      }

      const res = await fetch(
        "/api/admin/products",
        {
          method: "POST",
          body: formData,
        }
      );

      if (res.ok) {
        window.location.href =
          "/admin/products";
      } else {
        const err = await res
          .json()
          .catch(() => null);

        setError(
          err?.error ||
            "Erreur serveur"
        );
      }
    } catch (err) {
      console.error(err);
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={container}>
      <Link
        href="/admin/products"
        style={backBtn}
      >
        ← Retour catalogue
      </Link>

      <div style={hero}>
        <div>
          <p style={heroTag}>
            VANILLE’OR ADMIN
          </p>

          <h1 style={title}>
            Créer un produit
          </h1>

          <p style={heroText}>
            Ajoutez un produit premium
            à votre catalogue.
          </p>
        </div>
      </div>

      {error && (
        <div style={errorStyle}>
          ❌ {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={formStyle}
      >
        <div style={section}>
          <h3 style={sectionTitle}>
            📦 Informations
          </h3>

          <input
            placeholder="Nom"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                name: e.target.value,
                slug: generateSlug(
                  e.target.value
                ),
              }))
            }
            style={input}
          />

          <input
            placeholder="Slug"
            value={form.slug}
            onChange={(e) =>
              handleChange(
                "slug",
                generateSlug(
                  e.target.value
                )
              )
            }
            style={input}
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              handleChange(
                "description",
                e.target.value
              )
            }
            style={textarea}
          />
        </div>

        <div style={section}>
          <h3 style={sectionTitle}>
            🖼 Média
          </h3>

          <input
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={(e) =>
              handleChange(
                "imageUrl",
                e.target.value
              )
            }
            style={input}
          />

          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="preview"
              style={preview}
            />
          )}
        </div>

        <div style={section}>
          <h3 style={sectionTitle}>
            🏷 Marketing
          </h3>

          <select
            value={form.badge}
            onChange={(e) =>
              handleChange(
                "badge",
                e.target.value
              )
            }
            style={input}
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

          {form.badge && (
            <div
              style={{
                ...badgePreview,
                ...getBadgeStyle(
                  form.badge
                ),
              }}
            >
              {form.badge}
            </div>
          )}
        </div>

        <div style={section}>
          <h3 style={sectionTitle}>
            📊 Stock & catégorie
          </h3>

          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) =>
              handleChange(
                "stock",
                e.target.value
              )
            }
            style={input}
          />

          {isOutOfStock && (
            <div style={warningBox}>
              ⚠️ Produit en rupture
            </div>
          )}

          <select
            value={form.category}
            onChange={(e) =>
              handleChange(
                "category",
                e.target.value
              )
            }
            style={input}
          >
            <option value="vanille">
              Vanille
            </option>

            <option value="epices">
              Épices
            </option>

            <option value="pack">
              Pack
            </option>
          </select>
        </div>

        <div style={section}>
          <h3 style={sectionTitle}>
            💰 Prix
          </h3>

          <input
            type="number"
            placeholder="Prix centimes"
            value={form.priceCents}
            onChange={(e) =>
              handleChange(
                "priceCents",
                e.target.value
              )
            }
            style={input}
          />
        </div>

        <button
          style={btn}
          disabled={loading}
        >
          {loading
            ? "Création..."
            : "Créer le produit"}
        </button>
      </form>
    </div>
  );
}

/* ================= STYLES ================= */

const container: React.CSSProperties = {
  padding: 30,
  background: "#f8f5ef",
  minHeight: "100vh",
};

const backBtn: React.CSSProperties = {
  display: "inline-block",
  marginBottom: 20,
  textDecoration: "none",
  color: "#111",
  fontWeight: 700,
};

const hero: React.CSSProperties = {
  marginBottom: 30,
};

const heroTag: React.CSSProperties = {
  color: "#a16207",
  fontWeight: 800,
  fontSize: 12,
  letterSpacing: "0.08em",
};

const heroText: React.CSSProperties = {
  color: "#666",
};

const title: React.CSSProperties = {
  fontSize: 38,
  margin: "10px 0",
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 20,
  maxWidth: 720,
};

const section: React.CSSProperties = {
  background: "white",
  padding: 24,
  borderRadius: 24,
};

const sectionTitle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 20,
};

const input: React.CSSProperties = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "1px solid #ddd",
  marginBottom: 14,
};

const textarea: React.CSSProperties = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "1px solid #ddd",
  minHeight: 120,
};

const preview: React.CSSProperties = {
  width: "100%",
  borderRadius: 18,
  marginTop: 10,
  maxHeight: 280,
  objectFit: "cover",
};

const badgePreview: React.CSSProperties = {
  display: "inline-block",
  padding: "10px 16px",
  borderRadius: 999,
  fontWeight: 800,
  fontSize: 13,
};

const warningBox: React.CSSProperties = {
  background: "#fff7ed",
  color: "#9a3412",
  padding: 12,
  borderRadius: 12,
  marginBottom: 14,
  fontWeight: 700,
};

const errorStyle: React.CSSProperties = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: 14,
  borderRadius: 12,
  marginBottom: 20,
};

const btn: React.CSSProperties = {
  background:
    "linear-gradient(135deg,#b7791f,#8b5e14)",
  color: "white",
  padding: 16,
  borderRadius: 14,
  border: "none",
  fontWeight: 800,
  cursor: "pointer",
};