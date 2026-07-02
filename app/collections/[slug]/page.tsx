import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getImageUrl } from "@/lib/image";

export const dynamic = "force-dynamic";

type CollectionPageProps = {
  params: {
    slug: string;
  };
};

export default async function CollectionPage({
  params,
}: CollectionPageProps) {
  const items = await prisma.product.findMany({
    where: {
      isActive: true,
      isPack: false,
      category: params.slug,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ padding: 40 }}>
      <h1>{params.slug}</h1>

      {items.length === 0 && <p>Aucun produit disponible</p>}

      <div style={{ display: "grid", gap: 20 }}>
        {items.map((p) => (
          <Link key={p.id} href={`/products/${p.slug}`}>
            <div>
              <img src={getImageUrl(p.imageUrl)} width={200} />
              <h3>{p.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
