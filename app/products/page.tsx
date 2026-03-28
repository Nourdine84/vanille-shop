"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useToast } from "@/components/ui/toast";
import { useUIStore } from "@/components/ui-provider";

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { openCart } = useUIStore();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);

        const q: Record<string, number> = {};
        data.forEach((p: any) => (q[p.id] = 1));
        setQuantities(q);
      });
  }, []);

  const increase = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.min(prev[id] + 1, 99),
    }));
  };

  const decrease = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, prev[id] - 1),
    }));
  };

  return (
    <div className="max-w-7xl mx-auto py-20 px-6">
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h1 style={{ fontSize: "42px", fontWeight: 800 }}>
          Nos produits
        </h1>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((product, index) => {
          const isOutOfStock = product.stock === 0;

          return (
            <div
              key={product.id}
              data-testid="product-card"
              style={{
                position: "relative",
                borderRadius: "22px",
                padding: "18px",
                background: "#ffffff",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                opacity: isOutOfStock ? 0.7 : 1,
              }}
            >
              {/* ⭐ BEST SELLER */}
              {index === 0 && !isOutOfStock && (
                <div style={bestSeller}>⭐ Best seller</div>
              )}

              {/* 🔴 OUT OF STOCK */}
              {isOutOfStock && (
                <div style={outOfStockBadge}>ÉPUISÉ</div>
              )}

              <img
                src={product.imageUrl || "/images/product-vanille.jpg"}
                alt={product.name}
                style={imageStyle}
              />

              <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
                {product.name}
              </h2>

              <p style={{ color: "#6b7280", margin: "10px 0" }}>
                {product.description}
              </p>

              <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
                {formatPrice(product.priceCents)}
              </p>

              {!isOutOfStock && (
                <div style={qtyRow}>
                  <button onClick={() => decrease(product.id)}>-</button>
                  <span>{quantities[product.id]}</span>
                  <button onClick={() => increase(product.id)}>+</button>
                </div>
              )}

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  disabled={isOutOfStock}
                  onClick={() => {
                    if (isOutOfStock) return;

                    addToCart({
                      id: product.id,
                      name: product.name,
                      priceCents: product.priceCents,
                      quantity: quantities[product.id],
                    });

                    showToast("Ajouté au panier 🛒");
                    setTimeout(() => openCart(), 200);
                  }}
                  style={{
                    flex: 1,
                    background: isOutOfStock ? "#999" : "#a16207",
                    color: "white",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "none",
                    cursor: isOutOfStock ? "not-allowed" : "pointer",
                  }}
                >
                  {isOutOfStock ? "Indisponible" : "Ajouter"}
                </button>

                <Link
                  href={`/product/${product.slug}`}
                  style={linkBtn}
                >
                  Voir
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* 🎨 STYLES */

const imageStyle = {
  width: "100%",
  height: "260px",
  objectFit: "cover" as const,
  borderRadius: "16px",
  marginBottom: "14px",
};

const qtyRow = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "12px",
};

const bestSeller = {
  position: "absolute" as const,
  background: "#a16207",
  color: "white",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  top: "15px",
  left: "15px",
};

const outOfStockBadge = {
  position: "absolute" as const,
  top: "15px",
  right: "15px",
  background: "#dc2626",
  color: "white",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: 700,
};

const linkBtn = {
  flex: 1,
  textAlign: "center" as const,
  background: "#f3f4f6",
  padding: "12px",
  borderRadius: "10px",
  textDecoration: "none",
  color: "#111",
};