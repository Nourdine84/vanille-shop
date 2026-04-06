import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import AddToCartButton from "./AddToCartButton";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product || !product.isActive) return notFound();

  const isOutOfStock = product.stock <= 0;

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 40 }}>
      <div style={{ marginBottom: 20 }}>
        <Link href="/">Accueil</Link> /{" "}
        <Link href="/products">Produits</Link> /{" "}
        <strong>{product.name}</strong>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
        <div>
          <img
            src={product.imageUrl || "/products/default.jpg"}
            alt={product.name}
            style={{ width: "100%", borderRadius: 12 }}
          />
        </div>

        <div>
          <p>{product.category}</p>
          <h1>{product.name}</h1>

          <p style={{ fontSize: 24, fontWeight: 700 }}>
            {formatPrice(product.priceCents)}
          </p>

          <p>
            {isOutOfStock
              ? "❌ Rupture"
              : `✅ En stock : ${product.stock}`}
          </p>

          <p>{product.description || "Description à venir"}</p>

          {!isOutOfStock && (
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                priceCents: product.priceCents,
                imageUrl: product.imageUrl || undefined,
              }}
            />
          )}

          <div style={{ marginTop: 20 }}>
            <Link href="/products">← Retour catalogue</Link>
          </div>
        </div>
      </div>
    </div>
  );
}