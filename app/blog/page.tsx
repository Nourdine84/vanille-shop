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
  image: string;
};

/* 🔥 ARTICLES SEO + IMAGE */
const staticArticles: Article[] = [
  {
    slug: "utiliser-vanille-patisserie",
    title: "Comment utiliser la vanille en pâtisserie",
    image: "/blog/vanille-patisserie.jpg",
  },
  {
    slug: "choisir-bonne-vanille",
    title: "Comment reconnaître une bonne vanille",
    image: "/blog/bonne-vanille.jpg",
  },
  {
    slug: "pourquoi-vanille-madagascar",
    title: "Pourquoi la vanille de Madagascar est la meilleure",
    image: "/blog/madagascar-vanille.jpg",
  },
];

function getImage(img?: string) {
  if (!img) return "/blog/default.jpg";
  if (img.startsWith("http")) return img;
  return img;
}

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
      <h1 style={title}>Blog Vanille’Or</h1>

      <p style={intro}>
        Découvrez nos conseils pour utiliser la{" "}
        <Link href="/vanille-madagascar">
          vanille de Madagascar premium
        </Link>
        , choisir les meilleures gousses et sublimer vos recettes.
      </p>

      {/* ARTICLES DB */}
      {dbPosts.length > 0 && (
        <>
          <h2 style={sectionTitle}>🆕 Articles récents</h2>

          <div style={grid}>
            {dbPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={card}>
                <img
                  src={getImage(post.coverImage)}
                  alt={post.title}
                  style={cardImage}
                />

                <h3 style={cardTitle}>{post.title}</h3>

                {post.excerpt && (
                  <p style={excerpt}>{post.excerpt}</p>
                )}

                <span style={readMore}>Lire →</span>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* ARTICLES STATIQUES */}
      <h2 style={sectionTitle}>📚 Guides essentiels</h2>

      <div style={grid}>
        {staticArticles.map((article) => (
          <Link key={article.slug} href={`/blog/${article.slug}`} style={card}>
            <img
              src={article.image}
              alt={article.title}
              style={cardImage}
            />

            <h3 style={cardTitle}>{article.title}</h3>

            <span style={readMore}>Lire →</span>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div style={ctaWrapper}>
        <Link href="/products" style={cta}>
          Voir nos produits
        </Link>
      </div>
    </div>
  );
}

/* STYLE */

const container = {
  maxWidth: "1100px",
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
  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
  gap: "20px",
};

const card = {
  display: "block",
  padding: "15px",
  borderRadius: "12px",
  background: "white",
  textDecoration: "none",
  color: "black",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
};

const cardImage = {
  width: "100%",
  height: "180px",
  objectFit: "cover" as const,
  borderRadius: "10px",
  marginBottom: "10px",
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
};