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
    <div className="max-w-7xl mx-auto py-20 px-6">
      {/* HEADER */}
      <div className="text-center mb-16">
        <p className="text-xs tracking-[3px] uppercase text-amber-700 mb-3">
          Vanille Or
        </p>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Nos produits
        </h1>

        <p className="text-gray-500 max-w-xl mx-auto">
          Découvrez une sélection de vanille premium, soigneusement choisie
          pour sublimer vos créations culinaires.
        </p>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {products.map((product: any) => (
          <div
            key={product.id}
            className="group border border-[#ece7df] rounded-2xl p-5 bg-white hover:shadow-xl transition duration-300"
          >
            {/* IMAGE */}
            <div className="overflow-hidden rounded-xl mb-5">
              <img
                src={product.imageUrl || "/images/placeholder.jpg"}
                alt={product.name}
                className="w-full h-[260px] object-cover group-hover:scale-105 transition duration-500"
              />
            </div>

            {/* CONTENT */}
            <h2 className="text-xl font-semibold mb-2">
              {product.name}
            </h2>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {product.description}
            </p>

            <p className="text-lg font-bold mb-5">
              {formatPrice(product.priceCents)}
            </p>

            {/* CTA */}
            <Link
              href={`/product/${product.slug}`}
              className="block text-center bg-amber-700 text-white py-3 rounded-xl font-medium hover:bg-amber-800 transition"
            >
              Voir le produit
            </Link>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {products.length === 0 && (
        <div className="text-center mt-20">
          <p className="text-gray-500">
            Aucun produit disponible pour le moment.
          </p>
        </div>
      )}
    </div>
  );
}