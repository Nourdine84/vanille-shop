"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import AddToCartButton from "../../../components/AddToCartButton";
import QuantitySelector from "../../../components/QuantitySelector";

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  priceCents: number;
  imageUrl: string | null;
};

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${params.slug}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.slug]);

  if (loading) return <div className="container mx-auto py-16">Chargement...</div>;
  if (!product) return notFound();

  return (
    <div className="container mx-auto py-16">
      <div className="grid md:grid-cols-2 gap-12">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="rounded-lg"
          />
        )}

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>
          <p className="text-2xl font-semibold mb-6">
            {(product.priceCents / 100).toFixed(2)} €
          </p>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}