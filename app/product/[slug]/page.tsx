"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-store";
import { useToast } from "@/components/ui/toast";
import { useUIStore } from "@/components/ui-provider";

type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
};

// 🔥 FORMATS
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
  const [selectedFormat, setSelectedFormat] = useState(formats[2]); // 100g par défaut

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/products/${slug}`)
      .then((res) => res.json())
      .then((data) => setProduct(data));
  }, [slug]);

  if (!product) return <div style={{ padding: 40 }}>Chargement...</div>;

  const dynamicPrice = Math.round(
    product.priceCents * selectedFormat.multiplier
  );

  return (
    <div style={{ background: "#faf7f2", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px" }}>

        {/* IMAGE */}
        <motion.img
          src={product.imageUrl}
          style={{
            width: "100%",
            height: "400px",
            objectFit: "cover",
            borderRadius: "16px",
          }}
        />

        {/* INFOS */}
        <h1 style={{ marginTop: "20px" }}>{product.name}</h1>
        <p style={{ color: "#666" }}>{product.description}</p>

        {/* FORMATS */}
        <div style={{ marginTop: "30px" }}>
          <h3>Choisissez votre format</h3>

          <div style={formatGrid}>
            {formats.map((f) => (
              <button
                key={f.label}
                onClick={() => setSelectedFormat(f)}
                style={{
                  ...formatBtn,
                  background:
                    selectedFormat.label === f.label
                      ? "#a16207"
                      : "white",
                  color:
                    selectedFormat.label === f.label
                      ? "white"
                      : "#333",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* PRIX */}
        <h2 style={{ marginTop: "20px" }}>
          {formatPrice(dynamicPrice)}
        </h2>

        {/* CTA */}
        <button
          onClick={() => {
            addToCart({
              id: product.id + "_" + selectedFormat.label,
              name: `${product.name} (${selectedFormat.label})`,
              priceCents: dynamicPrice,
              quantity: 1,
            });

            showToast("Ajouté au panier 🛒");
            setTimeout(() => openCart(), 200);
          }}
          style={cta}
        >
          Ajouter au panier
        </button>

        {/* B2B */}
        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <p style={{ color: "#666" }}>
            Besoin de grandes quantités ?
          </p>

          <a href="/b2b" style={b2bBtn}>
            Demander un devis (10kg+)
          </a>
        </div>
      </div>
    </div>
  );
}

/* 🎨 STYLES */
const formatGrid = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap" as const,
  marginTop: "10px",
};

const formatBtn = {
  padding: "10px 16px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  cursor: "pointer",
};

const cta = {
  marginTop: "20px",
  background: "#a16207",
  color: "white",
  padding: "16px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
};

const b2bBtn = {
  display: "inline-block",
  marginTop: "10px",
  background: "#333",
  color: "white",
  padding: "12px 20px",
  borderRadius: "10px",
  textDecoration: "none",
};