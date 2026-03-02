import Link from "next/link";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  priceCents: number;
  imageUrl: string | null;
};

async function getProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erreur chargement produits");
  }

  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-10">Nos Produits</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-xl p-6 flex flex-col shadow-sm"
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="rounded-lg mb-4"
              />
            )}

            <h2 className="text-xl font-semibold mb-2">
              {product.name}
            </h2>

            <p className="text-gray-600 mb-4">
              {product.description}
            </p>

            <p className="font-bold mb-6 text-lg">
              {(product.priceCents / 100).toFixed(2)} €
            </p>

            <div className="mt-auto flex gap-3">
              <Link
                href={`/product/${product.slug}`}
                className="btn-primary"
              >
                Voir
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}