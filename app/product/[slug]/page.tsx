import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "./AddToCartButton";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

/* 🔥 FIX IMAGE */
function getImageUrl(image?: string) {
  if (!image) return "/products/default.jpg";
  if (image.startsWith("http")) return image;
  if (!image.startsWith("/")) return `/products/${image}`;
  return image;
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug.toLowerCase() },
  });

  if (!product || !product.isActive) return notFound();

  const isOutOfStock = product.stock <= 0;

  return (
    <div style={page}>
      
      <div style={breadcrumb}>
        <Link href="/">Accueil</Link> /{" "}
        <Link href="/products">Produits</Link> /{" "}
        <strong>{product.name}</strong>
      </div>

      <div style={layout}>
        
        {/* IMAGE FIX */}
        <div style={imageBox}>
          <img
            src={getImageUrl(product.imageUrl)}
            alt={product.name}
            style={image}
          />
        </div>

        <div>
          <p style={category}>{product.category}</p>
          <h1 style={title}>{product.name}</h1>

          <div style={badges}>
            <span style={badge}>🔥 Produit populaire</span>
            {product.stock < 5 && (
              <span style={badgeDanger}>⚠ Stock limité</span>
            )}
          </div>

          <p style={price}>{formatPrice(product.priceCents)}</p>

          <p style={stock}>
            {isOutOfStock
              ? "❌ Rupture"
              : `✅ En stock : ${product.stock}`}
          </p>

          <div style={valueBox}>
            ⭐ Qualité premium Madagascar  
            <br />
            🚀 Livraison rapide  
            <br />
            👨‍🍳 Idéal pâtisserie & cuisine
          </div>

          <p>{product.description || "Description à venir"}</p>

          {!isOutOfStock && (
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                priceCents: product.priceCents,
                imageUrl: getImageUrl(product.imageUrl),
              }}
            />
          )}

          <div style={bundleBox}>
            <h3>🔥 Offre pack</h3>
            <p>
              Ajoutez une cannelle premium et optimisez votre livraison.
            </p>
          </div>

          <div style={{ marginTop: 20 }}>
            <Link href="/products">← Retour catalogue</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* STYLE */

const page = { maxWidth: 1200, margin: "0 auto", padding: 40 };

const breadcrumb = { marginBottom: 20 };

const layout = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 40,
};

const imageBox = {
  background: "white",
  padding: 20,
  borderRadius: 16,
};

const image = {
  width: "100%",
  borderRadius: 12,
};

const category = { color: "#a16207" };
const title = { fontSize: 34 };

const price = { fontSize: 28, fontWeight: 800 };

const stock = { marginBottom: 15 };

const badges = { display: "flex", gap: 10 };

const badge = {
  background: "#f59e0b",
  padding: "6px 10px",
  borderRadius: 10,
  color: "white",
};

const badgeDanger = {
  background: "#dc2626",
  padding: "6px 10px",
  borderRadius: 10,
  color: "white",
};

const valueBox = {
  background: "#fff7ed",
  padding: 15,
  borderRadius: 12,
  margin: "15px 0",
};

const bundleBox = {
  marginTop: 20,
  padding: 15,
  borderRadius: 12,
  background: "#f3f4f6",
};
