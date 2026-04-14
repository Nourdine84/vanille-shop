"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getImageUrl } from "@/lib/image";
import { useCart } from "@/lib/cart-context";
import { useUIStore } from "@/components/ui-providers";

type Product = {
  id: string;
  name: string;
  slug: string;
  priceCents: number;
  imageUrl?: string;
  badge?: string;
  stock?: number;
};

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { openCart } = useUIStore();

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Erreur chargement produits");
        }

        const data = await res.json();

        if (isMounted) {
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Erreur chargement produits", error);
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleAdd(product: Product) {
    addToCart({
      id: product.id,
      name: product.name,
      priceCents: product.priceCents,
      imageUrl: getImageUrl(product.imageUrl),
      quantity: 1,
    });

    openCart();
  }

  return (
    <div style={page}>
      <section style={hero}>
        <div style={overlay} />
        <div style={heroContent}>
          <p style={heroTag}>VanilleOr</p>
          <h1 style={heroTitle}>Nos produits d’exception</h1>
          <p style={heroSubtitle}>
            Découvrez notre sélection premium de vanille et d’épices,
            directement issue de Madagascar.
          </p>
        </div>
      </section>

      <div style={container}>
        {loading && <p style={center}>Chargement...</p>}

        {!loading && products.length === 0 && (
          <p style={center}>Aucun produit disponible</p>
        )}

        <div style={grid}>
          {products.map((product) => {
            const isOut = (product.stock ?? 0) <= 0;
            const productImageUrl = getImageUrl(product.imageUrl);

            return (
              <div key={product.id} style={card}>
                <div style={mediaWrapper}>
                  <Link
                    href={`/products/${product.slug}`}
                    style={mediaLink}
                  >
                    {product.badge && !isOut && (
                      <span style={badge}>{product.badge}</span>
                    )}

                    {isOut && <span style={out}>ÉPUISÉ</span>}

                    <img
                      src={productImageUrl}
                      alt={product.name}
                      style={img}
                    />

                    <div style={content}>
                      <h3 style={name}>{product.name}</h3>
                      <p style={price}>{formatPrice(product.priceCents)}</p>
                    </div>
                  </Link>
                </div>

                <div style={ctaContainer}>
                  <Link href={`/products/${product.slug}`} style={ctaVoir}>
                    Voir
                  </Link>

                  {isOut ? (
                    <button type="button" disabled style={ctaDisabled}>
                      Épuisé
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAdd(product)}
                      style={ctaAdd}
                      data-testid={`add-to-cart-${product.id}`}
                    >
                      Ajouter
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={signature}>
        Site développé par <strong>Akm.Consulting</strong>
      </div>
    </div>
  );
}

/* ========================= STYLES ========================= */

const page: React.CSSProperties = {
  background: "#f8f5ef",
  minHeight: "100vh",
};

const hero: React.CSSProperties = {
  position: "relative",
  height: "320px",
  backgroundImage: "url('/images/hero-vanille.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const overlay: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(135deg,#000000cc,#2a2117cc)",
};

const heroContent: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  textAlign: "center",
  color: "white",
  paddingTop: "80px",
};

const heroTag: React.CSSProperties = {
  color: "#d4af37",
  fontSize: "22px",
  fontWeight: 800,
  letterSpacing: "0.3em",
};

const heroTitle: React.CSSProperties = {
  fontSize: "32px",
  marginTop: "10px",
};

const heroSubtitle: React.CSSProperties = {
  color: "#ddd",
  marginTop: "10px",
};

const container: React.CSSProperties = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "40px 20px",
};

const center: React.CSSProperties = {
  textAlign: "center",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: "24px",
};

const card: React.CSSProperties = {
  background: "white",
  borderRadius: "18px",
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const mediaWrapper: React.CSSProperties = {
  position: "relative",
};

const mediaLink: React.CSSProperties = {
  display: "block",
  textDecoration: "none",
  color: "inherit",
};

const img: React.CSSProperties = {
  width: "100%",
  height: "220px",
  objectFit: "cover",
};

const content: React.CSSProperties = {
  padding: "15px",
};

const name: React.CSSProperties = {
  fontWeight: 700,
  marginBottom: "6px",
};

const price: React.CSSProperties = {
  color: "#a16207",
  fontWeight: 700,
};

const ctaContainer: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  padding: "0 15px 15px",
};

const baseBtn: React.CSSProperties = {
  flex: 1,
  padding: "12px",
  borderRadius: "10px",
  fontWeight: 600,
  textAlign: "center",
  fontSize: "14px",
};

const ctaVoir: React.CSSProperties = {
  ...baseBtn,
  background: "#111",
  color: "white",
  textDecoration: "none",
};

const ctaAdd: React.CSSProperties = {
  ...baseBtn,
  background: "#a16207",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const ctaDisabled: React.CSSProperties = {
  ...baseBtn,
  background: "#e5e7eb",
  color: "#9ca3af",
  border: "none",
};

const badge: React.CSSProperties = {
  position: "absolute",
  top: "10px",
  left: "10px",
  background: "#a16207",
  color: "white",
  padding: "5px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  zIndex: 2,
};

const out: React.CSSProperties = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "#dc2626",
  color: "white",
  padding: "5px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  zIndex: 2,
};

const signature: React.CSSProperties = {
  textAlign: "center",
  padding: "20px",
  fontSize: "12px",
  color: "#777",
};