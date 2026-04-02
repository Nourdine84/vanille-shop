import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex" }}>
      {/* SIDEBAR */}
      <aside style={sidebar}>
        <h2 style={{ marginBottom: 20 }}>Admin</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link href="/admin">📊 Dashboard</Link>
          <Link href="/admin/products">📦 Produits</Link>
          <Link href="/admin/orders">🧾 Commandes</Link>
          <Link href="/admin/blog">📝 Blog</Link>
        </nav>
      </aside>

      {/* CONTENT */}
      <main style={{ flex: 1, padding: "30px" }}>{children}</main>
    </div>
  );
}

const sidebar = {
  width: "220px",
  background: "#111",
  color: "white",
  padding: "20px",
  minHeight: "100vh",
};