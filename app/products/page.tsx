"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useUIStore } from "@/components/ui-provider";

type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl?: string;
  stock: number;
  slug: string;
};

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { openCart } = useUIStore();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        setProducts(data);

        const q: Record<string, number> = {};
        data.forEach((p: Product) => (q[p.id] = 1));
        setQuantities(q);
      } catch (err) {
        console.error("❌ Fetch products error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const increase = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.min((prev[id] || 1) + 1, 99),
    }));
  };

  const decrease = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 1) - 1, 1),
    }));
  };

  return (
    <div style={{ background: "#f8f5ef", minHeight: "100vh" }}>
      {/* HERO */}
      <section style={hero}>
        <h1 style={heroTitle}>VanilleOr Collection</h1>
        <p style={heroSubtitle}>
          Produits premium sélectionnés à Madagascar
        </p>
      </section>

      <div style={container}>
        {loading ? (
          <p style={{ textAlign: "center" }}>Chargement...</p>
        ) : (
          <div style={grid}>
            {products.map((product, index) => {
              const isOutOfStock = product.stock === 0;
              const quantity = quantities[product.id] || 1;

              return (
                <div key={product.id} style={card}>
                  {/* BADGES */}
                  {index === 0 && <div style={badgeBest}>🔥 Best Seller</div>}
                  {product.stock < 5 && !isOutOfStock && (
                    <div style={badgeStock}>⚠ Stock limité</div>
                  )}
                  {isOutOfStock && (
                    <div style={badgeOut}>Épuisé</div>
                  )}

                  {/* IMAGE */}
                  <img
                    src={product.imageUrl || "/products/default.jpg"}
                    style={image}
                  />

                  {/* CONTENT */}
                  <div style={content}>
                    <h2 style={title}>{product.name}</h2>

                    <p style={desc}>{product.description}</p>

                    {/* 🔥 TRIGGERS */}
                    <p style={trigger}>✔ Qualité premium</p>
                    <p style={trigger2}>🚀 Expédition rapide</p>

                    <p style={price}>
                      {formatPrice(product.priceCents)}
                    </p>

                    {!isOutOfStock && (
                      <div style={qtyRow}>
                        <button onClick={() => decrease(product.id)} style={qtyBtn}>−</button>
                        <span>{quantity}</span>
                        <button onClick={() => increase(product.id)} style={qtyBtn}>+</button>
                      </div>
                    )}

                    <div style={actions}>
                      <button
                        disabled={isOutOfStock}
                        onClick={() => {
                          addToCart({
                            id: product.id,
                            name: product.name,
                            priceCents: product.priceCents,
                            quantity,
                            imageUrl: product.imageUrl || "/products/default.jpg",
                          });

                          setTimeout(() => openCart(), 120);
                        }}
                        style={{
                          ...btnPrimary,
                          background: isOutOfStock ? "#aaa" : "#a16207",
                        }}
                      >
                        Ajouter
                      </button>

                      <Link href={`/products/${product.slug}`} style={btnSecondary}>
                        Voir
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* STYLE */

const hero = { textAlign: "center" as const, padding: "60px 20px" };
const heroTitle = { fontSize: "40px", fontWeight: 800 };
const heroSubtitle = { color: "#666" };

const container = { maxWidth: 1200, margin: "0 auto", padding: 20 };

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
  gap: 30,
};

const card = {
  background: "white",
  borderRadius: 20,
  overflow: "hidden",
  boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
  transition: "0.3s",
};

const image = { width: "100%", height: 260, objectFit: "cover" as const };

const content = { padding: 20 };

const title = { fontWeight: 700 };
const desc = { fontSize: 14, color: "#666" };

const trigger = { color: "#16a34a", fontSize: 13 };
const trigger2 = { color: "#a16207", fontSize: 13 };

const price = { fontSize: 20, fontWeight: 800 };

const qtyRow = { display: "flex", gap: 10 };

const qtyBtn = { padding: "4px 10px" };

const actions = { display: "flex", gap: 10 };

const btnPrimary = {
  flex: 1,
  color: "white",
  padding: 12,
  borderRadius: 10,
  border: "none",
};

const btnSecondary = {
  flex: 1,
  background: "#eee",
  padding: 12,
  borderRadius: 10,
  textAlign: "center" as const,
  textDecoration: "none",
};

const badgeBest = {
  position: "absolute" as const,
  top: 10,
  left: 10,
  background: "#a16207",
  color: "white",
  padding: "6px 10px",
  borderRadius: 10,
};

const badgeStock = {
  position: "absolute" as const,
  top: 10,
  right: 10,
  background: "#dc2626",
  color: "white",
  padding: "6px 10px",
  borderRadius: 10,
};

const badgeOut = badgeStock;