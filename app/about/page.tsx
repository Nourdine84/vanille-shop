export default function AboutPage() {
    return (
      <div className="max-w-4xl mx-auto py-20 px-6">
  
        {/* 🔥 IMAGE ICI */}
        <img
          src="/images/about-vanille.jpg"
          alt="Vanille premium"
          className="rounded-xl mb-10 w-full h-64 object-cover"
        />
  
        <h1 className="text-4xl font-bold mb-10 text-center">
          À propos de Vanille’Or
        </h1>
  
        <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
  
          <p>
            Vanille’Or est née d’un lien fort entre la France et Madagascar,
            porté par des racines familiales et une volonté de proposer un produit
            d’exception accessible.
          </p>
  
          <p>
            Nous avons fait le choix d’un circuit court en collaborant directement
            avec un producteur local, garantissant une qualité constante et une
            traçabilité complète.
          </p>
  
          <p>
            Chaque gousse est le fruit d’un savoir-faire précieux, héritage d’une
            découverte majeure réalisée par Edmond Albius, qui a permis à la
            vanille de révéler tout son potentiel à travers le monde.
          </p>
  
          <p>
            Nous sélectionnons rigoureusement nos produits afin d’offrir une
            vanille premium, adaptée aussi bien aux passionnés qu’aux
            professionnels exigeants.
          </p>
  
          <p>
            Vanille’Or s’inscrit dans une vision plus large : proposer une gamme
            d’ingrédients nobles — vanille, cannelle, cacao, poivre — issus de
            Madagascar.
          </p>
  
          <p className="font-semibold text-center mt-10">
            Vanille’Or, l’alliance entre héritage, authenticité et excellence.
          </p>
  
        </div>
  
      </div>
    );
  }