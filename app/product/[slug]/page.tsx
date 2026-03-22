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

  if (loading) {
    return <div style={{ padding: 40 }}>Chargement...</div>;
  }

  if (!product) {
    return <div style={{ padding: 40 }}>Produit introuvable</div>;
  }

  return (
    <>
      {/* SEO */}
      <Head>
        <title>{product.name} | Vanille de Madagascar Premium</title>
        <meta name="description" content={product.description} />
        <meta
          name="keywords"
          content="vanille Madagascar, gousse vanille, vanille premium, acheter vanille"
        />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.imageUrl} />
      </Head>

      <div>

        {/* HERO */}
        <section style={{ height: "90vh", position: "relative" }}>
          <motion.img
            src={product.imageUrl || "/images/product-vanille.jpg"}
            alt={`${product.name} vanille Madagascar premium`}
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
            <p style={{ fontSize: "18px" }}>
              Vanille premium de Madagascar
            </p>
          </motion.div>
        </section>

        {/* STORY */}
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            maxWidth: "800px",
            margin: "100px auto",
            textAlign: "center",
            padding: "0 20px",
          }}
        >
          <p style={{ fontSize: "18px", lineHeight: 1.8 }}>
            Issue d’un savoir-faire unique, notre vanille est cultivée à Madagascar
            dans le respect des traditions. Chaque gousse est sélectionnée avec
            exigence pour offrir une intensité aromatique exceptionnelle.
          </p>
        </motion.section>

        {/* IMAGE */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{ padding: "40px" }}
        >
          <motion.img
            src="/images/tube-gouss.jpg"
            alt="Gousses de vanille premium"
            whileHover={{ scale: 1.05 }}
            style={{
              width: "100%",
              borderRadius: "20px",
            }}
          />
        </motion.section>

        {/* QUALITÉ */}
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: "#faf7f2",
            padding: "80px 20px",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>Une qualité incomparable</h2>
          <p>
            ✔ Gousses charnues <br />
            ✔ Arômes intenses <br />
            ✔ Origine Madagascar
          </p>
        </motion.section>

        {/* CTA + CONVERSION BOOST */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            maxWidth: "600px",
            margin: "100px auto",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>
            {formatPrice(product.priceCents)}
          </h2>

          {/* 🔥 BOOST UX */}
          <p style={{ color: "#dc2626", fontWeight: "600" }}>
            ⚠️ Stock limité — forte demande
          </p>

          <p style={{ color: "#666", marginTop: "8px" }}>
            ⭐️ Déjà adopté par des passionnés de pâtisserie
          </p>

          <p style={{ color: "#666", marginTop: "8px" }}>
            ✔ Qualité premium | ✔ Livraison rapide | ✔ Origine Madagascar
          </p>

          {/* CTA */}
          <motion.button
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
              padding: "16px 24px",
              borderRadius: "12px",
              fontSize: "18px",
              border: "none",
              cursor: "pointer",
              width: "100%",
              maxWidth: "300px",
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