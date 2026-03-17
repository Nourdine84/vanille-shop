import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-amber-50">

      {/* HERO */}

      <section className="max-w-6xl mx-auto px-6 py-24 text-center">

        <h1 className="text-5xl font-bold text-amber-900 mb-6">
          Vanille Bourbon de Madagascar
        </h1>

        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-10">
          Découvrez une vanille d’exception, récoltée à Madagascar
          et sélectionnée pour sa richesse aromatique.
        </p>

        <Link
          href="/products"
          className="bg-amber-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-amber-800 transition"
        >
          Découvrir nos produits
        </Link>

      </section>

    </main>
  );
}

 