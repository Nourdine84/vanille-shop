import { prisma } from "../../../lib/prisma";
import { notFound } from "next/navigation";
import AddToCartButton from "../../../components/AddToCartButton";

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      priceCents: true,
      imageUrl: true,
      // ⚠️ NE PAS METTRE createdAt, updatedAt, etc.
    },
  });

  if (!product) return notFound();

  // ✅ On crée un objet 100% sérialisable
  const safeProduct = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    priceCents: product.priceCents,
    imageUrl: product.imageUrl,
  };

  return (
    <div className="container mx-auto py-16">
      <div className="grid md:grid-cols-2 gap-12">
        {safeProduct.imageUrl && (
          <img
            src={safeProduct.imageUrl}
            alt={safeProduct.name}
            className="rounded-lg"
          />
        )}

        <div>
          <h1 className="text-3xl font-bold mb-4">{safeProduct.name}</h1>
          <p className="text-gray-600 mb-6">{safeProduct.description}</p>
          <p className="text-2xl font-semibold mb-6">
            {(safeProduct.priceCents / 100).toFixed(2)} €
          </p>

          <AddToCartButton product={safeProduct} />
        </div>
      </div>
    </div>
  );
}