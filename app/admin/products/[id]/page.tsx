"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ImageUploadField from "@/components/admin/ImageUploadField";

/* =========================
   STYLES
========================= */

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

/* =========================
   CONFIG
========================= */

const weightFormats = ["10g", "50g", "100g", "250g", "500g", "1kg"];
const liquidFormats = ["10ml", "50ml", "100ml", "250ml", "500ml", "1L"];

type PricingMap = Record<string, number>;

type ProductState = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  stock: number;
  category: string;
  badge: string | null;
  isActive: boolean;
  isPack: boolean;
  packItems: string | null;
  unit: "g" | "ml";
  priceCents: number;
  pricing: PricingMap;
};

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

function normalizeImage(input: string) {
  if (!input) return "";
  return input.trim();
}

function toNumber(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizePricing(raw: unknown): PricingMap {
  if (!raw || typeof raw !== "object") return {};
  const result: PricingMap = {};

  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    const n = Number(value);
    if (Number.isFinite(n) && n > 0) {
      result[key] = n;
    }
  }

  return result;
}

/* =========================
   PAGE
========================= */

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [product, setProduct] = useState<ProductState | null>(null);
  const [loading, setLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const formats = useMemo(() => {
    if (!product) return weightFormats;
    return product.unit === "g" ? weightFormats : liquidFormats;
  }, [product]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setScreenLoading(true);
        setError("");

        const res = await fetch(`/api/admin/products/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Erreur chargement produit");
        }

        const unit =
          data?.unit === "ml" || data?.unit === "g" ? data.unit : "g";

        const pricing = normalizePricing(data?.pricing);

        setProduct({
          id: data.id,
          name: data.name || "",
          slug: data.slug || "",
          description: data.description || "",
          imageUrl: data.imageUrl || "",
          stock: toNumber(data.stock),
          category: data.category || "vanille",
          badge: data.badge || null,
          isActive: Boolean(data.isActive),
          isPack: Boolean(data.isPack),
          packItems: data.packItems || null,
          unit,
          priceCents: toNumber(data.priceCents),
          pricing,
        });
      } catch (err: any) {
        setError(err?.message || "Erreur chargement produit");
      } finally {
        setScreenLoading(false);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  function setPricingValue(key: string, value: string) {
    if (!product) return;
    const next = { ...product.pricing };
    const n = Number(value);

    if (!value || !Number.isFinite(n) || n <= 0) {
      delete next[key];
    } else {
      next[key] = n;
    }

    setProduct({ ...product, pricing: next });
  }

  async function handleSave() {
    if (!product) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          slug: generateSlug(product.slug || product.name),
          imageUrl: normalizeImage(product.imageUrl),
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error);

      setSuccess("Produit mis à jour avec succès.");

      setTimeout(() => {
        router.push("/admin/products");
      }, 800);

    } catch (err: any) {
      setError(err?.message || "Erreur sauvegarde");
    } finally {
      setLoading(false);
    }
  }

  if (screenLoading) {
    return <div style={{ padding: 40 }}>Chargement...</div>;
  }

  if (!product) {
    return <div style={{ padding: 40 }}>Produit introuvable.</div>;
  }

  return (
    <div style={{ padding: 40, maxWidth: 960 }}>
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>
        ✏️ Modifier produit
      </h1>

      {error && <div style={errorBox}>{error}</div>}
      {success && <div style={successBox}>{success}</div>}

      {/* ================= INFOS ================= */}
      <div style={section}>
        <h3>📦 Informations produit</h3>

        <input
          value={product.name}
          onChange={(e) =>
            setProduct({
              ...product,
              name: e.target.value,
              slug: generateSlug(e.target.value),
            })
          }
          style={input}
        />

        <br /><br />

        <input
          value={product.slug}
          onChange={(e) =>
            setProduct({
              ...product,
              slug: generateSlug(e.target.value),
            })
          }
          style={input}
        />

        <br /><br />

        <textarea
          value={product.description}
          onChange={(e) =>
            setProduct({ ...product, description: e.target.value })
          }
          style={{ ...input, minHeight: 100 }}
        />
      </div>

      {/* ================= IMAGE ================= */}
      <div style={section}>
        <h3>🖼 Image produit</h3>

        <ImageUploadField
          initialUrl={product.imageUrl}
          onChange={(url) =>
            setProduct({ ...product, imageUrl: url })
          }
        />

        {/* 🔥 PREVIEW */}
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            style={{
              width: "100%",
              maxHeight: 200,
              objectFit: "cover",
              borderRadius: 12,
              marginTop: 12,
            }}
          />
        )}
      </div>

      {/* ================= STOCK ================= */}
      <div style={section}>
        <h3>📊 Stock</h3>

        <input
          type="number"
          value={product.stock}
          onChange={(e) =>
            setProduct({
              ...product,
              stock: Number(e.target.value),
            })
          }
          style={input}
        />
      </div>

      {/* ================= STATUS ================= */}
      <div style={section}>
        <h3>🔄 Statut produit</h3>

        <label style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={product.isActive}
            onChange={(e) =>
              setProduct({
                ...product,
                isActive: e.target.checked,
              })
            }
          />

          <span
            style={{
              fontWeight: 600,
              color: product.isActive ? "#16a34a" : "#dc2626",
            }}
          >
            {product.isActive ? "Produit ACTIF" : "Produit INACTIF"}
          </span>
        </label>
      </div>

      <button onClick={handleSave} style={btn}>
        {loading ? "Enregistrement..." : "💾 Sauvegarder"}
      </button>
    </div>
  );
}