import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getImageUrl } from "@/lib/image";
import BackButton from "@/components/ui/BackButton";

export const dynamic = "force-dynamic";

/* =========================
   STATIC POSTS
========================= */

const staticPosts: Record<string, any> = {
  "choisir-bonne-vanille": {
    title: "Comment reconnaître une bonne vanille",
    coverImage: "/blog/bonne-vanille.jpg",
    excerpt:
      "Texture, parfum et qualité : découvrez comment identifier une véritable vanille premium.",
    category: "Guide",
    content: `
      <p>
        Une bonne vanille se distingue par son aspect,
        son parfum et sa texture. Les meilleures gousses
        sont souples, charnues et riches en arômes.
      </p>

      <h2>Les signes d’une vanille premium</h2>

      <ul>
        <li>✔ Gousse souple et brillante</li>
        <li>✔ Texture charnue et grasse</li>
        <li>✔ Parfum puissant et naturel</li>
        <li>✔ Taux d’humidité équilibré</li>
      </ul>

      <p>
        La vanille de Madagascar est particulièrement
        réputée pour sa richesse aromatique et sa qualité
        constante utilisée par les chefs et artisans.
      </p>

      <blockquote>
        “Une grande vanille se reconnaît d’abord à son parfum.”
      </blockquote>
    `,
  },

  "utiliser-vanille-patisserie": {
    title: "Comment utiliser la vanille en pâtisserie",
    coverImage: "/blog/vanille-patisserie.jpg",
    excerpt:
      "Découvrez comment sublimer vos desserts grâce à la vanille premium.",
    category: "Pâtisserie",
    content: `
      <p>
        La vanille est l’une des épices les plus utilisées
        en pâtisserie haut de gamme grâce à sa complexité
        aromatique unique.
      </p>

      <h2>Les meilleures utilisations</h2>

      <ul>
        <li>✔ Crèmes et ganaches</li>
        <li>✔ Glaces artisanales</li>
        <li>✔ Pâtisserie fine</li>
        <li>✔ Infusions et sirops</li>
      </ul>

      <p>
        Pour obtenir une intensité maximale, il est conseillé
        d’utiliser une vanille charnue riche en graines.
      </p>
    `,
  },

  "pourquoi-vanille-madagascar": {
    title: "Pourquoi la vanille de Madagascar est la meilleure",
    coverImage: "/blog/madagascar-vanille.jpg",
    excerpt:
      "Madagascar produit l’une des vanilles les plus réputées au monde.",
    category: "Madagascar",
    content: `
      <p>
        La vanille Bourbon de Madagascar est reconnue
        mondialement pour sa puissance aromatique,
        sa richesse et son équilibre.
      </p>

      <h2>Un terroir unique</h2>

      <p>
        Le climat tropical humide de Madagascar offre
        des conditions idéales pour le développement
        d’une vanille d’exception.
      </p>

      <h2>Un savoir-faire artisanal</h2>

      <p>
        Chaque étape — récolte, échaudage, séchage
        et affinage — est réalisée avec précision afin
        de préserver toute la qualité du produit.
      </p>
    `,
  },
};

/* =========================
   SEO
========================= */

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const prisma = (await import("@/lib/prisma")).prisma;

    const post = await prisma.blogPost.findUnique({
      where: {
        slug: params.slug,
      },
    });

    const staticPost = staticPosts[params.slug];

    const title =
      post?.title ||
      staticPost?.title ||
      "Article Vanille’Or";

    const description =
      post?.excerpt ||
      staticPost?.excerpt ||
      "Vanille premium de Madagascar";

    const image = getImageUrl(
      post?.coverImage ||
        staticPost?.coverImage
    );

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [image],
      },
    };
  } catch {
    return {
      title: "Article Vanille’Or",
    };
  }
}

/* =========================
   PAGE
========================= */

export default async function BlogDetail({
  params,
}: {
  params: { slug: string };
}) {
  let post: any = null;

  try {
    const prisma = (await import("@/lib/prisma")).prisma;

    post = await prisma.blogPost.findUnique({
      where: {
        slug: params.slug,
      },
    });
  } catch (e) {
    console.error("BLOG ERROR:", e);
  }

  const staticPost = staticPosts[params.slug];

  if (!post && !staticPost) {
    return notFound();
  }

  const title =
    post?.title || staticPost.title;

  const excerpt =
    post?.excerpt || staticPost.excerpt;

  const image = getImageUrl(
    post?.coverImage ||
      staticPost.coverImage
  );

  const content =
    post?.content || staticPost.content;

    const category =
    post?.category ||
    staticPost?.category ||
    "Blog";

  return (
    <div style={page}>
      {/* ================= HERO ================= */}

      <section style={hero}>
        <img
          src={image}
          alt={title}
          style={heroImage}
        />

        <div style={heroOverlay} />

        <div style={heroContent}>
          <div style={categoryBadge}>
            {category}
          </div>

          <BackButton
            label="Retour au blog"
            fallback="/blog"
          />

          <h1 style={titleStyle}>
            {title}
          </h1>

          <p style={heroExcerpt}>
            {excerpt}
          </p>
        </div>
      </section>

      {/* ================= CONTENT ================= */}

      <section style={section}>
        <div style={contentContainer}>
          <div
            style={contentStyle}
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
        </div>
      </section>

      {/* ================= CTA ================= */}

      <section style={ctaSection}>
        <div style={ctaCard}>
          <p style={ctaTag}>
            VANILLE’OR
          </p>

          <h2 style={ctaTitle}>
            Découvrez notre sélection premium
          </h2>

          <p style={ctaText}>
            Vanille gourmet, épices rares,
            cacao et sélections artisanales
            directement importées de Madagascar.
          </p>

          <Link
            href="/products"
            style={ctaBtn}
          >
            Voir nos produits
          </Link>
        </div>
      </section>

      {/* ================= RELATED ================= */}

      <section style={relatedSection}>
        <div style={relatedContainer}>
          <div style={relatedHeader}>
            <p style={relatedTag}>
              BLOG
            </p>

            <h2 style={relatedTitle}>
              Continuer la lecture
            </h2>
          </div>

          <div style={relatedGrid}>
            {Object.entries(staticPosts)
              .filter(
                ([slug]) =>
                  slug !== params.slug
              )
              .slice(0, 2)
              .map(([slug, article]) => (
                <Link
                  key={slug}
                  href={`/blog/${slug}`}
                  style={relatedCard}
                >
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    style={relatedImage}
                  />

                  <div style={relatedContent}>
                    <div style={miniBadge}>
                      {article.category}
                    </div>

                    <h3 style={relatedCardTitle}>
                      {article.title}
                    </h3>

                    <span style={readMore}>
                      Lire →
                    </span>
                  </div>
                </Link>
              ))}
          </div>
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

/* HERO */

const hero = {
  position: "relative" as const,
  minHeight: "70vh",
  display: "flex",
  alignItems: "flex-end",
  overflow: "hidden",
};

const heroImage = {
  position: "absolute" as const,
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
};

const heroOverlay = {
  position: "absolute" as const,
  inset: 0,
  background:
    "linear-gradient(to top,#000000e6,#00000040)",
};

const heroContent = {
  position: "relative" as const,
  zIndex: 2,
  maxWidth: "1000px",
  margin: "0 auto",
  width: "100%",
  padding: "60px 20px",
};

const categoryBadge = {
  display: "inline-block",
  background: "#a16207",
  color: "white",
  padding: "8px 14px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 700,
  marginBottom: "20px",
};

const titleStyle = {
  color: "white",
  fontSize: "clamp(38px,6vw,70px)",
  lineHeight: 1.1,
  fontWeight: 800,
  marginBottom: "20px",
  maxWidth: "850px",
};

const heroExcerpt = {
  color: "#ddd",
  fontSize: "18px",
  lineHeight: 1.8,
  maxWidth: "760px",
};

/* CONTENT */

const section = {
  padding: "80px 20px",
};

const contentContainer = {
  maxWidth: "860px",
  margin: "0 auto",
};

const contentStyle = {
  background: "white",
  padding: "50px",
  borderRadius: "28px",
  lineHeight: 1.9,
  fontSize: "17px",
  color: "#333",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.05)",
};

/* CTA */

const ctaSection = {
  padding: "0 20px 80px",
};

const ctaCard = {
  maxWidth: "1100px",
  margin: "0 auto",
  background:
    "linear-gradient(135deg,#16110c,#2a2117)",
  borderRadius: "32px",
  padding: "70px 30px",
  textAlign: "center" as const,
};

const ctaTag = {
  color: "#d4af37",
  letterSpacing: "0.15em",
  fontWeight: 700,
  fontSize: "12px",
  marginBottom: "12px",
};

const ctaTitle = {
  color: "white",
  fontSize: "clamp(32px,5vw,50px)",
  fontWeight: 800,
  marginBottom: "20px",
};

const ctaText = {
  color: "#ddd",
  maxWidth: "700px",
  margin: "0 auto 30px",
  lineHeight: 1.8,
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

/* RELATED */

const relatedSection = {
  padding: "0 20px 100px",
};

const relatedContainer = {
  maxWidth: "1200px",
  margin: "0 auto",
};

const relatedHeader = {
  marginBottom: "30px",
};

const relatedTag = {
  color: "#a16207",
  fontWeight: 700,
  letterSpacing: "0.15em",
  fontSize: "12px",
  marginBottom: "10px",
};

const relatedTitle = {
  fontSize: "clamp(28px,5vw,42px)",
  fontWeight: 800,
};

const relatedGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(300px,1fr))",
  gap: "24px",
};

const relatedCard = {
  display: "block",
  background: "white",
  borderRadius: "24px",
  overflow: "hidden",
  textDecoration: "none",
  color: "#111",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.05)",
};

const relatedImage = {
  width: "100%",
  height: "240px",
  objectFit: "cover" as const,
};

const relatedContent = {
  padding: "24px",
};

const miniBadge = {
  display: "inline-block",
  background: "#f4efe7",
  color: "#a16207",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: 700,
  marginBottom: "14px",
};

const relatedCardTitle = {
  fontSize: "22px",
  lineHeight: 1.4,
  fontWeight: 800,
  marginBottom: "14px",
};

const readMore = {
  color: "#a16207",
  fontWeight: 700,
};