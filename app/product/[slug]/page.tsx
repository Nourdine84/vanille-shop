"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { useToast } from "@/components/ui/toast";
import { useUIStore } from "@/components/ui-provider";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  stock: number;
  category?: string;
  subCategory?: string | null;
  images?: string[];
};

type RelatedProduct = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string;
  stock?: number;
  category?: string;
  subCategory?: string | null;
};

const formats = [
  { label: "10g", multiplier: 0.1 },
  { label: "25g", multiplier: 0.25 },
  { label: "100g", multiplier: 1 },
  { label: "250g", multiplier: 2.5 },
  { label: "500g", multiplier: 5 },
  { label: "1kg", multiplier: 10 },
];

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { openCart } = useUIStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState(formats[2]);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const [productRes, productsRes] = await Promise.all([
          fetch(`/api/products/${slug}`),
          fetch("/api/products"),
        ]);

        if (!productRes.ok) {
          throw new Error("Erreur produit");
        }

        const productData = await productRes.json();
        setProduct(productData);

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setAllProducts(productsData);
        }
      } catch (error) {
        console.error("❌ PRODUCT PAGE ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return allProducts
      .filter((p) => p.id !== product.id)
      .filter((p) => {
        if (product.category && p.category === product.category) return true;
        if (product.name.toLowerCase().includes("vanille")) {
          return p.name.toLowerCase().includes("vanille");
        }
        return false;
      })
      .slice(0, 3);
  }, [allProducts, product]);

  if (loading) {
    return <div style={{ padding: 40 }}>Chargement...</div>;
  }

  if (!product) {
    return <div style={{ padding: 40 }}>Produit introuvable</div>;
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const dynamicPrice = Math.round(
    product.priceCents * selectedFormat.multiplier
  );

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.imageUrl || "/images/product-vanille.jpg"];

  const addCurrentProductToCart = () => {
    if (isOutOfStock) return;

    addToCart({
      id: `${product.id}_${selectedFormat.label}`,
      name: `${product.name} (${selectedFormat.label})`,
      priceCents: dynamicPrice,
      quantity: 1,
      imageUrl: product.imageUrl,
    });

    showToast("Ajouté au panier 🛒");
    setTimeout(() => openCart(), 200);
  };

  return (
    <div style={{ background: "#faf7f2", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "40px 20px" }}>
        <div style={heroGrid}>
          {/* GALERIE */}
          <div>
            <div style={mainImageWrapper}>
              {isOutOfStock && <div style={badgeDanger}>ÉPUISÉ</div>}
              {isLowStock && !isOutOfStock && (
                <div style={badgeWarning}>Stock limité</div>
              )}

              <motion.img
                key={images[selectedImage]}
                src={images[selectedImage]}
                alt={product.name}
                initial={{ opacity: 0.35 }}
                animate={{ opacity: 1 }}
                style={mainImage}
              />
            </div>

            <div style={thumbRow}>
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  style={{
                    ...thumbButton,
                    border:
                      selectedImage === index
                        ? "2px solid #a16207"
                        : "1px solid #e5e7eb",
                  }}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} style={thumbImage} />
                </button>
              ))}
            </div>
          </div>

          {/* INFOS */}
          <div>
            <p style={eyebrow}>Vanille’Or • Sélection premium</p>
            <h1 style={title}>{product.name}</h1>

            <p style={origin}>🌿 Origine : Madagascar</p>

            <p style={description}>{product.description}</p>

            <div style={reviewBox}>
              <span>⭐ 4.9/5</span>
              <span>•</span>
              <span>Produit apprécié par nos clients</span>
            </div>

            {isLowStock && (
              <div style={urgencyBox}>
                ⏳ Plus que <strong>{product.stock}</strong> en stock sur cette référence.
              </div>
            )}

            <div style={{ marginTop: "26px" }}>
              <h3 style={sectionTitle}>Choisissez votre format</h3>
              <div style={formatGrid}>
                {formats.map((format) => (
                  <button
                    key={format.label}
                    onClick={() => setSelectedFormat(format)}
                    style={{
                      ...formatButton,
                      background:
                        selectedFormat.label === format.label
                          ? "#a16207"
                          : "white",
                      color:
                        selectedFormat.label === format.label
                          ? "white"
                          : "#333",
                    }}
                  >
                    {format.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={priceBlock}>
              <div style={price}>{formatPrice(dynamicPrice)}</div>
              <div style={priceSub}>Prix indicatif selon le format sélectionné</div>
            </div>

            <div style={benefitsBox}>
              <p style={benefitLine}>✔️ Arôme intense et naturel</p>
              <p style={benefitLine}>✔️ Sélection artisanale</p>
              <p style={benefitLine}>✔️ Idéal pâtisserie et gastronomie</p>
            </div>

            <button
              disabled={isOutOfStock}
              onClick={addCurrentProductToCart}
              style={{
                ...cta,
                background: isOutOfStock ? "#999" : "#a16207",
                cursor: isOutOfStock ? "not-allowed" : "pointer",
              }}
            >
              {isOutOfStock ? "Produit indisponible" : "Ajouter au panier"}
            </button>

            <div style={reassuranceRow}>
              <div style={reassuranceCard}>🔒 Paiement sécurisé</div>
              <div style={reassuranceCard}>📦 Expédition France & Europe</div>
              <div style={reassuranceCard}>💬 Support réactif</div>
            </div>

            <div style={storyBox}>
              <h3 style={sectionTitle}>L’esprit Vanille’Or</h3>
              <p style={storyText}>
                Chez Vanille’Or, nous sélectionnons des produits à fort potentiel
                aromatique, directement liés à notre exigence de qualité. Notre
                ambition est simple : proposer une expérience premium, sincère et
                accessible, du petit format découverte jusqu’aux besoins
                professionnels.
              </p>
            </div>

            <div style={b2bBox}>
              <p style={b2bText}>
                Besoin de grandes quantités pour votre activité ?
              </p>
              <Link href="/b2b" style={b2bBtn}>
                Demander un devis (10kg+)
              </Link>
            </div>
          </div>
        </div>

        {/* SOUVENT ACHETÉS ENSEMBLE */}
        {relatedProducts.length > 0 && (
          <section style={relatedSection}>
            <h2 style={relatedTitle}>Souvent achetés ensemble</h2>

            <div style={relatedGrid}>
              {relatedProducts.map((item) => {
                const itemOut = item.stock === 0;

                return (
                  <div key={item.id} style={relatedCard}>
                    <div style={{ position: "relative" }}>
                      {itemOut && <div style={miniOutBadge}>ÉPUISÉ</div>}
                      <img
                        src={item.imageUrl || "/images/product-vanille.jpg"}
                        alt={item.name}
                        style={relatedImage}
                      />
                    </div>

                    <h3 style={relatedName}>{item.name}</h3>
                    <p style={relatedPrice}>{formatPrice(item.priceCents)}</p>

                    <div style={relatedActions}>
                      <Link href={`/product/${item.slug}`} style={secondaryBtn}>
                        Voir
                      </Link>

                      <button
                        disabled={itemOut}
                        onClick={() => {
                          if (itemOut) return;

                          addToCart({
                            id: item.id,
                            name: item.name,
                            priceCents: item.priceCents,
                            quantity: 1,
                            imageUrl: item.imageUrl,
                          });

                          showToast("Produit ajouté 🛒");
                          setTimeout(() => openCart(), 200);
                        }}
                        style={{
                          ...smallPrimaryBtn,
                          background: itemOut ? "#999" : "#a16207",
                          cursor: itemOut ? "not-allowed" : "pointer",
                        }}
                      >
                        {itemOut ? "Indispo" : "Ajouter"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

/* STYLES */

const heroGrid = {
  display: "grid",
  gridTemplateColumns: "1.05fr 0.95fr",
  gap: "32px",
  alignItems: "start",
};

const mainImageWrapper = {
  position: "relative" as const,
};

const mainImage = {
  width: "100%",
  height: "520px",
  objectFit: "cover" as const,
  borderRadius: "20px",
};

const thumbRow = {
  display: "flex",
  gap: "10px",
  marginTop: "12px",
  flexWrap: "wrap" as const,
};

const thumbButton = {
  width: "78px",
  height: "78px",
  borderRadius: "12px",
  overflow: "hidden" as const,
  background: "white",
  cursor: "pointer",
  padding: 0,
};

const thumbImage = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
};

const eyebrow = {
  color: "#a16207",
  fontWeight: 700,
  margin: "0 0 8px 0",
};

const title = {
  fontSize: "34px",
  lineHeight: 1.15,
  margin: 0,
};

const origin = {
  marginTop: "12px",
  color: "#8b5e00",
  fontWeight: 600,
};

const description = {
  color: "#666",
  marginTop: "14px",
  lineHeight: 1.7,
};

const reviewBox = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  marginTop: "18px",
  fontWeight: 600,
  color: "#333",
};

const urgencyBox = {
  marginTop: "16px",
  background: "#fff7ed",
  color: "#9a3412",
  border: "1px solid #fdba74",
  padding: "12px 14px",
  borderRadius: "12px",
  fontSize: "14px",
};

const sectionTitle = {
  margin: "0 0 12px 0",
};

const formatGrid = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap" as const,
};

const formatButton = {
  padding: "10px 16px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  cursor: "pointer",
  fontWeight: 600,
};

const priceBlock = {
  marginTop: "24px",
};

const price = {
  fontSize: "30px",
  fontWeight: 800,
  color: "#111",
};

const priceSub = {
  marginTop: "4px",
  color: "#666",
  fontSize: "14px",
};

const benefitsBox = {
  marginTop: "18px",
  background: "white",
  padding: "16px",
  borderRadius: "14px",
};

const benefitLine = {
  margin: "0 0 8px 0",
  color: "#333",
};

const cta = {
  marginTop: "22px",
  width: "100%",
  color: "white",
  padding: "16px",
  borderRadius: "12px",
  border: "none",
  fontWeight: 700,
  fontSize: "16px",
};

const reassuranceRow = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "10px",
  marginTop: "16px",
};

const reassuranceCard = {
  background: "white",
  padding: "12px",
  borderRadius: "12px",
  textAlign: "center" as const,
  fontSize: "13px",
  color: "#444",
};

const storyBox = {
  marginTop: "22px",
  background: "white",
  padding: "18px",
  borderRadius: "14px",
};

const storyText = {
  color: "#555",
  lineHeight: 1.7,
  margin: 0,
};

const b2bBox = {
  marginTop: "22px",
  textAlign: "center" as const,
};

const b2bText = {
  color: "#666",
  marginBottom: "10px",
};

const b2bBtn = {
  display: "inline-block",
  background: "#333",
  color: "white",
  padding: "12px 20px",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: 600,
};

const relatedSection = {
  marginTop: "52px",
};

const relatedTitle = {
  fontSize: "28px",
  marginBottom: "20px",
};

const relatedGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "20px",
};

const relatedCard = {
  background: "white",
  padding: "16px",
  borderRadius: "16px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
};

const relatedImage = {
  width: "100%",
  height: "220px",
  objectFit: "cover" as const,
  borderRadius: "12px",
};

const relatedName = {
  marginTop: "12px",
  marginBottom: "8px",
  fontSize: "18px",
};

const relatedPrice = {
  color: "#a16207",
  fontWeight: 700,
  marginBottom: "12px",
};

const relatedActions = {
  display: "flex",
  gap: "10px",
};

const secondaryBtn = {
  flex: 1,
  textAlign: "center" as const,
  background: "#f3f4f6",
  padding: "12px",
  borderRadius: "10px",
  textDecoration: "none",
  color: "#111",
  fontWeight: 600,
};

const smallPrimaryBtn = {
  flex: 1,
  color: "white",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  fontWeight: 600,
};

const badgeDanger = {
  position: "absolute" as const,
  top: "14px",
  left: "14px",
  background: "#dc2626",
  color: "white",
  padding: "8px 14px",
  borderRadius: "999px",
  fontWeight: 700,
  zIndex: 2,
};

const badgeWarning = {
  position: "absolute" as const,
  top: "14px",
  right: "14px",
  background: "#f59e0b",
  color: "white",
  padding: "8px 14px",
  borderRadius: "999px",
  fontWeight: 700,
  zIndex: 2,
};

const miniOutBadge = {
  position: "absolute" as const,
  top: "10px",
  right: "10px",
  background: "#dc2626",
  color: "white",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 700,
  zIndex: 2,
};