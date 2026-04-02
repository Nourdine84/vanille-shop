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

/* 🔥 ARTICLES SEO (fallback + contenu optimisé Google) */
const staticArticles: Article[] = [
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

export default async function BlogPage() {
  let dbPosts: any[] = [];

  try {
    const prisma = (await import("@/lib/prisma")).prisma as any;

dbPosts = await prisma.blogPost.findMany({
  orderBy: { createdAt: "desc" },
});
  } catch (e) {
    console.error("BLOG DB ERROR:", e);
  }

  return (
    <div style={container}>
      {/* TITLE */}
      <h1 style={title}>Blog Vanille’Or</h1>

      {/* INTRO SEO */}
      <p style={intro}>
        Découvrez nos conseils pour utiliser la{" "}
        <Link href="/vanille-madagascar">
          vanille de Madagascar premium
        </Link>
        , choisir les meilleures gousses et sublimer vos recettes.
      </p>

      {/* 🔥 ARTICLES DB (PRIORITÉ) */}
      {dbPosts.length > 0 && (
        <>
          <h2 style={sectionTitle}>🆕 Articles récents</h2>

          <div style={grid}>
            {dbPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                style={card}
                data-testid="blog-link"
              >
                <h3 style={cardTitle}>{post.title}</h3>

                {post.excerpt && (
                  <p style={excerpt}>{post.excerpt}</p>
                )}

                {post.coverImage && (
                <img src={post.coverImage} style={cardImage} />
                )}

                <span style={readMore}>Lire l’article →</span>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* 🔥 ARTICLES SEO STATIQUES */}
      <h2 style={sectionTitle}>📚 Guides essentiels</h2>

      <div style={list}>
        {staticArticles.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            style={link}
            data-testid="blog-link"
          >
            {article.title}
          </Link>
        ))}
      </div>

      {/* SEO LINKING */}
      <div style={seoBlock}>
        <p>Explorez également :</p>

        <div style={{ marginTop: 8 }}>
          <Link href="/vanille-madagascar">Vanille Madagascar</Link> |{" "}
          <Link href="/acheter-vanille">Acheter vanille</Link> |{" "}
          <Link href="/vanille-patisserie">Vanille pâtisserie</Link>
        </div>
      </div>

      {/* CTA */}
      <div style={ctaWrapper}>
        <Link href="/products" data-testid="blog-cta" style={cta}>
          Voir nos produits
        </Link>
      </div>
    </div>
  );
}

/* ================= STYLE ================= */

const container = {
  maxWidth: "1000px",
  margin: "60px auto",
  padding: "20px",
};

const title = {
  fontSize: "34px",
  marginBottom: "20px",
};

const intro = {
  color: "#666",
  marginBottom: "40px",
  lineHeight: 1.6,
};

const sectionTitle = {
  margin: "30px 0 15px",
};

const grid = {
  display: "grid",
  gap: "20px",
  marginBottom: "30px",
};

const card = {
  display: "block",
  padding: "20px",
  borderRadius: "12px",
  background: "white",
  textDecoration: "none",
  color: "black",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  transition: "0.2s",
};

const cardTitle = {
  margin: "0 0 8px 0",
};

const excerpt = {
  color: "#666",
  fontSize: "14px",
};

const readMore = {
  display: "inline-block",
  marginTop: "10px",
  color: "#a16207",
  fontWeight: 600,
};

const list = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "12px",
};

const link = {
  fontWeight: 600,
  color: "#a16207",
  textDecoration: "none",
};

const seoBlock = {
  marginTop: "40px",
  textAlign: "center" as const,
};

const ctaWrapper = {
  marginTop: "40px",
  textAlign: "center" as const,
};

const cta = {
  background: "#a16207",
  color: "white",
  padding: "12px 20px",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: 600,
};

const cardImage = {
  width: "100%",
  height: "160px",
  objectFit: "cover" as const,
  borderRadius: "10px",
  marginBottom: "10px",
};