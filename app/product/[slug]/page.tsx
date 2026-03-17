import Image from "next/image";
import dynamic from "next/dynamic";

const AddToCart = dynamic(
  () => import("../../../components/add-to-cart"),
  { ssr: false }
);

type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl?: string;
};

async function getProduct(slug: string): Promise<Product | null> {
  const res = await fetch(
    `http://localhost:3000/api/products/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: "Produit introuvable | Vanille Or",
    };
  }

  return {
    title: `${product.name} | Vanille Or`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.imageUrl ? [product.imageUrl] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">
          Produit introuvable
        </h1>
      </div>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.imageUrl,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: (product.priceCents / 100).toFixed(2),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="max-w-5xl mx-auto py-24 px-6 grid md:grid-cols-2 gap-12">
      
      {/* SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* IMAGE */}
      <div>
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={600}
            height={600}
            className="rounded-xl object-cover"
            priority
          />
        ) : (
          <div className="bg-gray-200 h-[400px] flex items-center justify-center rounded-xl">
            <span className="text-gray-500">
              Image indisponible
            </span>
          </div>
        )}
      </div>

      {/* INFOS */}
      <div>
        <h1 className="text-4xl font-bold text-amber-900 mb-4">
          {product.name}
        </h1>

        <p className="text-gray-600 mb-6">
          {product.description}
        </p>

        <p className="text-3xl font-semibold mb-8">
          {(product.priceCents / 100).toFixed(2)} €
        </p>

        <AddToCart
          id={product.id}
          name={product.name}
          priceCents={product.priceCents}
          imageUrl={product.imageUrl}
        />
      </div>
    </div>
  );
}