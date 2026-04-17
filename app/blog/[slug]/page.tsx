import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getImageUrl } from "@/lib/image";

export const dynamic = "force-dynamic";

/* ================= STATIC POSTS ================= */

const staticPosts: Record<string, any> = {
  "choisir-bonne-vanille": {
    title: "Comment reconnaître une bonne vanille",
    coverImage: "/blog/bonne-vanille.jpg",
    content: `
      <p>Une bonne vanille se distingue par son aspect, son parfum et sa texture.</p>
      <h2>Les signes de qualité</h2>
      <ul>
        <li>✔ Gousse souple et charnue</li>
        <li>✔ Aspect légèrement brillant</li>
        <li>✔ Parfum intense et naturel</li>
      </ul>
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
    const prisma = (await import("@/lib/prisma")).prisma;

    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
    });

    const staticPost = staticPosts[params.slug];

    const title = post?.title || staticPost?.title || "Article Vanille’Or";
    const description =
      post?.excerpt || "Vanille premium de Madagascar - Vanille’Or";
    const image = getImageUrl(post?.coverImage || staticPost?.coverImage);

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
    return { title: "Article Vanille’Or" };
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
    const prisma = (await import("@/lib/prisma")).prisma;

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
  const image = getImageUrl(post?.coverImage || staticPost.coverImage);
  const content = post?.content || staticPost.content;

  return (
    <div style={container}>
      <div style={hero}>
        <h1 style={titleStyle}>{title}</h1>
      </div>

      {image && <img src={image} alt={title} style={coverImage} />}

      <div
        style={contentStyle}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* 🔥 CONVERSION BLOCK */}
      <div style={productBlock}>
        <h3>✨ Passez à la qualité professionnelle</h3>
        <p>
          Découvrez notre vanille premium directement importée de Madagascar.
        </p>

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
  maxHeight: "420px",
  objectFit: "cover" as const,
  borderRadius: "14px",
  marginBottom: "30px",
};

const contentStyle = {
  lineHeight: 1.9,
  fontSize: "17px",
};

const productBlock = {
  marginTop: "50px",
  padding: "30px",
  borderRadius: "14px",
  background: "#fff7ed",
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