import Link from "next/link";

export const metadata = {
  title: "Blog Vanille | Conseils et recettes",
  description:
    "Découvrez nos conseils autour de la vanille, pâtisserie, recettes et qualité des produits.",
};

const articles = [
  {
    slug: "utiliser-vanille-patisserie",
    title: "Comment utiliser la vanille en pâtisserie",
  },
  {
    slug: "choisir-bonne-vanille",
    title: "Comment reconnaître une bonne vanille",
  },
  {
    slug: "pourquoi-vanille-madagascar",
    title: "Pourquoi la vanille de Madagascar est la meilleure",
  },
];

export default function BlogPage() {
  return (
    <div style={{ maxWidth: "900px", margin: "60px auto", padding: "20px" }}>
      <h1 style={{ marginBottom: "30px" }}>Blog Vanille’Or</h1>

      {articles.map((article) => (
        <div key={article.slug} style={{ marginBottom: "20px" }}>
          <Link href={`/blog/${article.slug}`}>
            {article.title}
          </Link>
        </div>
      ))}
    </div>
  );
}