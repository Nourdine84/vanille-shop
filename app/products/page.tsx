import Link from "next/link";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  priceCents: number;
  imageUrl: string | null;
  stock?: number;
  bestSeller?: boolean;
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

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="max-w-7xl mx-auto py-20 px-6">

      {/* Titre */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-serif font-bold text-amber-900 mb-4">
          Nos Produits
        </h1>

        <p className="text-gray-600 max-w-xl mx-auto">
          Découvrez notre sélection de vanilles d'exception directement
          importées de Madagascar.
        </p>
      </div>

      {/* Produits */}
      {products.length === 0 ? (
        <div className="border rounded-xl p-10 text-center">
          <p className="text-gray-700">Aucun produit disponible.</p>
        </div>
      ) : (

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {products.map((product) => {

            const inStock =
              typeof product.stock === "number"
                ? product.stock > 0
                : true;

            const lowStock =
              typeof product.stock === "number"
                ? product.stock <= 5
                : false;

            return (

              <div
                key={product.id}
                className="bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition flex flex-col"
              >

                {/* IMAGE */}
                <div className="relative">

                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-60 object-cover"
                    />
                  ) : (
                    <div className="w-full h-60 bg-amber-100 flex items-center justify-center">
                      Image produit
                    </div>
                  )}

                  {/* BADGES */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">

                    <span className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full font-semibold">
                      Madagascar
                    </span>

                    {product.bestSeller && (
                      <span className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full font-semibold">
                        🔥 Best Seller
                      </span>
                    )}

                    {lowStock && (
                      <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full font-semibold">
                        ⚠ Plus que {product.stock}
                      </span>
                    )}

                  </div>

                </div>

                {/* CONTENU */}
                <div className="p-6 flex flex-col flex-1">

                  <h2 className="text-xl font-semibold mb-2">
                    {product.name}
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {product.description ??
                      "Vanille premium sélectionnée avec soin"}
                  </p>

                  <div className="mt-auto">

                    <p className="text-2xl font-bold text-amber-800 mb-4">
                      {formatPrice(product.priceCents)}
                    </p>

                    {/* STOCK */}
                    <p className="text-sm text-gray-500 mb-4">
                      {inStock
                        ? `✔ En stock (${product.stock ?? "disponible"})`
                        : "❌ Rupture de stock"}
                    </p>

                    {/* BOUTONS */}
                    <div className="flex gap-3">

                      <Link
                        href={`/product/${product.slug}`}
                        className="flex-1 text-center bg-amber-700 text-white py-3 rounded-lg hover:bg-amber-800 transition font-semibold"
                      >
                        Voir
                      </Link>

                      <Link
                        href="/cart"
                        className="px-4 py-3 border rounded-lg hover:bg-gray-50"
                      >
                        🛒
                      </Link>

                    </div>

                  </div>

                </div>

              </div>

            );
          })}

        </div>
      )}

      {/* CTA */}
      <div className="mt-16 text-center">

        <Link
          href="/"
          className="inline-block border border-amber-700 text-amber-700 px-6 py-3 rounded-lg hover:bg-amber-50 transition font-semibold"
        >
          ← Retour accueil
        </Link>

      </div>

    </div>
  );
}