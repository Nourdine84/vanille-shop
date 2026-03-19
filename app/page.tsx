import Link from "next/link";

export default function HomePage() {
  return (
    <div>

      {/* HERO */}
      <section
        className="relative h-[80vh] flex items-center justify-center text-white text-center"
        style={{
          backgroundImage: "url('/images/hero-vanille.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-black/50 absolute inset-0" />

        <div className="relative z-10 max-w-2xl px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            L’excellence de la vanille de Madagascar
          </h1>

          <p className="mb-8 text-lg text-gray-200">
            Une qualité premium sélectionnée pour sublimer vos pâtisseries et créations.
          </p>

          <Link
            href="/products"
            className="bg-amber-700 px-8 py-4 rounded-lg text-lg font-medium hover:bg-amber-800 transition"
          >
            Découvrir nos produits
          </Link>
        </div>
      </section>

      {/* SECTION CONFIANCE */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">

          <div>
            <h3 className="text-xl font-semibold mb-2">🌿 Qualité Premium</h3>
            <p className="text-gray-600">
              Vanille soigneusement sélectionnée à Madagascar
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">🚚 Livraison rapide</h3>
            <p className="text-gray-600">
              Expédition en 24-48h en France et Europe
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">🔒 Paiement sécurisé</h3>
            <p className="text-gray-600">
              Transactions 100% sécurisées avec Stripe
            </p>
          </div>

        </div>
      </section>

      {/* PRODUITS EN VEDETTE */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-10">
            Nos produits
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {/* CARD 1 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <img
                src="/images/vanille-500g.jpg"
                alt="Vanille"
                className="rounded-lg mb-4"
              />
              <h3 className="font-semibold mb-2">Vanille Gourmet</h3>
              <p className="text-gray-600 mb-4">
                Gousses charnues et parfum intense
              </p>
              <Link
                href="/products"
                className="text-amber-700 font-medium"
              >
                Voir →
              </Link>
            </div>

            {/* CARD 2 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <img
                src="/images/vanille-500g.jpg"
                alt="Vanille"
                className="rounded-lg mb-4"
              />
              <h3 className="font-semibold mb-2">Qualité Premium</h3>
              <p className="text-gray-600 mb-4">
                Idéale pour pâtisserie et cuisine
              </p>
              <Link
                href="/products"
                className="text-amber-700 font-medium"
              >
                Voir →
              </Link>
            </div>

            {/* CARD 3 */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <img
                src="/images/vanille-500g.jpg"
                alt="Vanille"
                className="rounded-lg mb-4"
              />
              <h3 className="font-semibold mb-2">Format économique</h3>
              <p className="text-gray-600 mb-4">
                Parfait pour les professionnels
              </p>
              <Link
                href="/products"
                className="text-amber-700 font-medium"
              >
                Voir →
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-6 bg-amber-700 text-white text-center">
        <h2 className="text-3xl font-bold mb-6">
          Sublimez vos créations dès aujourd’hui
        </h2>

        <Link
          href="/products"
          className="bg-white text-amber-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100"
        >
          Commander maintenant
        </Link>
      </section>

    </div>
  );
}