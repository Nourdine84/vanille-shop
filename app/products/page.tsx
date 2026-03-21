"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Head from "next/head";
import { useCartStore } from "../../lib/cart-store";
import { useToast } from "../../components/ui/toast";
import { useUIStore } from "../../lib/ui-store";

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const addToCart = useCartStore((state) => state.addToCart);
  const { showToast } = useToast();
  const openCart = useUIStore((state) => state.openCart);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);

        const q: any = {};
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
    <>
      {/* ✅ SEO */}
      <Head>
        <title>Nos produits | Vanille de Madagascar Premium</title>
        <meta
          name="description"
          content="Achetez de la vanille premium de Madagascar. Gousses de qualité exceptionnelle pour pâtisserie et gastronomie."
        />
        <meta
          name="keywords"
          content="vanille Madagascar, gousse vanille, vanille premium, acheter vanille, vanille pâtisserie"
        />
      </Head>

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
              style={{
                position: "relative",
                borderRadius: "22px",
                padding: "18px",
                background: "#ffffff",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >

              {/* BADGE */}
              {index === 0 && (
                <div style={{
                  position: "absolute",
                  background: "#a16207",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  top: "15px",
                  left: "15px",
                }}>
                  ⭐ Best seller
                </div>
              )}

              {/* IMAGE */}
              <div style={{ overflow: "hidden", borderRadius: "16px" }}>
                <img
                  src={product.imageUrl || "/images/product-vanille.jpg"}
                  alt={`${product.name} vanille Madagascar premium`}
                  style={{
                    width: "100%",
                    height: "260px",
                    objectFit: "cover",
                    marginBottom: "14px",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                />
              </div>

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

              {/* STOCK WARNING */}
              {product.stock < 20 && (
                <p style={{ color: "#dc2626", fontSize: "12px", marginBottom: "10px" }}>
                  ⚠️ Stock limité
                </p>
              )}

              {/* QUANTITY */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
                border: "1px solid #eee",
                borderRadius: "10px",
                padding: "6px 10px"
              }}>
                <button onClick={() => decrease(product.id)}>-</button>
                <span>{quantities[product.id]}</span>
                <button onClick={() => increase(product.id)}>+</button>
              </div>

              {/* ACTIONS */}
              <div style={{ display: "flex", gap: "10px" }}>

                <button
                  onClick={(e) => {
                    const btn = e.currentTarget;

                    btn.style.transform = "scale(0.95)";
                    setTimeout(() => {
                      btn.style.transform = "scale(1)";
                    }, 120);

                    addToCart({
                      id: product.id,
                      name: product.name,
                      priceCents: product.priceCents,
                      quantity: quantities[product.id],
                    });

                    showToast("Ajouté au panier 🛒");

                    setTimeout(() => {
                      openCart();
                    }, 200);
                  }}
                  style={{
                    flex: 1,
                    background: "#a16207",
                    color: "white",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "none",
                    cursor: "pointer",
                    transition: "transform 0.1s ease",
                    fontWeight: "600",
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
                    fontWeight: "600",
                  }}
                >
                  Voir
                </Link>

              </div>

            </div>

          ))}

        </div>
      </div>
    </>
  );
}