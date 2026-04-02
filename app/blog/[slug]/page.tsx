import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

/* ================= SEO DYNAMIQUE ================= */

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const prisma = (await import("@/lib/prisma")).prisma as any;

  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) {
    return {
      title: "Article introuvable",
    };
  }

  return {
    title: post.title,
    description: post.excerpt || "Article Vanille’Or",
  };
}

/* ================= PAGE ================= */

export default async function BlogDetail({
  params,
}: {
  params: { slug: string };
}) {
  const prisma = (await import("@/lib/prisma")).prisma as any;

  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) return notFound();

  return (
    <div style={container}>
      {/* HERO */}
      <div style={hero}>
        <h1 style={title}>{post.title}</h1>

        {post.excerpt && (
          <p style={excerpt}>{post.excerpt}</p>
        )}
      </div>

      {/* 🔥 IMAGE COVER */}
      {post.coverImage && (
        <img src={post.coverImage} style={coverImage} />
      )}

      {/* 🔥 CONTENT RICHE */}
      <div
        style={content}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* 🔥 CTA PRODUITS */}
      <div style={ctaBlock}>
        <h3 style={{ marginBottom: 10 }}>
          Découvrez notre vanille premium
        </h3>

        <a href="/products" style={ctaBtn}>
          Voir nos produits
        </a>
      </div>
    </div>
  );
}

/* ================= STYLE PREMIUM ================= */

const container = {
  maxWidth: "900px",
  margin: "60px auto",
  padding: "20px",
};

const hero = {
  marginBottom: "30px",
};

const title = {
  fontSize: "42px",
  lineHeight: 1.2,
  marginBottom: "15px",
};

const excerpt = {
  fontSize: "18px",
  color: "#777",
  lineHeight: 1.6,
};

/* 🔥 IMAGE */

const coverImage = {
  width: "100%",
  maxHeight: "400px",
  objectFit: "cover" as const,
  borderRadius: "14px",
  marginBottom: "30px",
};

/* 🔥 CONTENU HTML PREMIUM */

const content = {
  lineHeight: 1.9,
  fontSize: "17px",
  color: "#222",
};

/* 🔥 CTA */

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
  fontWeight: 600,
};