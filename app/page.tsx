import Link from "next/link";

export default function HomePage() {
  return (
    <div>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        
        <div>
          <p className="text-xs tracking-[3px] uppercase text-amber-700 mb-4">
            Vanille premium
          </p>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            L’excellence de la vanille de Madagascar
          </h1>

          <p className="text-gray-600 text-lg mb-8">
            Une vanille soigneusement sélectionnée pour révéler toute la richesse
            de vos recettes. Arômes intenses, qualité supérieure, expérience unique.
          </p>

          <div className="flex gap-4">
            <Link
              href="/products"
              className="bg-amber-700 text-white px-6 py-4 rounded-xl font-medium hover:bg-amber-800 transition"
            >
              Découvrir nos produits
            </Link>

            <Link
              href="/products"
              className="border border-gray-300 px-6 py-4 rounded-xl font-medium hover:bg-gray-100 transition"
            >
              Voir la collection
            </Link>
          </div>
        </div>

        <div>
          <img
            src="/images/hero-vanille.jpg"
            alt="Vanille premium"
            className="rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* USP */}
      <section className="bg-[#fffdf9] py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          
          <div>
            <h3 className="font-semibold text-lg mb-2">
              🌿 Origine Madagascar
            </h3>
            <p className="text-gray-600 text-sm">
              Une vanille reconnue mondialement pour sa qualité exceptionnelle.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">
              ⭐ Qualité premium
            </h3>
            <p className="text-gray-600 text-sm">
              Sélection rigoureuse pour garantir un produit haut de gamme.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">
              🚚 Livraison rapide
            </h3>
            <p className="text-gray-600 text-sm">
              Expédition rapide en France et en Europe.
            </p>
          </div>

        </div>
      </section>

      {/* CTA PRODUITS */}
      <section className="max-w-6xl mx-auto py-20 px-6 text-center">
        
        <h2 className="text-3xl font-bold mb-6">
          Sublimez vos créations
        </h2>

        <p className="text-gray-600 mb-10 max-w-xl mx-auto">
          Que vous soyez professionnel ou passionné, notre vanille s’adapte à toutes
          vos envies culinaires.
        </p>

        <Link
          href="/products"
          className="bg-black text-white px-8 py-4 rounded-xl font-medium hover:opacity-90 transition"
        >
          Accéder à la boutique
        </Link>
      </section>

      {/* PREUVE SOCIALE */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          
          <h2 className="text-3xl font-bold mb-10">
            Ils nous font confiance
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <p className="text-sm text-gray-600 mb-4">
                “Une qualité incroyable, le parfum est juste exceptionnel.”
              </p>
              <p className="font-semibold">Pâtissier</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <p className="text-sm text-gray-600 mb-4">
                “Produit premium, rien à voir avec ce qu’on trouve ailleurs.”
              </p>
              <p className="font-semibold">Client particulier</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <p className="text-sm text-gray-600 mb-4">
                “Parfait pour mes desserts, je recommande à 100%.”
              </p>
              <p className="font-semibold">Chef</p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}