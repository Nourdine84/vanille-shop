import Link from "next/link";

export default function BlogAdminPage() {
  return (
    <div style={container}>
      <h1 style={title}>📝 Blog Admin</h1>

      <Link href="/admin/blog/create" style={createBtn}>
        ➕ Nouvel article
      </Link>

      <div style={card}>
        <p>Aucun article pour le moment</p>
      </div>
    </div>
  );
}

const container = { padding: 30 };

const title = { fontSize: 28, marginBottom: 20 };

const createBtn = {
  display: "inline-block",
  marginBottom: 20,
  background: "#2563eb",
  color: "white",
  padding: "10px 14px",
  borderRadius: 8,
  textDecoration: "none",
};

const card = {
  background: "white",
  padding: 20,
  borderRadius: 12,
};