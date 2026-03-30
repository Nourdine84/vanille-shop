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

  const { addToCart } = useCart();
  const { openCart } = useUIStore();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);

        const q: Record<string, number> = {};
        data.forEach((p) => (q[p.id] = 1));
        setQuantities(q);
      })
      .catch((err) => {
        console.error("❌ Fetch products error:", err);
      });
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
      
      {/* 🔥 HERO PREMIUM */}
      <section style={heroSection}>
        <h1 style={heroTitle}>Nos produits</h1>
        <p style={heroSubtitle}>
          Une sélection premium issue des meilleures récoltes de Madagascar
        </p>
      </section>

      {/* 🧱 GRID PRODUITS */}
      <div style={container}>
        <div style={grid}>
          {products.map((product, index) => {
            const isOutOfStock = product.stock === 0;
            const quantity = quantities[product.id] || 1;

            return (
              <div key={product.id} style={card}>
                
                {/* BADGES */}
                {index === 0 && !isOutOfStock && (
                  <div style={badgeBest}>Best Seller</div>
                )}

                {isOutOfStock && (
                  <div style={badgeOut}>Épuisé</div>
                )}

                {/* IMAGE */}
                <img
                  src={product.imageUrl || "/images/product-vanille.jpg"}
                  alt={product.name}
                  style={image}
                />

                {/* CONTENT */}
                <div style={{ padding: "10px 5px" }}>
                  <h2 style={title}>{product.name}</h2>

                  <p style={desc}>{product.description}</p>

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

                  {/* ACTIONS */}
                  <div style={actions}>
                    <button
                      disabled={isOutOfStock}
                      onClick={() => {
                        if (isOutOfStock) return;

                        addToCart({
                          id: product.id,
                          name: product.name,
                          priceCents: product.priceCents,
                          quantity: quantity,

                          // 🔥 CRITIQUE POUR MINI CART
                          imageUrl:
                            product.imageUrl ||
                            "/images/product-vanille.jpg",
                        });

                        setTimeout(() => openCart(), 150);
                      }}
                      style={{
                        ...btnPrimary,
                        background: isOutOfStock ? "#aaa" : "#a16207",
                      }}
                    >
                      {isOutOfStock ? "Indisponible" : "Ajouter"}
                    </button>

                    <Link href={`/product/${product.slug}`} style={btnSecondary}>
                      Voir
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* 🎨 DESIGN PREMIUM */

const heroSection = {
  textAlign: "center" as const,
  padding: "80px 20px 40px",
};

const heroTitle = {
  fontSize: "42px",
  fontWeight: 800,
  marginBottom: "10px",
};

const heroSubtitle = {
  color: "#6b7280",
};

const container = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "20px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "30px",
};

const card = {
  background: "white",
  borderRadius: "20px",
  padding: "15px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.06)",
  position: "relative" as const,
};

const image = {
  width: "100%",
  height: "260px",
  objectFit: "cover" as const,
  borderRadius: "14px",
};

const title = {
  fontSize: "20px",
  fontWeight: 700,
  marginTop: "10px",
};

const desc = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "10px 0",
};

const price = {
  fontWeight: "bold",
  fontSize: "18px",
};

const qtyRow = {
  display: "flex",
  justifyContent: "space-between",
  margin: "10px 0",
};

const qtyBtn = {
  padding: "4px 10px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  cursor: "pointer",
};

const actions = {
  display: "flex",
  gap: "10px",
  marginTop: "10px",
};

const btnPrimary = {
  flex: 1,
  color: "white",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
};

const btnSecondary = {
  flex: 1,
  textAlign: "center" as const,
  background: "#f3f4f6",
  padding: "12px",
  borderRadius: "10px",
  textDecoration: "none",
  color: "#111",
};

const badgeBest = {
  position: "absolute" as const,
  top: "10px",
  left: "10px",
  background: "#a16207",
  color: "white",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "12px",
};

const badgeOut = {
  position: "absolute" as const,
  top: "10px",
  right: "10px",
  background: "#dc2626",
  color: "white",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "12px",
};