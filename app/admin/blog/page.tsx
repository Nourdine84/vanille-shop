import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function BlogAdminPage() {
  const isAdmin = cookies().get("admin")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  let posts: any[] = [];

  try {
    posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("BLOG ADMIN ERROR:", e);
  }

  return (
    <div style={container}>
      <h1 style={title}>📝 Blog Admin</h1>

      <Link href="/admin/blog/create" style={createBtn}>
        ➕ Nouvel article
      </Link>

      {posts.length === 0 ? (
        <div style={card}>Aucun article</div>
      ) : (
        <div style={grid}>
          {posts.map((post) => (
            <div key={post.id} style={card}>
              
              {/* IMAGE */}
              {post.coverImage && (
                <img
                  src={post.coverImage}
                  style={image}
                />
              )}

              <h3 style={postTitle}>{post.title}</h3>

              {post.excerpt && (
                <p style={excerpt}>{post.excerpt}</p>
              )}

              <p style={slug}>{post.slug}</p>

              {/* ACTIONS */}
              <div style={actions}>
                
                <Link
                  href={`/blog/${post.slug}`}
                  style={btnView}
                >
                  Voir
                </Link>

                <Link
                  href={`/admin/blog/edit/${post.id}`}
                  style={btnEdit}
                >
                  ✏️ Edit
                </Link>

                <form
                  action={`/api/admin/blog/${post.id}`}
                  method="POST"
                >
                  <input type="hidden" name="_method" value="DELETE" />
                  <button style={btnDelete}>
                    🗑 Supprimer
                  </button>
                </form>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* STYLE */

const container = {
  padding: 30,
  background: "#faf7f2",
  minHeight: "100vh",
};

const title = {
  fontSize: 28,
  marginBottom: 20,
};

const createBtn = {
  display: "inline-block",
  marginBottom: 20,
  background: "#a16207",
  color: "white",
  padding: "10px 14px",
  borderRadius: 8,
  textDecoration: "none",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px,1fr))",
  gap: 20,
};

const card = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
};

const image = {
  width: "100%",
  height: 160,
  objectFit: "cover" as const,
  borderRadius: 10,
  marginBottom: 10,
};

const postTitle = {
  marginBottom: 5,
};

const excerpt = {
  fontSize: 14,
  color: "#666",
};

const slug = {
  fontSize: 12,
  color: "#999",
  marginBottom: 10,
};

const actions = {
  display: "flex",
  gap: 10,
  marginTop: 10,
};

const btnView = {
  background: "#2563eb",
  color: "white",
  padding: "8px 10px",
  borderRadius: 8,
  textDecoration: "none",
};

const btnEdit = {
  background: "#16a34a",
  color: "white",
  padding: "8px 10px",
  borderRadius: 8,
  textDecoration: "none",
};

const btnDelete = {
  background: "#dc2626",
  color: "white",
  padding: "8px 10px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
};