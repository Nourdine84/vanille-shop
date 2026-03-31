import Link from "next/link";

export const metadata = {
  title: "Pourquoi la vanille de Madagascar est la meilleure | Vanille’Or",
  description:
    "Découvrez pourquoi la vanille de Madagascar est considérée comme la meilleure au monde.",
};

export default function ArticlePage() {
  return (
    <div style={{ maxWidth: "900px", margin: "60px auto", padding: "20px" }}>

      <h1>Pourquoi la vanille de Madagascar est la meilleure</h1>

      <p style={{ margin: "20px 0" }}>
        La vanille de Madagascar est reconnue mondialement pour sa qualité exceptionnelle.
        Elle est utilisée par les plus grands chefs et pâtissiers.
      </p>

      <h2>Un climat unique</h2>
      <p>
        Madagascar offre des conditions idéales pour la culture de la vanille,
        donnant naissance à des gousses riches en arômes.
      </p>

      <h2>Un savoir-faire artisanal</h2>
      <p>
        La transformation de la vanille repose sur un processus long et précis,
        garantissant une qualité premium.
      </p>

      <Link href="/products">Voir nos produits</Link>

    </div>
  );
}