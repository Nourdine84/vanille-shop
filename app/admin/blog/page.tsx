import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken, ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import AdminBackButton from "@/components/admin/AdminBackButton";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/* ================= TYPES ================= */

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  coverImage?: string | null;
  createdAt: Date;
};

/* ================= UTILS ================= */

function getImageUrl(image?: string | null) {
  if (!image) return "/blog/default.jpg";
  if (image.startsWith("http")) return image;
  if (image.startsWith("/")) return image;
  return `/blog/${image}`;
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/* ================= PAGE ================= */

export default async function BlogAdminPage() {
  const isAdmin = verifyAdminToken(cookies().get(ADMIN_SESSION_COOKIE)?.value);

  if (!isAdmin) {
    redirect("/admin/login");
  }

  let posts: BlogPost[] = [];

  try {
    posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("BLOG ADMIN ERROR:", e);
    posts = [];
  }

  return (
    <div style={container}>
      {/* HEADER */}
      <div style={topBar}>
        <div>
        <AdminBackButton
            label="Retour dashboard"
            fallback="/admin"
          />

          <br />
          <br />
          
          <h1 style={title}>📝 Blog Admin</h1>
          <p style={subtitle}>
            Gérez les articles, les visuels et la stratégie éditoriale de
            Vanille’Or.
          </p>
        </div>

        <Link href="/admin/blog/create" style={createBtn}>
          ➕ Nouvel article
        </Link>
      </div>

      {/* KPI */}
      <div style={kpiRow}>
        <div style={kpiCard}>
          <span style={kpiLabel}>Articles</span>
          <strong style={kpiValue}>{posts.length}</strong>
        </div>
      </div>

      {/* EMPTY */}
      {posts.length === 0 ? (
        <div style={emptyCard}>
          <p style={{ margin: 0 }}>
            Aucun article pour le moment.
          </p>
        </div>
      ) : (
        <div style={grid}>
          {posts.map((post) => (
            <article key={post.id} style={card}>
              {/* IMAGE */}
              <div style={imageWrap}>
                <img
                  src={getImageUrl(post.coverImage)}
                  alt={post.title}
                  style={image}
                />
              </div>

              {/* CONTENT */}
              <div style={content}>
                <div style={metaRow}>
                  <span style={dateBadge}>
                    {formatDate(post.createdAt)}
                  </span>

                  <span style={slugBadge}>
                    /{post.slug}
                  </span>
                </div>

                <h2 style={postTitle}>
                  {post.title || "Sans titre"}
                </h2>

                <p style={excerpt}>
                  {post.excerpt?.trim()
                    ? post.excerpt
                    : "Aucun résumé renseigné pour cet article."}
                </p>

                {/* ACTIONS */}
                <div style={actions}>
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    style={viewBtn}
                  >
                    👁 Voir
                  </a>

                  <a
                    href={`/admin/blog/edit/${post.id}`}
                    style={editBtn}
                  >
                    ✏️ Modifier
                  </a>

                  <form
                    action={`/api/admin/blog/${post.id}`}
                    method="POST"
                    style={{ margin: 0, flex: 1 }}
                  >
                    <input type="hidden" name="_method" value="DELETE" />
                    <button type="submit" style={deleteBtn}>
                      🗑 Supprimer
                    </button>
                  </form>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  padding: 30,
  background: "#faf7f2",
  minHeight: "100vh",
};

const topBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 20,
  flexWrap: "wrap" as const,
  marginBottom: 24,
};

const title = {
  fontSize: 30,
  margin: "0 0 8px 0",
};

const subtitle = {
  margin: 0,
  color: "#666",
  maxWidth: 700,
};

const createBtn = {
  display: "inline-block",
  background: "#a16207",
  color: "white",
  padding: "12px 16px",
  borderRadius: 10,
  textDecoration: "none",
  fontWeight: 700,
};

const kpiRow = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 16,
  marginBottom: 24,
};

const kpiCard = {
  background: "white",
  borderRadius: 14,
  padding: 18,
  boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
};

const kpiLabel = {
  display: "block",
  fontSize: 13,
  color: "#777",
  marginBottom: 6,
};

const kpiValue = {
  fontSize: 24,
};

const emptyCard = {
  background: "white",
  borderRadius: 14,
  padding: 24,
  boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: 20,
};

const card = {
  background: "white",
  borderRadius: 16,
  overflow: "hidden" as const,
  boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
  border: "1px solid #eee",
};

const imageWrap = {
  height: 190,
  background: "#f3f4f6",
};

const image = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
  display: "block",
};

const content = {
  padding: 18,
};

const metaRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap" as const,
  marginBottom: 10,
};

const dateBadge = {
  background: "#fef3c7",
  color: "#7c4a03",
  borderRadius: 999,
  padding: "4px 10px",
  fontSize: 12,
  fontWeight: 700,
};

const slugBadge = {
  background: "#f3f4f6",
  color: "#555",
  borderRadius: 999,
  padding: "4px 10px",
  fontSize: 12,
};

const postTitle = {
  margin: "0 0 10px 0",
  fontSize: 20,
};

const excerpt = {
  color: "#666",
  lineHeight: 1.5,
  minHeight: 48,
  marginBottom: 16,
};

const actions = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap" as const,
};

const sharedAction = {
  flex: 1,
  minWidth: 90,
  padding: "10px 12px",
  borderRadius: 10,
  textAlign: "center" as const,
  textDecoration: "none",
  fontWeight: 600,
  border: "none",
  cursor: "pointer",
};

const viewBtn = {
  ...sharedAction,
  background: "#2563eb",
  color: "white",
};

const editBtn = {
  ...sharedAction,
  background: "#111",
  color: "white",
};

const deleteBtn = {
  ...sharedAction,
  width: "100%",
  background: "#dc2626",
  color: "white",
};