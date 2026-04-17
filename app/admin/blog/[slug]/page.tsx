
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: { slug: string };
};

function getImageUrl(image?: string | null) {
  if (!image) return "/blog/default.jpg";
  if (image.startsWith("http")) return image;
  return `/blog/${image}`;
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) return notFound();

  return (
    <article style={container}>
      <div style={hero}>
        <img
          src={getImageUrl(post.coverImage)}
          alt={post.title}
          style={image}
        />
      </div>

      <div style={content}>
        <h1 style={title}>{post.title}</h1>

        {post.excerpt && (
          <p style={excerpt}>{post.excerpt}</p>
        )}

        <div
          style={body}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </article>
  );
}

/* ================= STYLE ================= */

const container = {
  maxWidth: 900,
  margin: "0 auto",
  padding: "40px 20px",
};

const hero = {
  marginBottom: 30,
};

const image = {
  width: "100%",
  borderRadius: 14,
};

const content = {
  background: "white",
  padding: 30,
  borderRadius: 14,
};

const title = {
  fontSize: 32,
  marginBottom: 10,
};

const excerpt = {
  fontSize: 18,
  color: "#666",
  marginBottom: 20,
};

const body = {
  lineHeight: 1.7,
  color: "#333",
};