import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog Vanille’Or | Vanille, épices & conseils premium",
  description:
    "Découvrez nos guides premium autour de la vanille de Madagascar, des épices rares, de la pâtisserie et des usages professionnels.",
};

type Article = {
  slug: string;
  title: string;
  image: string;
  excerpt: string;
  category: string;
};

/* =========================
   ARTICLES STATIC SEO
========================= */

const staticArticles: Article[] = [
  {
    slug: "utiliser-vanille-patisserie",
    title: "Comment utiliser la vanille en pâtisserie",
    image: "/blog/vanille-patisserie.jpg",
    category: "Pâtisserie",
    excerpt:
      "Découvrez comment exploiter toute la puissance aromatique de la vanille premium dans vos desserts.",
  },
  {
    slug: "choisir-bonne-vanille",
    title: "Comment reconnaître une bonne vanille",
    image: "/blog/bonne-vanille.jpg",
    category: "Guide",
    excerpt:
      "Texture, parfum, taux d’humidité : apprenez à reconnaître une vanille de qualité professionnelle.",
  },
  {
    slug: "pourquoi-vanille-madagascar",
    title: "Pourquoi la vanille de Madagascar est la meilleure",
    image: "/blog/madagascar-vanille.jpg",
    category: "Madagascar",
    excerpt:
      "La vanille Bourbon de Madagascar est reconnue mondialement pour son intensité aromatique unique.",
  },
];

/* =========================
   HELPERS
========================= */

function getImage(img?: string) {
  if (!img) return "/blog/default.jpg";
  if (img.startsWith("http")) return img;
  return img;
}

/* =========================
   PAGE
========================= */

export default async function BlogPage() {
  let dbPosts: any[] = [];

  try {
    const prisma = (await import("@/lib/prisma")).prisma as any;

    dbPosts = await prisma.blogPost.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (e) {
    console.error("BLOG DB ERROR:", e);
  }

  return (
    <div style={page}>
      {/* ================= HERO ================= */}

      <section style={hero}>
        <div style={heroOverlay} />

        <div style={heroContent}>
          <p style={heroTag}>
            BLOG VANILLE’OR
          </p>

          <h1 style={heroTitle}>
            Conseils, recettes <br />
            & expertise premium
          </h1>

          <p style={heroText}>
            Découvrez nos articles autour de la vanille,
            des épices rares, de la gastronomie et des
            usages professionnels.
          </p>
        </div>
      </section>

      {/* ================= INTRO ================= */}

      <section style={section}>
        <div style={introBox}>
          <p style={intro}>
            Explorez nos contenus autour de la{" "}
            <Link
              href="/collections/vanille"
              style={inlineLink}
            >
              vanille premium de Madagascar
            </Link>
            , des épices rares et des conseils culinaires
            destinés aux particuliers comme aux professionnels.
          </p>
        </div>
      </section>

      {/* ================= DB POSTS ================= */}

      {dbPosts.length > 0 && (
        <section style={sectionAlt}>
          <div style={sectionHeader}>
            <div>
              <p style={eyebrow}>
                ARTICLES RÉCENTS
              </p>

              <h2 style={sectionTitle}>
                Dernières publications
              </h2>
            </div>
          </div>

          <div style={grid}>
            {dbPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                style={card}
              >
                <div style={imageWrapper}>
                  <img
                    src={getImage(post.coverImage)}
                    alt={post.title}
                    style={cardImage}
                  />

                  <div style={gradient} />

                  <div style={categoryBadge}>
                    Blog
                  </div>
                </div>

                <div style={cardContent}>
                  <h3 style={cardTitle}>
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p style={excerpt}>
                      {post.excerpt}
                    </p>
                  )}

                  <span style={readMore}>
                    Lire l’article →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ================= STATIC SEO ARTICLES ================= */}

      <section style={section}>
        <div style={sectionHeader}>
          <div>
            <p style={eyebrow}>
              GUIDES PREMIUM
            </p>

            <h2 style={sectionTitle}>
              Nos guides essentiels
            </h2>
          </div>
        </div>

        <div style={grid}>
          {staticArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              style={card}
            >
              <div style={imageWrapper}>
                <img
                  src={article.image}
                  alt={article.title}
                  style={cardImage}
                />

                <div style={gradient} />

                <div style={categoryBadge}>
                  {article.category}
                </div>
              </div>

              <div style={cardContent}>
                <h3 style={cardTitle}>
                  {article.title}
                </h3>

                <p style={excerpt}>
                  {article.excerpt}
                </p>

                <span style={readMore}>
                  Lire l’article →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}

      <section style={ctaSection}>
        <div style={ctaCard}>
          <p style={eyebrowLight}>
            VANILLE’OR
          </p>

          <h2 style={ctaTitle}>
            Découvrez nos produits premium
          </h2>

          <p style={ctaText}>
            Vanille gourmet, cacao, poivre sauvage
            et sélections artisanales directement
            importées de Madagascar.
          </p>

          <Link href="/products" style={ctaBtn}>
            Voir le catalogue
          </Link>
        </div>
      </section>
    </div>
  );
}

/* =========================
   STYLE
========================= */

const page = {
  background: "#f8f5ef",
};

const hero = {
  position: "relative" as const,
  minHeight: "55vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center" as const,
  padding: "40px 20px",
  backgroundImage:
    "url('/images/hero-vanille.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const heroOverlay = {
  position: "absolute" as const,
  inset: 0,
  background:
    "linear-gradient(135deg,#000000dd,#2a2117cc)",
};

const heroContent = {
  position: "relative" as const,
  zIndex: 2,
  maxWidth: "800px",
};

const heroTag = {
  color: "#d4af37",
  fontWeight: 700,
  letterSpacing: "0.2em",
  fontSize: "12px",
  marginBottom: "18px",
};

const heroTitle = {
  color: "white",
  fontSize: "clamp(36px,6vw,64px)",
  lineHeight: 1.1,
  fontWeight: 800,
  marginBottom: "20px",
};

const heroText = {
  color: "#ddd",
  lineHeight: 1.8,
  fontSize: "17px",
};

const section = {
  padding: "80px 20px",
};

const sectionAlt = {
  padding: "80px 20px",
  background: "white",
};

const introBox = {
  maxWidth: "900px",
  margin: "0 auto",
};

const intro = {
  textAlign: "center" as const,
  lineHeight: 1.9,
  color: "#666",
  fontSize: "17px",
};

const inlineLink = {
  color: "#a16207",
  fontWeight: 700,
  textDecoration: "none",
};

const sectionHeader = {
  maxWidth: "1200px",
  margin: "0 auto 40px",
};

const eyebrow = {
  color: "#a16207",
  fontWeight: 700,
  letterSpacing: "0.15em",
  fontSize: "12px",
  marginBottom: "10px",
};

const eyebrowLight = {
  color: "#f3d7a1",
  fontWeight: 700,
  letterSpacing: "0.15em",
  fontSize: "12px",
  marginBottom: "10px",
};

const sectionTitle = {
  fontSize: "clamp(30px,5vw,44px)",
  fontWeight: 800,
  lineHeight: 1.2,
};

const grid = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(300px,1fr))",
  gap: "28px",
};

const card = {
  display: "block",
  borderRadius: "24px",
  overflow: "hidden",
  background: "white",
  textDecoration: "none",
  color: "#111",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.06)",
};

const imageWrapper = {
  position: "relative" as const,
};

const cardImage = {
  width: "100%",
  height: "260px",
  objectFit: "cover" as const,
  display: "block",
};

const gradient = {
  position: "absolute" as const,
  inset: 0,
  background:
    "linear-gradient(to top,#000000b8,#00000010)",
};

const categoryBadge = {
  position: "absolute" as const,
  top: "18px",
  left: "18px",
  background: "#a16207",
  color: "white",
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 700,
};

const cardContent = {
  padding: "24px",
};

const cardTitle = {
  fontSize: "22px",
  lineHeight: 1.4,
  fontWeight: 800,
  marginBottom: "14px",
};

const excerpt = {
  color: "#666",
  lineHeight: 1.7,
  marginBottom: "18px",
};

const readMore = {
  color: "#a16207",
  fontWeight: 700,
};

const ctaSection = {
  padding: "40px 20px 100px",
};

const ctaCard = {
  maxWidth: "1100px",
  margin: "0 auto",
  borderRadius: "32px",
  padding: "70px 30px",
  background:
    "linear-gradient(135deg,#16110c,#2a2117)",
  textAlign: "center" as const,
};

const ctaTitle = {
  color: "white",
  fontSize: "clamp(32px,5vw,52px)",
  fontWeight: 800,
  marginBottom: "20px",
};

const ctaText = {
  color: "#ddd",
  lineHeight: 1.8,
  maxWidth: "700px",
  margin: "0 auto 30px",
};

const ctaBtn = {
  display: "inline-block",
  background: "#a16207",
  color: "white",
  padding: "16px 28px",
  borderRadius: "16px",
  textDecoration: "none",
  fontWeight: 800,
};