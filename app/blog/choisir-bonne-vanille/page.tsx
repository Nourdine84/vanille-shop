import Link from "next/link";

export const metadata = {
  title: "Comment reconnaître une bonne vanille | Vanille’Or",
  description:
    "Apprenez à reconnaître une vanille de qualité premium : gousses charnues, arômes intenses et origine Madagascar.",
};

export default function ArticlePage() {
  return (
    <div style={{ maxWidth: "900px", margin: "60px auto", padding: "20px" }}>

      <h1>Comment reconnaître une bonne vanille</h1>

      <p style={{ margin: "20px 0" }}>
        Une bonne vanille se distingue par son aspect, son parfum et sa texture.
        Voici les critères essentiels à connaître.
      </p>

      <h2>Les signes de qualité</h2>
      <ul>
        <li>✔ Gousse souple et charnue</li>
        <li>✔ Aspect légèrement brillant</li>
        <li>✔ Parfum intense et naturel</li>
      </ul>

      <h2>Origine et importance</h2>
      <p>
        La vanille de Madagascar est réputée pour sa richesse aromatique,
        idéale pour les desserts et préparations haut de gamme.
      </p>

      <Link href="/products">Voir nos produits</Link>

    </div>
  );
}