import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

/* ================= STATIC POSTS PREMIUM ================= */

const staticPosts: Record<string, any> = {
  "choisir-bonne-vanille": {
    title: "Comment reconnaître une bonne vanille",
    coverImage: "/blog/bonne-vanille.jpg",
    content: `
      <img src="/blog/bonne-vanille.jpg" style="width:100%;border-radius:14px;margin-bottom:20px"/>

      <p>Une bonne vanille se distingue par son aspect, son parfum et sa texture. Voici les critères essentiels à connaître.</p>

      <h2>Les signes de qualité</h2>
      <ul>
        <li>✔ Gousse souple et charnue</li>
        <li>✔ Aspect légèrement brillant</li>
        <li>✔ Parfum intense et naturel</li>
      </ul>

      <img src="/blog/bonne-vanille.jpg" style="width:100%;border-radius:14px;margin:20px 0"/>

      <h2>Origine et importance</h2>
      <p>
        La vanille de Madagascar est réputée pour sa richesse aromatique,
        idéale pour les desserts et préparations haut de gamme.
      </p>

      <div style="margin-top:30px;text-align:center">
        <a href="/products" style="
          display:inline-block;
          background:#a16207;
          color:white;
          padding:14px 22px;
          border-radius:12px;
          text-decoration:none;
          font-weight:bold;
        ">
          Voir nos produits
        </a>
      </div>
    `,
  },

  "utiliser-vanille-patisserie": {
    title: "Comment utiliser la vanille en pâtisserie",
    coverImage: "/blog/vanille-patisserie.jpg",
    content: `
      <img src="/blog/vanille-patisserie.jpg" style="width:100%;border-radius:14px;margin-bottom:20px"/>

      <p>
        La vanille est un ingrédient incontournable pour sublimer vos desserts.
        Elle apporte des arômes naturels puissants et une profondeur unique.
      </p>

      <h2>Utilisation classique</h2>
      <p>
        Infusez une gousse de vanille dans du lait ou de la crème pour parfumer intensément vos préparations.
      </p>

      <img src="/blog/vanille-patisserie.jpg" style="width:100%;border-radius:14px;margin:20px 0"/>

      <h2>Conseil professionnel</h2>
      <p>
        Choisissez une vanille de Madagascar premium pour obtenir un résultat digne des plus grandes pâtisseries.
      </p>

      <div style="margin-top:30px;text-align:center">
        <a href="/products" style="
          display:inline-block;
          background:#a16207;
          color:white;
          padding:14px 22px;
          border-radius:12px;
          text-decoration:none;
          font-weight:bold;
        ">
          Voir nos produits
        </a>
      </div>
    `,
  },

  "pourquoi-vanille-madagascar": {
    title: "Pourquoi la vanille de Madagascar est la meilleure",
    coverImage: "/blog/madagascar-vanille.jpg",
    content: `
      <img src="/blog/madagascar-vanille.jpg" style="width:100%;border-radius:14px;margin-bottom:20px"/>

      <p>
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

      <div style="margin-top:30px;text-align:center">
        <a href="/products" style="
          display:inline-block;
          background:#a16207;
          color:white;
          padding:14px 22px;
          border-radius:12px;
          text-decoration:none;
          font-weight:bold;
        ">
          Voir nos produits
        </a>
      </div>
    `,
  },
};

/* ================= SEO ================= */

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const prisma = (await import("@/lib/prisma")).prisma as any;

    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
    });

    if (post) {
      return {
        title: post.title,
        description: post.excerpt || "Article Vanille’Or",
      };
    }

    if (staticPosts[params.slug]) {
      return {
        title: staticPosts[params.slug].title,
      };
    }

    return { title: "Article" };
  } catch {
    return { title: "Article" };
  }
}

/* ================= PAGE ================= */

export default async function BlogDetail({
  params,
}: {
  params: { slug: string };
}) {
  let post: any = null;

  try {
    const prisma = (await import("@/lib/prisma")).prisma as any;

    post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
    });
  } catch (e) {
    console.error("BLOG ERROR:", e);
  }

  const staticPost = staticPosts[params.slug];

  if (!post && !staticPost) {
    return notFound();
  }

  const title = post?.title || staticPost.title;
  const image = post?.coverImage || staticPost.coverImage;
  const content = post?.content || staticPost.content;

  return (
    <div style={container}>
      {/* HERO */}
      <div style={hero}>
        <h1 style={titleStyle}>{title}</h1>
      </div>

      {/* IMAGE */}
      {image && (
        <img src={image} alt={title} style={coverImage} />
      )}

      {/* CONTENT */}
      <div
        style={contentStyle}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* CTA */}
      <div style={ctaBlock}>
        <h3>Découvrez notre vanille premium</h3>

        <a href="/products" style={ctaBtn}>
          Voir nos produits
        </a>
      </div>
    </div>
  );
}

/* ================= STYLE ================= */

const container = {
  maxWidth: "900px",
  margin: "60px auto",
  padding: "20px",
};

const hero = {
  marginBottom: "20px",
};

const titleStyle = {
  fontSize: "42px",
  lineHeight: 1.2,
  marginBottom: "10px",
};

const coverImage = {
  width: "100%",
  maxHeight: "400px",
  objectFit: "cover" as const,
  borderRadius: "14px",
  marginBottom: "30px",
};

const contentStyle = {
  lineHeight: 1.9,
  fontSize: "17px",
};

const ctaBlock = {
  marginTop: "60px",
  padding: "30px",
  borderRadius: "12px",
  background: "#faf7f2",
  textAlign: "center" as const,
};

const ctaBtn = {
  display: "inline-block",
  marginTop: "10px",
  background: "#a16207",
  color: "white",
  padding: "12px 20px",
  borderRadius: "10px",
  textDecoration: "none",
};