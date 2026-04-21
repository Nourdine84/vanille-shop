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

/* ================= CONFIG ================= */

const weightFormats = ["10g", "50g", "100g", "250g", "500g", "1kg"];
const liquidFormats = ["10ml", "50ml", "100ml", "250ml", "500ml", "1L"];

/* ================= COMPONENT ================= */

export default function ProductForm() {
  const [imageUrl, setImageUrl] = useState("");
  const [isPack, setIsPack] = useState(false);
  const [unit, setUnit] = useState<"g" | "ml">("g");
  const [error, setError] = useState("");

  const formats = unit === "g" ? weightFormats : liquidFormats;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const hasImage = String(formData.get("imageUrl") || "").trim().length > 0;
    if (!hasImage) {
      e.preventDefault();
      setError("Une image est requise.");
      return;
    }

    if (isPack) {
      const packPrice = Number(formData.get("price_pack") || 0);
      if (!Number.isFinite(packPrice) || packPrice <= 0) {
        e.preventDefault();
        setError("Un prix unique est requis pour le pack.");
        return;
      }
      return;
    }

    const hasAtLeastOnePrice = formats.some((f) => {
      const value = Number(formData.get(`price_${f}`) || 0);
      return Number.isFinite(value) && value > 0;
    });

    if (!hasAtLeastOnePrice) {
      e.preventDefault();
      setError("Au moins un prix par format est requis.");
    }
  }

  return (
    <form action="/api/admin/products" method="POST" onSubmit={handleSubmit}>
      {error ? <div style={errorBox}>{error}</div> : null}

      <div style={section}>
        <h3>📦 Informations produit</h3>

        <input name="name" placeholder="Nom produit" required style={input} />
        <br />
        <br />

        <input name="slug" placeholder="Slug SEO" required style={input} />
        <br />
        <br />

        <textarea
          name="description"
          placeholder="Description"
          style={{ ...input, minHeight: 100 }}
        />
      </div>

      <div style={section}>
        <h3>🖼 Image produit</h3>

        <ImageUploadField onChange={setImageUrl} />
        <input type="hidden" name="imageUrl" value={imageUrl} />
      </div>

      <div style={section}>
        <h3>📊 Stock</h3>
        <input type="number" name="stock" required style={input} />
      </div>

      <div style={section}>
        <h3>🏷 Catégorie & Badge</h3>

        <select name="category" style={input}>
          <option value="vanille">Vanille</option>
          <option value="epices">Épices</option>
        </select>

        <br />
        <br />

        <select name="badge" style={input}>
          <option value="">Aucun badge</option>
          <option value="Best Seller">🔥 Best Seller</option>
          <option value="Top Vente">🏆 Top Vente</option>
          <option value="Promo">💸 Promo</option>
          <option value="Nouveau">✨ Nouveau</option>
        </select>
      </div>

      <div style={section}>
        <h3>⚖️ Type produit</h3>

        <select
          name="unit"
          value={unit}
          onChange={(e) => setUnit(e.target.value as "g" | "ml")}
          disabled={isPack}
          style={{
            ...input,
            opacity: isPack ? 0.6 : 1,
          }}
        >
          <option value="g">Grammes (g / kg)</option>
          <option value="ml">Liquide (ml / L)</option>
        </select>

        {isPack ? (
          <p style={{ marginTop: 10, color: "#777", fontSize: 13 }}>
            Le type g/ml est désactivé pour un pack. Un pack utilise un prix unique.
          </p>
        ) : null}
      </div>

      <div style={section}>
        <h3>📦 Pack</h3>

        <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            type="checkbox"
            name="isPack"
            onChange={(e) => setIsPack(e.target.checked)}
          />
          Produit pack
        </label>

        {isPack ? (
          <>
            <br />
            <textarea
              name="packItems"
              placeholder="ex: vanille 100g + cacao 50g"
              style={input}
            />

            <br />
            <br />

            <input
              type="number"
              name="price_pack"
              placeholder="Prix unique du pack (centimes)"
              style={input}
            />
          </>
        ) : null}
      </div>

      {!isPack ? (
        <div style={section}>
          <h3>💰 Prix par format (centimes)</h3>

          <div style={grid}>
            {formats.map((f) => (
              <div key={f}>
                <label style={{ fontSize: 12 }}>{f}</label>
                <input
                  type="number"
                  name={`price_${f}`}
                  placeholder="ex: 1299"
                  style={input}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <button style={btn}>Ajouter produit</button>
    </form>
  );
}

/* ================= BTN ================= */

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