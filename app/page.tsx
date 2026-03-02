export default function HomePage() {
  return (
    <div className="container py-20">
      <h1 className="text-4xl font-bold mb-6">
        Vanille Bourbon Premium
      </h1>

      <p className="text-lg text-gray-600 mb-8">
        Découvrez notre sélection de vanilles haut de gamme,
        directement importées de Madagascar.
      </p>

      <a
        href="/products"
        className="btn-primary"
      >
        Voir les produits
      </a>
    </div>
  );
}
