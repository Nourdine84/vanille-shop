import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default async function AdminDashboard() {
  const isAdmin = cookies().get("admin")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  let products: any[] = [];

  try {
    products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 5, // 🔥 derniers produits seulement
    });
  } catch (error) {
    console.error("❌ DASHBOARD ERROR:", error);
    products = [];
  }

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const outOfStockProducts = products.filter((p) => p.stock <= 0).length;

  return (
    <div style={container}>
      <h1 style={title}>📊 Dashboard</h1>

      {/* KPI */}
      <div style={grid3}>
        <Card title="Produits récents" value={totalProducts} />
        <Card title="Actifs" value={activeProducts} />
        <Card title="Épuisés" value={outOfStockProducts} />
      </div>

      {/* PRODUITS RÉCENTS */}
      <div style={card}>
        <h2 style={sectionTitle}>🆕 Derniers produits</h2>

        {products.length === 0 ? (
          <p>Aucun produit</p>
        ) : (
          products.map((product) => (
            <div key={product.id} style={productRow}>
              <div>
                <strong>{product.name}</strong>
                <p style={mutedText}>{product.slug}</p>
              </div>

              <div style={rowRight}>
                {product.badge && (
                  <span style={badge}>{product.badge}</span>
                )}

                <span>{formatPrice(product.priceCents)}</span>

                <span
                  style={{
                    color: product.stock <= 0 ? "#dc2626" : "#16a34a",
                  }}
                >
                  {product.stock <= 0 ? "Rupture" : "OK"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ACTION RAPIDE */}
      <div style={card}>
        <h2 style={sectionTitle}>⚡ Actions rapides</h2>

        <div style={actions}>
          <a href="/admin/products" style={actionBtn}>
            ➕ Ajouter un produit
          </a>

          <a href="/admin/products" style={actionBtnSecondary}>
            📦 Voir les produits
          </a>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div style={card}>
      <h3 style={cardTitle}>{title}</h3>
      <p style={valueStyle}>{value}</p>
    </div>
  );
}

/* ================= STYLES ================= */

const container = {
  padding: "30px",
};

const title = {
  fontSize: "28px",
  marginBottom: "20px",
};

const grid3 = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "20px",
  marginBottom: "20px",
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "20px",
};

const cardTitle = {
  margin: 0,
};

const valueStyle = {
  fontSize: "22px",
  fontWeight: 700,
};

const sectionTitle = {
  marginBottom: "15px",
};

const productRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid #eee",
};

const rowRight = {
  display: "flex",
  gap: "15px",
  alignItems: "center",
};

const badge = {
  background: "#f59e0b",
  color: "white",
  padding: "4px 8px",
  borderRadius: "8px",
  fontSize: "12px",
};

const mutedText = {
  color: "#777",
  fontSize: "12px",
};

const actions = {
  display: "flex",
  gap: "10px",
};

const actionBtn = {
  background: "#a16207",
  color: "white",
  padding: "10px 14px",
  borderRadius: "8px",
  textDecoration: "none",
};

const actionBtnSecondary = {
  background: "#2563eb",
  color: "white",
  padding: "10px 14px",
  borderRadius: "8px",
  textDecoration: "none",
};