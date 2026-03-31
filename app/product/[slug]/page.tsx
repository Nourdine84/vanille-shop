"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useUIStore } from "@/components/ui-provider";

type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl?: string;
  stock: number;
  slug?: string;
};

type PackOption = {
  label: string;
  multiplier: number;
  description: string;
};

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

const PACKS: PackOption[] = [
  { label: "100g", multiplier: 1, description: "Format découverte" },
  { label: "250g", multiplier: 2.2, description: "Le plus équilibré" },
  { label: "500g", multiplier: 4, description: "Pour usage régulier" },
  { label: "1kg", multiplier: 7.5, description: "Format professionnel" },
];

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [mounted, setMounted] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [selectedPack, setSelectedPack] = useState<PackOption>(PACKS[0]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { openCart } = useUIStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        setLoading(true);

        const res = await fetch(`/api/products/${params.slug}`);
        const data = await res.json();

        if (!active) return;
        setProduct(data);
      } catch (error) {
        console.error("❌ Product fetch error:", error);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [params.slug]);

  const currentPrice = useMemo(() => {
    if (!product) return 0;
    return Math.round(product.priceCents * selectedPack.multiplier);
  }, [product, selectedPack]);

  if (!mounted || loading) {
    return <div style={loadingBox}>Chargement...</div>;
  }

  if (!product) {
    return <div style={loadingBox}>Produit introuvable</div>;
  }

  const isOut = product.stock <= 0;

  return (
    <div style={page}>
      <div style={container}>
        <section style={hero}>
          <div style={mediaCol}>
            <div style={imageWrap}>
              <img
                src={product.imageUrl || "/images/product-vanille.jpg"}
                alt={product.name}
                style={image}
              />

              {isOut && <div style={badgeOut}>Épuisé</div>}
              {!isOut && product.stock <= 5 && (
                <div style={badgeStock}>Stock limité</div>
              )}
            </div>
          </div>

          <div style={contentCol}>
            <p style={eyebrow}>Vanille’Or • Sélection premium</p>

            <h1 style={title}>{product.name}</h1>

            <p style={subtitle}>Vanille premium de Madagascar</p>

            <p style={price}>{formatPrice(currentPrice)}</p>

            <p style={desc}>{product.description}</p>

            <div style={trustRow}>
              <span style={trustItem}>🌿 Origine Madagascar</span>
              <span style={trustItem}>👨‍🍳 Qualité professionnelle</span>
              <span style={trustItem}>🚚 Livraison rapide</span>
            </div>

            <div style={sectionCard}>
              <p style={sectionLabel}>Choisissez votre format</p>

              <div style={packGrid}>
                {PACKS.map((pack) => (
                  <button
                    key={pack.label}
                    type="button"
                    onClick={() => setSelectedPack(pack)}
                    style={{
                      ...packBtn,
                      border:
                        selectedPack.label === pack.label
                          ? "2px solid #a16207"
                          : "1px solid #ddd",
                      background:
                        selectedPack.label === pack.label ? "#fffaf1" : "white",
                    }}
                  >
                    <strong style={packTitle}>{pack.label}</strong>
                    <span style={packDesc}>{pack.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {!isOut && (
              <div style={sectionCard}>
                <p style={sectionLabel}>Quantité</p>

                <div style={qtyRow}>
                  <button
                    type="button"
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    style={qtyBtn}
                    aria-label="Diminuer la quantité"
                  >
                    −
                  </button>

                  <span style={qtyValue}>{qty}</span>

                  <button
                    type="button"
                    onClick={() => setQty((prev) => prev + 1)}
                    style={qtyBtn}
                    aria-label="Augmenter la quantité"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={isOut}
              onClick={() => {
                if (isOut) return;

                addToCart({
                  id: `${product.id}-${selectedPack.label}`,
                  name: `${product.name} • ${selectedPack.label}`,
                  priceCents: currentPrice,
                  quantity: qty,
                  imageUrl: product.imageUrl || "/images/product-vanille.jpg",
                });

                openCart();
              }}
              style={{
                ...cta,
                background: isOut ? "#999" : "#a16207",
                cursor: isOut ? "not-allowed" : "pointer",
              }}
            >
              {isOut ? "Indisponible" : "Ajouter au panier"}
            </button>

            <p style={shipping}>🚚 Livraison offerte dès 50€</p>
          </div>
        </section>

        <section style={section}>
          <h2 style={sectionTitle}>Pourquoi choisir Vanille’Or ?</h2>

          <div style={featureGrid}>
            <div style={featureCard}>
              <h3 style={featureTitle}>Sélection premium</h3>
              <p style={featureText}>
                Nous retenons uniquement des produits à fort potentiel aromatique
                pour garantir une expérience riche, intense et régulière.
              </p>
            </div>

            <div style={featureCard}>
              <h3 style={featureTitle}>Lien direct avec Madagascar</h3>
              <p style={featureText}>
                Une relation de confiance avec les producteurs pour préserver la
                qualité, la traçabilité et la cohérence du produit.
              </p>
            </div>

            <div style={featureCard}>
              <h3 style={featureTitle}>Pensé pour les pros et passionnés</h3>
              <p style={featureText}>
                Du format découverte aux besoins plus importants, notre gamme
                accompagne aussi bien les particuliers que les professionnels.
              </p>
            </div>
          </div>
        </section>

        <section style={section}>
          <h2 style={sectionTitle}>Une vanille d’exception</h2>

          <p style={story}>
            Issue des meilleures récoltes de Madagascar, cette vanille a été
            pensée pour répondre à une exigence simple : offrir un produit noble,
            intense et fiable, capable de sublimer aussi bien une pâtisserie
            maison qu’une création plus ambitieuse.
          </p>

          <p style={story}>
            Dans l’esprit de Vanille’Or, chaque référence doit porter une vraie
            promesse : celle d’une qualité premium, accessible, enracinée dans
            le savoir-faire malgache et l’histoire de cette épice devenue
            incontournable depuis Raymond Albius.
          </p>
        </section>

        <section style={section}>
          <h2 style={sectionTitle}>Utilisations conseillées</h2>

          <ul style={list}>
            <li>Pâtisserie haut de gamme</li>
            <li>Crèmes, desserts, glaces et viennoiseries</li>
            <li>Infusions, préparations gourmandes et cuisine créative</li>
            <li>Usage professionnel pour artisans, restaurateurs et épiceries</li>
          </ul>
        </section>

        <section style={finalBox}>
          <h2 style={finalTitle}>Prêt à sublimer vos créations ?</h2>
          <p style={finalText}>
            Sélectionnez votre format, ajustez la quantité, puis ajoutez ce
            produit à votre panier pour finaliser votre commande.
          </p>
          <button
            type="button"
            onClick={() => openCart()}
            style={finalBtn}
          >
            Voir mon panier
          </button>
        </section>
      </div>
    </div>
  );
}

const page = {
  background: "#f8f5ef",
  minHeight: "100vh",
};

const container = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "40px 20px 80px",
};

const loadingBox = {
  padding: "60px 20px",
  textAlign: "center" as const,
  minHeight: "60vh",
  background: "#f8f5ef",
};

const hero = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "40px",
  alignItems: "start",
};

const mediaCol = {};

const imageWrap = {
  position: "relative" as const,
};

const image = {
  width: "100%",
  maxHeight: "650px",
  objectFit: "cover" as const,
  borderRadius: "24px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
};

const badgeOut = {
  position: "absolute" as const,
  top: "16px",
  right: "16px",
  background: "#dc2626",
  color: "white",
  padding: "8px 14px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 700,
};

const badgeStock = {
  position: "absolute" as const,
  top: "16px",
  left: "16px",
  background: "#a16207",
  color: "white",
  padding: "8px 14px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 700,
};

const contentCol = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "16px",
};

const eyebrow = {
  margin: 0,
  color: "#a16207",
  fontWeight: 700,
  letterSpacing: "0.3px",
};

const title = {
  margin: 0,
  fontSize: "40px",
  lineHeight: 1.1,
  color: "#111",
};

const subtitle = {
  margin: 0,
  color: "#6b7280",
  fontSize: "16px",
};

const price = {
  margin: 0,
  fontSize: "30px",
  fontWeight: 800,
  color: "#a16207",
};

const desc = {
  margin: 0,
  color: "#444",
  lineHeight: 1.7,
};

const trustRow = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "10px",
};

const trustItem = {
  background: "white",
  border: "1px solid #eee",
  padding: "10px 12px",
  borderRadius: "12px",
  fontSize: "14px",
};

const sectionCard = {
  background: "white",
  borderRadius: "18px",
  padding: "18px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.04)",
};

const sectionLabel = {
  margin: "0 0 12px 0",
  fontWeight: 700,
  color: "#111",
};

const packGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "10px",
};

const packBtn = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "flex-start",
  gap: "4px",
  borderRadius: "12px",
  padding: "12px",
  cursor: "pointer",
  color: "#111",
};

const packTitle = {
  fontSize: "15px",
};

const packDesc = {
  fontSize: "12px",
  color: "#6b7280",
};

const qtyRow = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
};

const qtyBtn = {
  width: "42px",
  height: "42px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
  fontSize: "18px",
  fontWeight: 700,
  color: "#111",
};

const qtyValue = {
  minWidth: "22px",
  textAlign: "center" as const,
  fontWeight: 700,
  fontSize: "18px",
};

const cta = {
  border: "none",
  color: "white",
  padding: "16px 20px",
  borderRadius: "14px",
  fontWeight: 700,
  fontSize: "16px",
};

const shipping = {
  margin: 0,
  color: "#6b7280",
  fontSize: "14px",
};

const section = {
  marginTop: "70px",
};

const sectionTitle = {
  fontSize: "28px",
  marginBottom: "18px",
  color: "#111",
};

const featureGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: "20px",
};

const featureCard = {
  background: "white",
  borderRadius: "18px",
  padding: "22px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.04)",
};

const featureTitle = {
  marginTop: 0,
  marginBottom: "10px",
  color: "#111",
};

const featureText = {
  margin: 0,
  color: "#555",
  lineHeight: 1.7,
};

const story = {
  color: "#444",
  lineHeight: 1.8,
  marginBottom: "14px",
};

const list = {
  color: "#444",
  lineHeight: 2,
  paddingLeft: "20px",
};

const finalBox = {
  marginTop: "80px",
  background: "white",
  borderRadius: "22px",
  padding: "32px",
  textAlign: "center" as const,
  boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
};

const finalTitle = {
  marginTop: 0,
  color: "#111",
};

const finalText = {
  color: "#666",
  maxWidth: "700px",
  margin: "0 auto 20px",
  lineHeight: 1.7,
};

const finalBtn = {
  background: "#a16207",
  color: "white",
  border: "none",
  padding: "14px 24px",
  borderRadius: "12px",
  fontWeight: 700,
  cursor: "pointer",
};