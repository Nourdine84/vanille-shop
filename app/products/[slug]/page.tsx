import { prisma } from "@/lib/prisma";
import ClientProduct from "./product-client";

function normalizeSlug(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const products = await prisma.product.findMany({
    where: { isActive: true },
  });

  const product = products.find(
    (p) => normalizeSlug(p.slug || p.name) === params.slug
  );

  if (!product) {
    return <div style={{ padding: 40 }}>Produit introuvable</div>;
  }

  /* 🔥 RELATED PRODUCTS */
  const relatedProducts = products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.category === product.category &&
        !p.isPack
    )
    .slice(0, 3);

  const safeProduct = JSON.parse(
    JSON.stringify({
      ...product,
      relatedProducts,
    })
  );

  return <ClientProduct product={safeProduct} />;
}