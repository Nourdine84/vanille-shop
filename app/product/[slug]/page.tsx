"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Head from "next/head";
import { motion } from "framer-motion";
import { useCartStore } from "../../../lib/cart-store";
import { useToast } from "../../../components/ui/toast";
import { useUIStore } from "../../../lib/ui-store";

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
  const addToCart = useCartStore((state) => state.addToCart);
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

          {/* BADGE */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              background: "#a16207",
              color: "white",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "12px",
            }}
          >
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

        {/* STORY */}
        <motion.section
          style={{
            maxWidth: "800px",
            margin: "100px auto",
            textAlign: "center",
            padding: "0 20px",
          }}
        >
          <p>
            Issue d’un savoir-faire unique, notre vanille est cultivée à Madagascar
            dans le respect des traditions.
          </p>
        </motion.section>

        {/* AVIS */}
        <motion.section
          style={{
            maxWidth: "900px",
            margin: "80px auto",
            padding: "0 20px",
          }}
        >
          <h2 style={{ textAlign: "center" }}>Avis clients</h2>

          <p style={{ textAlign: "center", marginBottom: "20px", color: "#666" }}>
            ⭐ 4.9/5 basé sur 120 avis
          </p>

          <div style={{ display: "grid", gap: "20px" }}>
            {[
              "Qualité incroyable !",
              "Parfait pour pâtisserie",
              "Excellente vanille",
            ].map((text, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  padding: "20px",
                  borderRadius: "16px",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
                }}
              >
                ⭐⭐⭐⭐⭐
                <p style={{ fontStyle: "italic" }}>{text}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          style={{
            textAlign: "center",
            margin: "80px auto",
            padding: "0 20px",
            maxWidth: "700px",
          }}
        >
          <h2>{formatPrice(product.priceCents)}</h2>

          <p style={{ color: "red" }}>⚠️ Stock limité</p>
          <p style={{ color: "#666", marginTop: "8px" }}>
            ✔ Qualité premium • ✔ Livraison rapide • ✔ Origine Madagascar
          </p>

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              addToCart({
                id: product.id,
                name: product.name,
                priceCents: product.priceCents,
                quantity: 1,
                imageUrl: product.imageUrl,
              });

              showToast("Ajouté au panier 🛒");
              setTimeout(() => openCart(), 150);
            }}
            style={{
              background: "#a16207",
              color: "white",
              padding: "16px",
              borderRadius: "12px",
              marginTop: "20px",
              border: "none",
              cursor: "pointer",
              width: "100%",
              maxWidth: "320px",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            Ajouter au panier 🛒
          </motion.button>
        </motion.section>
      </div>
    </>
  );
}