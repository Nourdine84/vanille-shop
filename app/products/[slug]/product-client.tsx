"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import { useCart } from "@/lib/cart-context";
import { getImageUrl } from "@/lib/image";
import { useUIStore } from "@/components/ui-providers";
import { getProductEditorial } from "@/lib/product-editorial";
import ProductEditorial from "@/components/product/ProductEditorial";

/* ================= TYPES ================= */

type PricingMap = Record<
  string,
  number
>;

type ProductType = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  category?: string | null;
  priceCents: number;
  stock: number;
  pricing?: PricingMap | null;
  isPack?: boolean;
};

type Review = {
  id?: string;
  name?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
};

/* ================= UTILS ================= */

function formatPrice(
  priceCents: number
) {
  return (
    (priceCents / 100)
      .toFixed(2)
      .replace(".", ",") + " €"
  );
}

function renderStars(
  rating: number
) {
  return "★".repeat(rating);
}

/* ================= ORDER FORMATS ================= */

const ORDER = [
  "10g",
  "50g",
  "100g",
  "250g",
  "500g",
  "1kg",
  "10ml",
  "50ml",
  "100ml",
  "1l",
];

/* ================= COMPONENT ================= */

export default function ClientProduct({
  product,
}: {
  product: ProductType & {
    relatedProducts?: ProductType[];
    isOutOfStock?: boolean;
  };
}) {
  const { addToCart } = useCart();
  const { openCart } = useUIStore(); // ← CORRECTION

  if (!product) return null;

  const image = getImageUrl(
    product.imageUrl ||
      "/images/product-placeholder.jpg"
  );

  const isOutOfStock =
    product.stock <= 0;

  /* ================= ÉDITORIAL PREMIUM ================= */
  // Contenu éditorial optionnel, indexé par slug (lib/product-editorial).
  // null si le produit n'a pas encore de couche éditoriale → rien ne s'affiche.
  const editorial = getProductEditorial(product.slug);

  /* ================= RESPONSIVE ================= */

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  /* ================= PRICING ================= */

  const formats = useMemo(() => {
    const raw =
      product.pricing || {
        "100g":
          product.priceCents,
      };

    return Object.entries(raw)
      .map(
        ([label, value]) => ({
          label,
          value: Number(value),
        })
      )
      .filter(
        (f) =>
          !isNaN(f.value) &&
          f.value > 0
      )
      .sort((a, b) => {
        const ia =
          ORDER.indexOf(a.label);

        const ib =
          ORDER.indexOf(b.label);

        return (
          (ia === -1
            ? 999
            : ia) -
          (ib === -1
            ? 999
            : ib)
        );
      });
  }, [product]);

  const [
    selected,
    setSelected,
  ] = useState(
    formats[0]
  );

  /* ================= MODAL ================= */

  const [
    showModal,
    setShowModal,
  ] = useState(false);

  /* ================= REVIEWS ================= */

  const [
    reviews,
    setReviews,
  ] = useState<Review[]>(
    []
  );

  const [form, setForm] =
    useState({
      name: "",
      rating: 5,
      comment: "",
    });

  useEffect(() => {
    fetch(
      `/api/reviews?productId=${product.id}`
    )
      .then((res) =>
        res.json()
      )
      .then(setReviews)
      .catch(() =>
        setReviews([])
      );
  }, [product.id]);

  async function submitReview() {
    try {
      await fetch(
        "/api/reviews",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            productId:
              product.id,

            ...form,
          }),
        }
      );

      setForm({
        name: "",
        rating: 5,
        comment: "",
      });

      const refreshed =
        await fetch(
          `/api/reviews?productId=${product.id}`
        );

      setReviews(
        await refreshed.json()
      );
    } catch (error) {
      console.error(
        "❌ REVIEW ERROR:",
        error
      );
    }
  }

  /* ================= RELATED ================= */

  const [
    related,
    setRelated,
  ] = useState<ProductType[]>(
    []
  );

  useEffect(() => {
    let cancelled = false;

    fetch("/api/products", {
      cache: "no-store",
    })
      .then((res) =>
        res.json()
      )
      .then((data) => {
        if (cancelled)
          return;

        const safe =
          Array.isArray(data)
            ? data.filter(Boolean)
            : [];

        const filtered = safe
          .filter(
            (
              p: ProductType
            ) =>
              p.id !==
                product.id &&
              p.category ===
                product.category &&
              !p.isPack &&
              (p.stock ?? 0) >
                0
          )
          .slice(0, 3);

        setRelated(filtered);
      })
      .catch(() =>
        setRelated([])
      );

    return () => {
      cancelled = true;
    };
  }, [
    product.id,
    product.category,
  ]);

  /* ================= ADD TO CART ================= */

  function handleAddToCart() {
    if (isOutOfStock) {
      setShowModal(true);

      return;
    }

    addToCart({
      id: `${product.id}-${selected.label}`,

      name: `${product.name} (${selected.label})`,

      priceCents:
        selected.value,

      imageUrl:
        image || undefined,

      quantity: 1,
    });

    openCart(); // ← CORRECTION
  }

  /* ================= RENDER ================= */

  return (
    <div style={container}>
      {/* MODAL */}

      {showModal && (
        <div
          style={
            modalOverlay
          }
        >
          <div
            style={modalBox}
          >
            <div
              style={
                modalIcon
              }
            >
              ⚠️
            </div>

            <h3
              style={
                modalTitle
              }
            >
              Produit
              indisponible
            </h3>

            <p
              style={
                modalText
              }
            >
              Ce produit
              est
              actuellement
              en rupture
              de stock.
            </p>

            <button
              style={
                modalBtn
              }
              onClick={() =>
                setShowModal(
                  false
                )
              }
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* HERO */}

      <div
        style={{
          ...topGrid,
          gridTemplateColumns: isMobile
            ? "1fr"
            : topGrid.gridTemplateColumns,
        }}
      >
        {/* IMAGE */}

        <div
          style={
            imageWrapper
          }
        >
          <img
            src={image}
            style={
              mainImage
            }
            alt={
              product.name
            }
          />

          {isOutOfStock && (
            <div
              style={
                outOfStockBadge
              }
            >
              Rupture
            </div>
          )}
        </div>

        {/* INFO */}

        <div>
          <p style={eyebrow}>
            VANILLE'OR
          </p>

          <h1 style={title}>
            {editorial?.title || product.name}
          </h1>

          {editorial?.hook && (
            <p style={hook}>{editorial.hook}</p>
          )}

          <p style={price}>
            {formatPrice(
              selected.value
            )}
          </p>

          <p style={desc}>
            {product.description ||
              "Produit premium Vanille'Or, sélectionné pour sa qualité exceptionnelle."}
          </p>

          {/* SELECTOR */}

          <div
            style={
              selectorWrapper
            }
          >
            <p
              style={
                selectorTitle
              }
            >
              Choisissez
              votre format
            </p>

            <div
              style={
                optionsGrid
              }
            >
              {formats.map(
                (f) => (
                  <button
                    key={
                      f.label
                    }
                    onClick={() =>
                      setSelected(
                        f
                      )
                    }
                    disabled={
                      isOutOfStock
                    }
                    style={{
                      ...optionBtn,

                      opacity:
                        isOutOfStock
                          ? 0.5
                          : 1,

                      cursor:
                        isOutOfStock
                          ? "not-allowed"
                          : "pointer",

                      border:
                        selected.label ===
                        f.label
                          ? "2px solid #a16207"
                          : "1px solid #ddd",

                      background:
                        selected.label ===
                        f.label
                          ? "#fff7ed"
                          : "white",
                    }}
                  >
                    <div>
                      {
                        f.label
                      }
                    </div>

                    <small
                      style={
                        formatPriceMini
                      }
                    >
                      {formatPrice(
                        f.value
                      )}
                    </small>
                  </button>
                )
              )}
            </div>
          </div>

          {/* CTA */}

          <button
            style={{
              ...cta,

              opacity:
                isOutOfStock
                  ? 0.6
                  : 1,

              cursor:
                isOutOfStock
                  ? "not-allowed"
                  : "pointer",
            }}
            disabled={
              isOutOfStock
            }
            onClick={
              handleAddToCart
            }
          >
            {isOutOfStock
              ? "Produit indisponible"
              : "Ajouter au panier"}
          </button>

          {/* TRUST */}

          <div style={trust}>
            <div>
              ✔ Livraison
              rapide
            </div>

            <div>
              ✔ Paiement
              sécurisé
            </div>

            <div>
              ✔ Qualité
              premium
            </div>

            <div>
              ✔ Sélection
              Madagascar
            </div>
          </div>
        </div>
      </div>

      {/* ÉDITORIAL PREMIUM */}

      {editorial && (
        <ProductEditorial editorial={editorial} />
      )}

      {/* CROSS SELL */}

      {related.length >
        0 && (
        <div
          style={
            crossSellWrapper
          }
        >
          <div
            style={
              sectionHeader
            }
          >
            <p
              style={
                sectionEyebrow
              }
            >
              SÉLECTION
            </p>

            <h3
              style={
                crossSellTitle
              }
            >
              Complétez
              votre
              sélection
            </h3>
          </div>

          <div
            style={
              crossSellGrid
            }
          >
            {related.map(
              (p) => (
                <div
                  key={p.id}
                  style={
                    crossSellCard
                  }
                >
                  <Link
                    href={`/products/${p.slug}`}
                  >
                    <img
                      src={getImageUrl(
                        p.imageUrl ||
                          ""
                      )}
                      alt={
                        p.name
                      }
                      style={
                        crossSellImg
                      }
                    />
                  </Link>

                  <div>
                    <p
                      style={
                        crossSellName
                      }
                    >
                      {p.name}
                    </p>

                    <p
                      style={
                        crossSellPrice
                      }
                    >
                      {formatPrice(
                        p.priceCents
                      )}
                    </p>

                    <button
                      style={
                        crossSellBtn
                      }
                      onClick={() => {
                        addToCart({
                          id: p.id,

                          name:
                            p.name,

                          priceCents:
                            p.priceCents,

                          imageUrl:
                            p.imageUrl ||
                            undefined,

                          quantity: 1,
                        });

                        openCart(); // ← CORRECTION
                      }}
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* REVIEWS */}

      <div
        style={
          reviewWrapper
        }
      >
        <div
          style={
            sectionHeader
          }
        >
          <p
            style={
              sectionEyebrow
            }
          >
            AVIS CLIENTS
          </p>

          <h3
            style={
              reviewTitle
            }
          >
            Retours de
            nos clients
          </h3>
        </div>

        {/* FORM */}

        <div
          style={
            reviewForm
          }
        >
          <input
            placeholder="Votre nom"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,

                name:
                  e.target
                    .value,
              })
            }
            style={
              reviewInput
            }
          />

          <select
            value={
              form.rating
            }
            onChange={(e) =>
              setForm({
                ...form,

                rating:
                  Number(
                    e.target
                      .value
                  ),
              })
            }
            style={
              reviewInput
            }
          >
            {[5, 4, 3, 2, 1].map(
              (r) => (
                <option
                  key={r}
                  value={r}
                >
                  {r} étoiles
                </option>
              )
            )}
          </select>

          <textarea
            placeholder="Votre avis..."
            value={
              form.comment
            }
            onChange={(e) =>
              setForm({
                ...form,

                comment:
                  e.target
                    .value,
              })
            }
            style={
              reviewTextarea
            }
          />

          <button
            style={
              reviewBtn
            }
            onClick={
              submitReview
            }
          >
            Publier
            l'avis
          </button>
        </div>

        {/* LIST */}

        <div
          style={
            reviewList
          }
        >
          {reviews.length ===
          0 ? (
            <div
              style={
                emptyReview
              }
            >
              Aucun avis
              pour le
              moment.
            </div>
          ) : (
            reviews.map(
              (
                review,
                index
              ) => (
                <div
                  key={
                    review.id ||
                    index
                  }
                  style={
                    reviewCard
                  }
                >
                  <div
                    style={
                      reviewHeader
                    }
                  >
                    <strong>
                      {review.name ||
                        "Client"}
                    </strong>

                    <span
                      style={
                        stars
                      }
                    >
                      {renderStars(
                        review.rating ||
                          5
                      )}
                    </span>
                  </div>

                  <p
                    style={
                      reviewComment
                    }
                  >
                    {
                      review.comment
                    }
                  </p>
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  maxWidth: 1180,

  margin: "50px auto",

  padding: "0 20px",
};

const topGrid = {
  display: "grid",

  gridTemplateColumns:
    "1fr 1fr",

  gap: 50,

  alignItems: "start",
};

const imageWrapper = {
  position: "relative" as const,
};

const mainImage = {
  width: "100%",

  borderRadius: 28,

  objectFit: "cover" as const,

  background:
    "#f5f5f5",

  boxShadow:
    "0 10px 40px rgba(0,0,0,0.08)",
};

const outOfStockBadge = {
  position: "absolute" as const,

  top: 18,

  left: 18,

  background:
    "#dc2626",

  color: "white",

  padding:
    "10px 16px",

  borderRadius: 999,

  fontWeight: 800,
};

const eyebrow = {
  color: "#a16207",

  fontWeight: 800,

  fontSize: 12,

  letterSpacing:
    "0.12em",

  marginBottom: 10,
};

const title = {
  fontSize: 42,

  lineHeight: 1.1,

  margin: 0,

  fontWeight: 900,
};

const hook = {
  color: "#555",

  marginTop: 14,

  lineHeight: 1.7,

  fontSize: 17,
};

const price = {
  fontSize: 34,

  fontWeight: 900,

  color: "#a16207",

  marginTop: 20,
};

const desc = {
  color: "#555",

  marginTop: 18,

  lineHeight: 1.8,

  fontSize: 15,
};

const selectorWrapper = {
  marginTop: 34,
};

const selectorTitle = {
  marginBottom: 14,

  fontWeight: 700,

  fontSize: 15,
};

const optionsGrid = {
  display: "grid",

  gridTemplateColumns:
    "repeat(3,1fr)",

  gap: 12,
};

const optionBtn = {
  padding: "16px",

  borderRadius: 16,

  background: "white",

  transition:
    "all 0.2s ease",

  fontWeight: 700,
};

const formatPriceMini = {
  display: "block",

  marginTop: 6,

  color: "#777",

  fontSize: 12,
};

const cta = {
  marginTop: 30,

  width: "100%",

  padding: "18px",

  background:
    "linear-gradient(135deg,#b7791f,#8b5e14)",

  color: "white",

  borderRadius: 16,

  border: "none",

  fontWeight: 800,

  fontSize: 16,

  boxShadow:
    "0 10px 24px rgba(183,121,31,0.25)",
};

const trust = {
  marginTop: 22,

  display: "grid",

  gap: 8,

  color: "#555",

  fontSize: 14,

  lineHeight: 1.7,
};

/* MODAL */

const modalOverlay = {
  position: "fixed" as const,

  top: 0,

  left: 0,

  right: 0,

  bottom: 0,

  background:
    "rgba(0,0,0,0.55)",

  display: "flex",

  alignItems: "center",

  justifyContent:
    "center",

  zIndex: 9999,
};

const modalBox = {
  background: "white",

  padding: "34px",

  borderRadius: 24,

  textAlign: "center" as const,

  maxWidth: 380,

  width: "90%",
};

const modalIcon = {
  fontSize: 40,
};

const modalTitle = {
  marginTop: 14,

  marginBottom: 10,
};

const modalText = {
  color: "#666",

  lineHeight: 1.6,
};

const modalBtn = {
  marginTop: 20,

  background:
    "#a16207",

  color: "white",

  padding:
    "12px 22px",

  borderRadius: 12,

  border: "none",

  fontWeight: 700,

  cursor: "pointer",
};

/* CROSS SELL */

const crossSellWrapper = {
  marginTop: 70,
};

const sectionHeader = {
  marginBottom: 24,
};

const sectionEyebrow = {
  color: "#a16207",

  fontSize: 12,

  fontWeight: 800,

  letterSpacing:
    "0.12em",

  marginBottom: 8,
};

const crossSellTitle = {
  fontSize: 28,

  margin: 0,
};

const crossSellGrid = {
  display: "grid",

  gridTemplateColumns:
    "repeat(auto-fit,minmax(240px,1fr))",

  gap: 20,
};

const crossSellCard = {
  background: "white",

  borderRadius: 20,

  padding: 16,

  boxShadow:
    "0 8px 24px rgba(0,0,0,0.05)",
};

const crossSellImg = {
  width: "100%",

  borderRadius: 16,

  aspectRatio: "1 / 1",

  objectFit: "cover" as const,
};

const crossSellName = {
  fontWeight: 800,

  marginTop: 14,

  marginBottom: 8,
};

const crossSellPrice = {
  color: "#a16207",

  fontWeight: 800,

  fontSize: 18,
};

const crossSellBtn = {
  marginTop: 12,

  width: "100%",

  background:
    "#111",

  color: "white",

  border: "none",

  padding: "12px",

  borderRadius: 12,

  fontWeight: 700,

  cursor: "pointer",
};

/* REVIEWS */

const reviewWrapper = {
  marginTop: 80,
};

const reviewTitle = {
  fontSize: 28,

  margin: 0,
};

const reviewForm = {
  background: "white",

  padding: 24,

  borderRadius: 24,

  display: "grid",

  gap: 14,

  boxShadow:
    "0 8px 24px rgba(0,0,0,0.04)",
};

const reviewInput = {
  padding: 14,

  borderRadius: 14,

  border:
    "1px solid #ddd",
};

const reviewTextarea = {
  padding: 14,

  borderRadius: 14,

  border:
    "1px solid #ddd",

  minHeight: 120,

  resize: "vertical" as const,
};

const reviewBtn = {
  background:
    "linear-gradient(135deg,#b7791f,#8b5e14)",

  color: "white",

  border: "none",

  padding: "16px",

  borderRadius: 14,

  fontWeight: 800,

  cursor: "pointer",
};

const reviewList = {
  marginTop: 28,

  display: "grid",

  gap: 18,
};

const emptyReview = {
  background: "white",

  padding: 20,

  borderRadius: 18,

  color: "#777",
};

const reviewCard = {
  background: "white",

  padding: 22,

  borderRadius: 20,

  boxShadow:
    "0 6px 20px rgba(0,0,0,0.04)",
};

const reviewHeader = {
  display: "flex",

  justifyContent:
    "space-between",

  alignItems: "center",

  marginBottom: 12,
};

const stars = {
  color: "#d4af37",

  fontWeight: 700,
};

const reviewComment = {
  color: "#555",

  lineHeight: 1.7,

  margin: 0,
};