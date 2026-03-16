import Link from "next/link";

async function getProducts() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erreur chargement produits");
  }

  return res.json();
}

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="max-w-6xl mx-auto py-20 px-6">
      <h1 className="text-4xl font-bold mb-10 text-center">
        Nos produits
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {products.map((product: any) => (
          <div
            key={product.id}
            className="border rounded-xl p-6 shadow-sm"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="rounded-lg mb-4"
            />

            <h2 className="text-xl font-semibold mb-2">
              {product.name}
            </h2>

            <p className="text-gray-600 mb-4">
              {product.description}
            </p>

            <p className="text-lg font-bold mb-4">
              {formatPrice(product.priceCents)}
            </p>

            <Link
              href={`/product/${product.slug}`}
              className="bg-amber-700 text-white px-5 py-3 rounded-lg hover:bg-amber-800"
            >
              Voir
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
