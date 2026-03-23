"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-store"; // ✅ FIX
import { useToast } from "@/components/ui/toast";
import { useUIStore } from "@/lib/ui-store";

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const { addToCart } = useCart(); // ✅ FIX
  const { showToast } = useToast();
  const { openCart } = useUIStore(); // ✅ FIX

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
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const decrease = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, prev[id] - 1),
    }));
  };

  return (
    <div className="max-w-7xl mx-auto py-20 px-6">
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h1 style={{ fontSize: "42px", fontWeight: 800 }}>
          Nos produits
        </h1>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((product, index) => (
          <div
            key={product.id}
            data-testid="product-card" // 🔥 QA
            style={{
              position: "relative",
              borderRadius: "22px",
              padding: "18px",
              background: "#ffffff",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            {/* BADGE */}
            {index === 0 && (
              <div
                style={{
                  position: "absolute",
                  background: "#a16207",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  top: "15px",
                  left: "15px",
                }}
              >
                ⭐ Best seller
              </div>
            )}

            {/* IMAGE */}
            <img
              src={product.imageUrl || "/images/product-vanille.jpg"}
              alt={product.name}
              style={{
                width: "100%",
                height: "260px",
                objectFit: "cover",
                borderRadius: "16px",
                marginBottom: "14px",
              }}
            />

            {/* NAME */}
            <h2 style={{ fontSize: "20px", fontWeight: 700 }}>
              {product.name}
            </h2>

            {/* DESC */}
            <p style={{ color: "#6b7280", margin: "10px 0" }}>
              {product.description}
            </p>

            {/* PRICE */}
            <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
              {formatPrice(product.priceCents)}
            </p>

            {/* QUANTITY */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <button onClick={() => decrease(product.id)}>-</button>
              <span>{quantities[product.id]}</span>
              <button onClick={() => increase(product.id)}>+</button>
            </div>

            {/* ACTIONS */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                data-testid="add-to-cart" // 🔥 QA
                onClick={() => {
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
                  background: "#a16207",
                  color: "white",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Ajouter
              </button>

              <Link
                href={`/product/${product.slug}`}
                style={{
                  flex: 1,
                  textAlign: "center",
                  background: "#f3f4f6",
                  padding: "12px",
                  borderRadius: "10px",
                  textDecoration: "none",
                  color: "#111",
                }}
              >
                Voir
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}