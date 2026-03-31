import Link from "next/link";

export const metadata = {
  title: "Utiliser la vanille en pâtisserie | Vanille’Or",
  description:
    "Découvrez comment utiliser la vanille de Madagascar dans vos pâtisseries pour des résultats exceptionnels.",
};

export default function ArticlePage() {
  return (
    <div style={{ maxWidth: "900px", margin: "60px auto", padding: "20px" }}>

      <h1>Comment utiliser la vanille en pâtisserie</h1>

      <p style={{ margin: "20px 0" }}>
        La vanille est un ingrédient incontournable pour sublimer vos desserts.
        Elle apporte des arômes naturels puissants et une profondeur unique.
      </p>

      <h2>Utilisation classique</h2>
      <p>
        Vous pouvez infuser une gousse dans du lait ou de la crème pour parfumer
        vos préparations.
      </p>

      <h2>Conseil professionnel</h2>
      <p>
        Préférez une vanille de Madagascar premium pour obtenir un résultat optimal.
      </p>

      <Link href="/products">Voir nos produits</Link>

    </div>
  );
}