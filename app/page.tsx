import Link from "next/link";
import Button from "../components/ui/Button";
import Container from "../components/ui/Container";

export default function HomePage() {
  return (
    <>
      {/* 🏆 HERO SECTION */}
      <section className="relative bg-gradient-to-b from-amber-50 to-white py-20 md:py-32">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Texte */}
            <div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-amber-900 mb-4">
                VANILLE’OR
              </h1>
              <p className="text-xl md:text-2xl text-amber-700 italic mb-6">
                L'essence précieuse de Madagascar
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Bienvenue chez Vanille’Or, votre spécialiste de la vanille d'exception 
                en provenance de Madagascar. Nous sélectionnons et exportons les meilleures 
                gousses de vanille pour sublimer vos créations.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button href="/products" variant="primary" className="text-lg">
                  DÉCOUVRIR NOS PRODUITS
                </Button>
                <Button href="/contact" variant="outline" className="text-lg">
                  NOUS CONTACTER
                </Button>
              </div>
              {/* Téléphone visible */}
              <div className="mt-8 flex items-center text-amber-800">
                <span className="text-2xl mr-3">📞</span>
                <a href="tel:+33622111375" className="text-xl font-semibold hover:underline">
                  06 22 11 13 75
                </a>
              </div>
            </div>

            {/* Image (placeholder) */}
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-amber-200 flex items-center justify-center">
              <span className="text-amber-800 text-2xl">🍦 Image vanille</span>
            </div>
          </div>
        </Container>
      </section>

      {/* 💎 ENGAGEMENT ÉTHIQUE */}
      <section className="py-20 bg-white">
        <Container>
          <h2 className="text-4xl font-serif font-bold text-center text-amber-900 mb-16">
            Notre Engagement Éthique
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Carte 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌿</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Qualité Exceptionnelle</h3>
              <p className="text-gray-600">
                Sélection artisanale pour une qualité irréprochable
              </p>
            </div>

            {/* Carte 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Traçabilité Totale</h3>
              <p className="text-gray-600">
                De la plantation à votre cuisine, chaque lot est suivi
              </p>
            </div>

            {/* Carte 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Commerce Équitable</h3>
              <p className="text-gray-600">
                Relation directe avec les producteurs malgaches
              </p>
            </div>

            {/* Carte 4 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Environnement</h3>
              <p className="text-gray-600">
                Techniques de culture durables et responsables
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 🛍️ NOS PRODUITS */}
      <section className="py-20 bg-amber-50">
        <Container>
          <h2 className="text-4xl font-serif font-bold text-center text-amber-900 mb-4">
            Nos Produits
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Découvrez notre sélection de vanilles d'exception, directement importées de Madagascar
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Produit 1 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="h-64 bg-amber-200 flex items-center justify-center">
                <span className="text-amber-800">🍦 Image</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Vanille Bourbon</h3>
                <p className="text-gray-600 mb-4">Gousses premium de Madagascar</p>
                <p className="text-2xl font-bold text-amber-800 mb-4">14,90 €</p>
                <Button href="/product/vanille-bourbon" variant="primary" className="w-full">
                  Découvrir
                </Button>
              </div>
            </div>

            {/* Produit 2 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="h-64 bg-amber-200 flex items-center justify-center">
                <span className="text-amber-800">🍦 Image</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Vanille Gourmet</h3>
                <p className="text-gray-600 mb-4">Sélection exceptionnelle</p>
                <p className="text-2xl font-bold text-amber-800 mb-4">19,90 €</p>
                <Button href="/product/vanille-gourmet" variant="primary" className="w-full">
                  Découvrir
                </Button>
              </div>
            </div>

            {/* Produit 3 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="h-64 bg-amber-200 flex items-center justify-center">
                <span className="text-amber-800">🍦 Image</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Coffret Découverte</h3>
                <p className="text-gray-600 mb-4">3 variétés de vanille</p>
                <p className="text-2xl font-bold text-amber-800 mb-4">39,90 €</p>
                <Button href="/product/coffret" variant="primary" className="w-full">
                  Découvrir
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button href="/products" variant="outline" className="text-lg">
              VOIR TOUS NOS PRODUITS →
            </Button>
          </div>
        </Container>
      </section>

      {/* 💼 SECTION B2B */}
      <section className="py-20 bg-white">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-serif font-bold text-amber-900 mb-4">
                OFFRES B2B
              </h2>
              <p className="text-2xl text-amber-700 italic mb-6">
                Vanille de Madagascar en gros et en exclusivité
              </p>
              <p className="text-gray-700 mb-8">
                Pour les grossistes, distributeurs et transformateurs qui recherchent 
                la meilleure qualité de vanille en gros avec un service premium.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <span className="text-amber-700 font-bold mr-3">•</span>
                  <span><strong>Grossistes :</strong> Achats en gros, tarifs dégressifs, livraison rapide</span>
                </div>
                <div className="flex items-start">
                  <span className="text-amber-700 font-bold mr-3">•</span>
                  <span><strong>Revendeurs :</strong> Volume réduit, marque blanche, outils marketing</span>
                </div>
                <div className="flex items-start">
                  <span className="text-amber-700 font-bold mr-3">•</span>
                  <span><strong>Industriels :</strong> Qualité exceptionnelle, certifications, contrôle rigoureux</span>
                </div>
              </div>

              <Button href="/b2b" variant="primary" className="text-lg">
                OBTENIR UN DEVIS PERSONNALISÉ →
              </Button>
            </div>

            {/* Chiffres clés */}
            <div className="bg-amber-50 p-8 rounded-2xl shadow-lg">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-amber-800">+2T</div>
                  <p className="text-gray-600">Exportés chaque année</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-amber-800">250+</div>
                  <p className="text-gray-600">Clients professionnels</p>
                </div>
                <div className="text-center col-span-2">
                  <div className="text-4xl font-bold text-amber-800">20+</div>
                  <p className="text-gray-600">Pays livrés</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ❓ FAQ */}
      <section className="py-20 bg-amber-50">
        <Container>
          <h2 className="text-4xl font-serif font-bold text-center text-amber-900 mb-12">
            Questions Fréquentes
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Quelle est l'origine de votre vanille ?</h3>
                <p className="text-gray-600">Notre vanille provient exclusivement de Madagascar, de plantations partenaires soigneusement sélectionnées.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Proposez-vous des tarifs pour les professionnels ?</h3>
                <p className="text-gray-600">Oui, nous avons une gamme B2B avec des tarifs dégressifs. Contactez-nous pour un devis personnalisé.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Quels sont les délais de livraison ?</h3>
                <p className="text-gray-600">Livraison en 48-72h en France métropolitaine, et 5-7 jours pour l'international.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Comment conserver la vanille ?</h3>
                <p className="text-gray-600">Dans un endroit sec, à l'abri de la lumière, dans son tube scellé ou au congélateur.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Votre vanille est-elle certifiée ?</h3>
                <p className="text-gray-600">Oui, nous disposons de certifications de traçabilité et de commerce équitable.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Une question supplémentaire ?</p>
            <Button href="/contact" variant="outline">
              CONTACTER VANILLE’OR
            </Button>
          </div>
        </Container>
      </section>

      {/* 📝 BLOG */}
      <section className="py-20 bg-white">
        <Container>
          <h2 className="text-4xl font-serif font-bold text-center text-amber-900 mb-12">
            Nos Derniers Articles
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Article 1 */}
            <div className="bg-amber-50 p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Les Secrets de la Vanille Bourbon</h3>
              <p className="text-sm text-amber-600 mb-3">Avril 2024</p>
              <p className="text-gray-600 mb-4">Découvrez l'histoire et les particularités de la Vanille Bourbon...</p>
              <Link href="/blog/vanille-bourbon" className="text-amber-700 hover:underline font-medium">
                Lire la suite →
              </Link>
            </div>

            {/* Article 2 */}
            <div className="bg-amber-50 p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Bien Conserver sa Vanille</h3>
              <p className="text-sm text-amber-600 mb-3">Mars 2024</p>
              <p className="text-gray-600 mb-4">La meilleure méthode pour conserver l'éclat de votre vanille...</p>
              <Link href="/blog/conservation" className="text-amber-700 hover:underline font-medium">
                Lire la suite →
              </Link>
            </div>

            {/* Article 3 */}
            <div className="bg-amber-50 p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">Vanille: 5 Astuces de Chef</h3>
              <p className="text-sm text-amber-600 mb-3">Février 2024</p>
              <p className="text-gray-600 mb-4">Les astuces des chefs pour utiliser la vanille comme un pro...</p>
              <Link href="/blog/astuces-chef" className="text-amber-700 hover:underline font-medium">
                Lire la suite →
              </Link>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/blog" className="text-amber-700 font-semibold hover:underline">
              Voir tous les articles →
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}