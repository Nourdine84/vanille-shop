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

  const safeProduct = JSON.parse(JSON.stringify(product));

  return <ClientProduct product={safeProduct} />;
}