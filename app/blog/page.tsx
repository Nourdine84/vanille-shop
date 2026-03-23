import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Vanille | Conseils et recettes",
  description:
    "Découvrez nos conseils autour de la vanille, pâtisserie, recettes et qualité des produits.",
};

type Article = {
  slug: string;
  title: string;
};

const articles: Article[] = [
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
    <div
      style={{
        maxWidth: "900px",
        margin: "60px auto",
        padding: "20px",
      }}
    >
      {/* TITLE */}
      <h1 style={{ marginBottom: "20px" }}>Blog Vanille’Or</h1>

      {/* INTRO SEO */}
      <p
        style={{
          color: "#666",
          marginBottom: "30px",
          lineHeight: 1.6,
        }}
      >
        Découvrez nos conseils pour utiliser la{" "}
        <Link href="/vanille-madagascar">
          vanille de Madagascar premium
        </Link>
        , choisir les meilleures gousses et sublimer vos recettes.
      </p>

      {/* ARTICLES */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            data-testid="blog-link" // 🔥 QA
            style={{
              fontWeight: "600",
              color: "#a16207",
              textDecoration: "none",
            }}
          >
            {article.title}
          </Link>
        ))}
      </div>

      {/* SEO LINKING */}
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <p style={{ marginBottom: "10px" }}>
          Explorez également :
        </p>

        <Link href="/vanille-madagascar">Vanille Madagascar</Link> |{" "}
        <Link href="/acheter-vanille">Acheter vanille</Link> |{" "}
        <Link href="/vanille-patisserie">Vanille pâtisserie</Link>
      </div>

      {/* CTA */}
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <Link
          href="/products"
          data-testid="blog-cta"
          style={{
            background: "#a16207",
            color: "white",
            padding: "10px 18px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          Voir nos produits
        </Link>
      </div>
    </div>
  );
}