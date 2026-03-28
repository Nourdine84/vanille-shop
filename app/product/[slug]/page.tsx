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
  stock: number;
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
  const [loading, setLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState(formats[2]);

  useEffect(() => {
    if (!slug) return;

    (async () => {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) throw new Error();

        const data = await res.json();
        setProduct(data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return <div style={{ padding: 40 }}>Chargement...</div>;
  if (!product) return <div style={{ padding: 40 }}>Produit introuvable</div>;

  const isOutOfStock = product.stock <= 0;

  const dynamicPrice = Math.round(
    product.priceCents * selectedFormat.multiplier
  );

  return (
    <div style={{ background: "#faf7f2", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px" }}>

        <div style={{ position: "relative" }}>
          {isOutOfStock && <div style={badge}>ÉPUISÉ</div>}

          <motion.img
            src={product.imageUrl || "/images/product-vanille.jpg"}
            alt={product.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={img}
          />
        </div>

        <h1 style={{ marginTop: "20px" }}>{product.name}</h1>
        <p style={{ color: "#666" }}>{product.description}</p>

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

        <h2 style={{ marginTop: "20px" }}>
          {formatPrice(dynamicPrice)}
        </h2>

        <button
          disabled={isOutOfStock}
          onClick={() => {
            if (isOutOfStock) return;

            addToCart({
              id: product.id + "_" + selectedFormat.label,
              name: `${product.name} (${selectedFormat.label})`,
              priceCents: dynamicPrice,
              quantity: 1,
            });

            showToast("Ajouté au panier 🛒");
            setTimeout(() => openCart(), 200);
          }}
          style={{
            ...cta,
            background: isOutOfStock ? "#999" : "#a16207",
          }}
        >
          {isOutOfStock ? "Produit indisponible" : "Ajouter au panier"}
        </button>

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

/* 🎨 */

const badge = {
  position: "absolute" as const,
  top: "15px",
  left: "15px",
  background: "#dc2626",
  color: "white",
  padding: "8px 14px",
  borderRadius: "999px",
  fontWeight: 700,
};

const img = {
  width: "100%",
  height: "400px",
  objectFit: "cover" as const,
  borderRadius: "16px",
};

const formatGrid = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap" as const,
};

const formatBtn = {
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ddd",
};

const cta = {
  marginTop: "20px",
  color: "white",
  padding: "16px",
  borderRadius: "12px",
  border: "none",
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