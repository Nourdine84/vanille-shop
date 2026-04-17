"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { getImageUrl } from "@/lib/image";

/* ================= UTILS ================= */

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

/* ================= COMPONENT ================= */

export default function ClientProduct({ product }: { product: any }) {
  const { addToCart } = useCart();

  if (!product) return null;

  const image = getImageUrl(product.imageUrl);

  /* ================= GRAMMAGE PREMIUM ================= */

  const weights = [
    { label: "10g", multiplier: 1 },
    { label: "50g", multiplier: 5 },
    { label: "100g", multiplier: 10 },
    { label: "250g", multiplier: 25 },
    { label: "500g", multiplier: 50 },
    { label: "1kg", multiplier: 100 },
  ];

  const basePrice = product.priceCents || 0;

  const [selected, setSelected] = useState(weights[2]); // 100g par défaut

  const dynamicPrice = basePrice * selected.multiplier;

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

    const refreshed = await fetch(
      `/api/reviews?productId=${product.id}`
    );
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
            {formatPrice(dynamicPrice)}
          </p>

          <p style={desc}>
            {product.description ||
              "Produit premium VanilleOr, sélectionné pour sa qualité exceptionnelle."}
          </p>

          {/* SELECTEUR PREMIUM */}
          <div style={optionsWrapper}>
            <p style={optionTitle}>Choisissez votre format</p>

            <div style={optionsGrid}>
              {weights.map((w) => (
                <button
                  key={w.label}
                  onClick={() => setSelected(w)}
                  style={{
                    ...optionBtn,
                    border:
                      selected.label === w.label
                        ? "2px solid #a16207"
                        : "1px solid #ddd",
                    background:
                      selected.label === w.label
                        ? "#fff7ed"
                        : "white",
                  }}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* CTA PREMIUM */}
          <button
            style={cta}
            onClick={() =>
              addToCart({
                id: `${product.id}-${selected.label}`,
                name: `${product.name} (${selected.label})`,
                priceCents: dynamicPrice,
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

      {/* ================= AVIS ================= */}

      <div style={reviewsSection}>
        <h2>⭐ Avis clients</h2>

        {reviews.length === 0 && (
          <p style={{ color: "#777" }}>
            Aucun avis pour le moment.
          </p>
        )}

        <div style={reviewsGrid}>
          {reviews.map((r) => (
            <div key={r.id} style={reviewCard}>
              <strong>{r.name}</strong>
              <p>{"★".repeat(r.rating)}</p>
              <p>{r.comment}</p>
            </div>
          ))}
        </div>

        <div style={reviewForm}>
          <h3>Laisser un avis</h3>

          <input
            placeholder="Nom"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <textarea
            placeholder="Votre avis"
            value={form.comment}
            onChange={(e) =>
              setForm({ ...form, comment: e.target.value })
            }
          />

          <button onClick={submitReview} style={cta}>
            Publier
          </button>
        </div>
      </div>

      {/* ================= CROSS SELL ================= */}

      {product.relatedProducts?.length > 0 && (
        <div style={crossSell}>
          <h2>🔥 Vous pourriez aussi aimer</h2>

          <div style={crossGrid}>
            {product.relatedProducts.map((p: any) => (
              <Link key={p.id} href={`/products/${p.slug}`} style={crossCard}>
                <img
                  src={getImageUrl(p.imageUrl)}
                  style={crossImg}
                />
                <div style={crossContent}>
                  <h4>{p.name}</h4>
                  <p>{formatPrice(p.priceCents)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
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
  fontSize: 28,
  fontWeight: 900,
  color: "#a16207",
};

const desc = {
  color: "#555",
  marginTop: 10,
  lineHeight: 1.6,
};

/* SELECTEUR */

const optionsWrapper = {
  marginTop: 25,
};

const optionTitle = {
  marginBottom: 10,
  fontWeight: 600,
};

const optionsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: 10,
};

const optionBtn = {
  padding: "12px",
  borderRadius: 10,
  cursor: "pointer",
  fontWeight: 600,
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

/* REVIEWS */

const reviewsSection = {
  marginTop: 60,
};

const reviewsGrid = {
  display: "grid",
  gap: 20,
};

const reviewCard = {
  background: "white",
  padding: 15,
  borderRadius: 10,
};

const reviewForm = {
  marginTop: 30,
  display: "flex",
  flexDirection: "column" as const,
  gap: 10,
};

/* CROSS SELL */

const crossSell = {
  marginTop: 60,
};

const crossGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
  gap: 20,
};

const crossCard = {
  background: "white",
  borderRadius: 12,
  overflow: "hidden",
  textDecoration: "none",
  color: "#111",
};

const crossImg = {
  width: "100%",
  height: 160,
  objectFit: "cover" as const,
};

const crossContent = {
  padding: 10,
};