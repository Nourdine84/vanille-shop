"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-store";
import { useToast } from "@/components/ui/toast";
import { useUIStore } from "@/lib/ui-store";

type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
};

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { showToast } = useToast();
  const { addToCart } = useCart(); // ✅ FIX ICI
  const openCart = useUIStore((state) => state.openCart);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/products/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div style={{ padding: 40 }}>Chargement...</div>;
  if (!product) return <div style={{ padding: 40 }}>Produit introuvable</div>;

  return (
    <>
      <Head>
        <title>{product.name} | Vanille de Madagascar Premium</title>
        <meta name="description" content={product.description} />
      </Head>

      <div>

        {/* HERO */}
        <section style={{ height: "90vh", position: "relative" }}>
          <motion.img
            src={product.imageUrl || "/images/product-vanille.jpg"}
            alt={product.name}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.7)",
            }}
          />

          <div style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            background: "#a16207",
            color: "white",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "12px"
          }}>
            ⭐ Best seller
          </div>

          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              position: "absolute",
              bottom: "60px",
              left: "60px",
              color: "white",
            }}
          >
            <h1 style={{ fontSize: "48px" }}>{product.name}</h1>
            <p>Vanille premium de Madagascar</p>
          </motion.div>
        </section>

        {/* CTA */}
        <motion.section style={{ textAlign: "center", margin: "80px auto" }}>
          <h2>{formatPrice(product.priceCents)}</h2>

          <p style={{ color: "red" }}>⚠️ Stock limité</p>

          <motion.button
            data-testid="add-to-cart" // 🔥 QA
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              addToCart({
                id: product.id,
                name: product.name,
                priceCents: product.priceCents,
                quantity: 1,
              });

              showToast("Ajouté au panier 🛒");
              setTimeout(() => openCart(), 200);
            }}
            style={{
              background: "#a16207",
              color: "white",
              padding: "16px",
              borderRadius: "12px",
              marginTop: "20px",
            }}
          >
            Ajouter au panier 🛒
          </motion.button>
        </motion.section>

      </div>
    </>
  );
}