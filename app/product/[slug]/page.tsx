import React from "react";
import AddToCart from "../../../components/add-to-cart";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string;
};

async function getProduct(slug: string): Promise<Product | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/products/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);

  if (!product) {
    return (
      <div className="container py-10">
        <h1>Produit introuvable</h1>
      </div>
    );
  }

  // Simulation (tu brancheras plus tard avec ta DB)
  const fakeStock = Math.floor(Math.random() * 8) + 3;
  const isLowStock = fakeStock <= 5;

  return (
    <div className="max-w-7xl mx-auto py-20 px-6">
      <div className="grid md:grid-cols-2 gap-16 items-start">

        {/* IMAGE */}
        <div>
          <div className="relative">
            <img
              src={product.imageUrl || "/images/placeholder.jpg"}
              alt={product.name}
              className="rounded-2xl shadow-lg w-full"
            />

            {/* BADGES */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-amber-700 text-white text-xs px-3 py-1 rounded-full">
                Premium
              </span>

              <span className="bg-black text-white text-xs px-3 py-1 rounded-full">
                Best Seller
              </span>
            </div>
          </div>
        </div>

        {/* CONTENU */}
        <div>

          <p className="text-xs tracking-[3px] uppercase text-amber-700 mb-3">
            Vanille Or
          </p>

          <h1 className="text-4xl font-bold mb-4">
            {product.name}
          </h1>

          {/* ⭐ AVIS */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-amber-500">★★★★★</span>
            <span className="text-sm text-gray-500">
              (42 avis clients)
            </span>
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {product.description}
          </p>

          <p className="text-3xl font-bold mb-4">
            {(product.priceCents / 100).toFixed(2)} €
          </p>

          {/* 🚨 URGENCE */}
          {isLowStock && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              ⚠️ Plus que <strong>{fakeStock}</strong> en stock
            </div>
          )}

          {/* CTA */}
          <div className="mb-6">
            <AddToCart
              product={{
                id: product.id,
                name: product.name,
                priceCents: product.priceCents,
                imageUrl: product.imageUrl,
              }}
            />
          </div>

          {/* RASSURANCE */}
          <div className="space-y-3 text-sm text-gray-600 mb-8">
            <p>✔ Livraison rapide 48h</p>
            <p>✔ Satisfait ou remboursé</p>
            <p>✔ Qualité premium garantie</p>
          </div>

          {/* STORYTELLING */}
          <div className="bg-[#fffdf9] border border-[#ece7df] rounded-xl p-6">
            <h3 className="font-semibold mb-2">
              Pourquoi choisir Vanille Or ?
            </h3>

            <p className="text-sm text-gray-600 leading-relaxed">
              Une sélection rigoureuse de gousses de vanille haut de gamme,
              choisies pour leur intensité aromatique exceptionnelle.
              Idéale pour sublimer toutes vos recettes.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}