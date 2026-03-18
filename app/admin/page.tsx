import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Admin</h1>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link href="/admin/orders" className="btn-primary">
          Gérer les commandes
        </Link>
      </div>
    </div>
  );
}