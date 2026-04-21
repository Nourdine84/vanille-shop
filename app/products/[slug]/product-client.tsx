"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { getImageUrl } from "@/lib/image";

/* ================= UTILS ================= */

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

/* ================= ORDER FORMATS ================= */

const ORDER = ["10g", "50g", "100g", "250g", "500g", "1kg", "10ml", "50ml", "100ml", "1l"];

/* ================= COMPONENT ================= */

export default function ClientProduct({ product }: { product: any }) {
  const { addToCart } = useCart();

  if (!product) return null;

  const image = getImageUrl(product.imageUrl);

  /* ================= PRICING CLEAN ================= */

  const formats = useMemo(() => {
    const raw = product.pricing || {
      "100g": product.priceCents,
    };

    return Object.entries(raw)
      .map(([label, value]) => ({
        label,
        value: Number(value),
      }))
      .filter((f) => !isNaN(f.value) && f.value > 0)
      .sort((a, b) => {
        const ia = ORDER.indexOf(a.label);
        const ib = ORDER.indexOf(b.label);
        return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
      });
  }, [product]);

  const [selected, setSelected] = useState(formats[0]);

  /* ================= REVIEWS ================= */

  const [reviews, setReviews] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    fetch(`/api/reviews?productId=${product.id}`)
      .then((res) => res.json())
      .then(setReviews)
      .catch(() => setReviews([]));
  }, [product.id]);

  const submitReview = async () => {
    await fetch("/api/reviews", {
      method: "POST",
      body: JSON.stringify({
        productId: product.id,
        ...form,
      }),
    });

    setForm({ name: "", rating: 5, comment: "" });

    const refreshed = await fetch(`/api/reviews?productId=${product.id}`);
    setReviews(await refreshed.json());
  };

  /* ================= RENDER ================= */

  return (
    <div style={container}>
      <div style={topGrid}>
        {/* IMAGE */}
        <img src={image} style={mainImage} alt={product.name} />

        {/* INFO */}
        <div>
          <h1 style={title}>{product.name}</h1>

          <p style={price}>
            {formatPrice(selected.value)}
          </p>

          <p style={desc}>
            {product.description ||
              "Produit premium VanilleOr, sélectionné pour sa qualité exceptionnelle."}
          </p>

          {/* SELECTEUR PREMIUM */}
          <div style={selectorWrapper}>
            <p style={selectorTitle}>Choisissez votre format</p>

            <div style={optionsGrid}>
              {formats.map((f) => (
                <button
                  key={f.label}
                  onClick={() => setSelected(f)}
                  style={{
                    ...optionBtn,
                    border:
                      selected.label === f.label
                        ? "2px solid #a16207"
                        : "1px solid #ddd",
                    background:
                      selected.label === f.label
                        ? "#fff7ed"
                        : "white",
                    fontWeight:
                      selected.label === f.label ? 700 : 500,
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            style={cta}
            onClick={() =>
              addToCart({
                id: `${product.id}-${selected.label}`,
                name: `${product.name} (${selected.label})`,
                priceCents: selected.value,
                imageUrl: image || undefined,
                quantity: 1,
              })
            }
          >
            Ajouter au panier
          </button>

          {/* TRUST */}
          <div style={trust}>
            ✔ Livraison rapide <br />
            ✔ Paiement sécurisé <br />
            ✔ Qualité premium
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLE ================= */

const container = {
  maxWidth: 1100,
  margin: "40px auto",
  padding: 20,
};

const topGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 40,
};

const mainImage = {
  width: "100%",
  borderRadius: 20,
};

const title = {
  fontSize: 32,
};

const price = {
  fontSize: 30,
  fontWeight: 900,
  color: "#a16207",
};

const desc = {
  color: "#555",
  marginTop: 10,
  lineHeight: 1.6,
};

/* SELECTEUR */

const selectorWrapper = {
  marginTop: 25,
};

const selectorTitle = {
  marginBottom: 10,
  fontWeight: 600,
};

const optionsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: 10,
};

const optionBtn = {
  padding: "14px",
  borderRadius: 12,
  cursor: "pointer",
  transition: "all 0.2s ease",
};

/* CTA */

const cta = {
  marginTop: 25,
  width: "100%",
  padding: "16px",
  background: "linear-gradient(135deg,#b7791f,#8b5e14)",
  color: "white",
  borderRadius: 12,
  border: "none",
  fontWeight: 800,
  fontSize: 16,
  cursor: "pointer",
};

/* TRUST */

const trust = {
  marginTop: 15,
  fontSize: 14,
  color: "#555",
};
