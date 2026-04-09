import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import RevenueChart from "@/components/admin/RevenueChart";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SearchParams = {
  period?: string;
};

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

function getPeriodDays(period?: string) {
  switch (period) {
    case "7d":
      return 7;
    case "30d":
      return 30;
    case "90d":
      return 90;
    case "all":
    default:
      return null;
  }
}

function formatPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)} %`;
}

function getGrowth(current: number, previous: number) {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return 100;
  return ((current - previous) / previous) * 100;
}

function groupOrdersByDay(orders: any[]) {
  const map: Record<string, { revenue: number; count: number }> = {};

  orders.forEach((order) => {
    const date = new Date(order.createdAt).toLocaleDateString("fr-FR");

    if (!map[date]) {
      map[date] = { revenue: 0, count: 0 };
    }

    if (order.status === "PAID") {
      map[date].revenue += order.totalCents / 100;
    }

    map[date].count += 1;
  });

  const labels = Object.keys(map);
  const revenue = labels.map((label) => map[label].revenue);
  const ordersCount = labels.map((label) => map[label].count);

  return { labels, revenue, ordersCount };
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const isAdmin = cookies().get("admin")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const period = searchParams?.period || "30d";
  const periodDays = getPeriodDays(period);

  const now = new Date();
  const currentStart =
    periodDays === null
      ? null
      : new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

  const previousStart =
    periodDays === null
      ? null
      : new Date(now.getTime() - periodDays * 2 * 24 * 60 * 60 * 1000);

  let recentProducts: any[] = [];
  let recentOrders: any[] = [];
  let allOrders: any[] = [];
  let totalProducts = 0;
  let activeProducts = 0;
  let outOfStockProducts = 0;

  try {
    const [
      recentProductsData,
      recentOrdersData,
      allOrdersData,
      totalProductsCount,
      activeProductsCount,
      outOfStockCount,
    ] = await Promise.all([
      prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "asc" },
      }),
      prisma.product.count(),
      prisma.product.count({
        where: { isActive: true },
      }),
      prisma.product.count({
        where: { stock: { lte: 0 } },
      }),
    ]);

    recentProducts = recentProductsData;
    recentOrders = recentOrdersData;
    allOrders = allOrdersData;
    totalProducts = totalProductsCount;
    activeProducts = activeProductsCount;
    outOfStockProducts = outOfStockCount;
  } catch (error) {
    console.error("❌ DASHBOARD ERROR:", error);
  }

  const filteredOrders =
    currentStart === null
      ? allOrders
      : allOrders.filter((order) => new Date(order.createdAt) >= currentStart);

  const previousOrders =
    periodDays === null || previousStart === null || currentStart === null
      ? []
      : allOrders.filter((order) => {
          const createdAt = new Date(order.createdAt);
          return createdAt >= previousStart && createdAt < currentStart;
        });

  const totalRevenue = filteredOrders.reduce(
    (acc, order) => acc + (order.status === "PAID" ? order.totalCents : 0),
    0
  );

  const previousRevenue = previousOrders.reduce(
    (acc, order) => acc + (order.status === "PAID" ? order.totalCents : 0),
    0
  );

  const totalOrders = filteredOrders.length;
  const previousTotalOrders = previousOrders.length;

  const paidOrders = filteredOrders.filter((o) => o.status === "PAID").length;
  const pendingOrders = filteredOrders.filter((o) => o.status === "PENDING").length;
  const shippedOrders = filteredOrders.filter((o) => o.status === "SHIPPED").length;

  const aov = paidOrders > 0 ? Math.round(totalRevenue / paidOrders) : 0;

  const revenueGrowth = getGrowth(totalRevenue, previousRevenue);
  const ordersGrowth = getGrowth(totalOrders, previousTotalOrders);

  const { labels, revenue, ordersCount } = groupOrdersByDay(filteredOrders);

  return (
    <div style={container}>
      <div style={topBar}>
        <div>
          <h1 style={title}>📊 Dashboard</h1>
          <p style={subtitle}>Vue globale de l’activité Vanille’Or</p>
        </div>

        <form method="GET" style={periodForm}>
          <select name="period" defaultValue={period} style={select}>
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
            <option value="all">Depuis le début</option>
          </select>

          <button type="submit" style={filterBtn}>
            Filtrer
          </button>
        </form>
      </div>

      <div style={grid4}>
        <KpiCard
          title="💰 Chiffre d’affaires"
          value={formatPrice(totalRevenue)}
          hint={period === "all" ? "Vue globale" : `Évolution: ${formatPercent(revenueGrowth)}`}
        />
        <KpiCard
          title="📦 Commandes"
          value={totalOrders}
          hint={period === "all" ? "Vue globale" : `Évolution: ${formatPercent(ordersGrowth)}`}
        />
        <KpiCard
          title="🧾 Panier moyen"
          value={formatPrice(aov)}
          hint="Basé sur les commandes payées"
        />
        <KpiCard
          title="⏳ En attente"
          value={pendingOrders}
          hint={`Payées: ${paidOrders} • Expédiées: ${shippedOrders}`}
        />
      </div>

      <div style={grid3}>
        <KpiCard
          title="🛍 Produits"
          value={totalProducts}
          hint={`Actifs: ${activeProducts}`}
        />
        <KpiCard
          title="✅ Actifs"
          value={activeProducts}
          hint="Disponibles à la vente"
        />
        <KpiCard
          title="⚠️ Épuisés"
          value={outOfStockProducts}
          hint="Stock à réapprovisionner"
        />
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>📈 Performance</h2>
        {labels.length === 0 ? (
          <p style={emptyText}>Aucune donnée disponible pour cette période.</p>
        ) : (
          <RevenueChart labels={labels} revenue={revenue} orders={ordersCount} />
        )}
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>🧾 Dernières commandes</h2>

        {recentOrders.length === 0 ? (
          <p style={emptyText}>Aucune commande</p>
        ) : (
          recentOrders.map((order) => (
            <div key={order.id} style={row}>
              <div>
                <strong>{order.id.slice(0, 8)}</strong>
                <p style={muted}>
                  {new Date(order.createdAt).toLocaleString("fr-FR")}
                </p>
              </div>

              <div style={rowRight}>
                <StatusBadge status={order.status} />
                <span>{formatPrice(order.totalCents)}</span>
                <a href={`/admin/orders/${order.id}`} style={linkBtn}>
                  Voir
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>🆕 Derniers produits</h2>

        {recentProducts.length === 0 ? (
          <p style={emptyText}>Aucun produit</p>
        ) : (
          recentProducts.map((product) => (
            <div key={product.id} style={row}>
              <div>
                <strong>{product.name}</strong>
                <p style={muted}>{product.slug}</p>
              </div>

              <div style={rowRight}>
                {product.badge && <span style={badge}>{product.badge}</span>}
                <span>{formatPrice(product.priceCents)}</span>
                <span
                  style={{
                    color: product.stock <= 0 ? "#dc2626" : "#16a34a",
                    fontWeight: 600,
                  }}
                >
                  {product.stock <= 0 ? "Rupture" : "OK"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>⚡ Actions rapides</h2>

        <div style={actions}>
          <a href="/admin/products" style={btnPrimary}>
            ➕ Ajouter produit
          </a>

          <a href="/admin/products" style={btnSecondary}>
            📦 Voir produits
          </a>

          <a href="/admin/orders" style={btnDark}>
            🧾 Voir commandes
          </a>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div style={card}>
      <h3 style={cardTitle}>{title}</h3>
      <p style={valueStyle}>{value}</p>
      {hint ? <p style={hintStyle}>{hint}</p> : null}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "#f59e0b",
    PAID: "#16a34a",
    SHIPPED: "#2563eb",
    DELIVERED: "#7c3aed",
    FAILED: "#dc2626",
    CANCELED: "#6b7280",
  };

  return (
    <span
      style={{
        background: colors[status] || "#999",
        color: "white",
        padding: "4px 8px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 700,
      }}
    >
      {status}
    </span>
  );
}

const container = {
  padding: "30px",
};

const topBar = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "20px",
  marginBottom: "20px",
  flexWrap: "wrap" as const,
};

const title = {
  fontSize: "28px",
  marginBottom: "6px",
};

const subtitle = {
  margin: 0,
  color: "#666",
  fontSize: "14px",
};

const periodForm = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  flexWrap: "wrap" as const,
};

const select = {
  padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  background: "white",
};

const filterBtn = {
  background: "#111",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "10px 14px",
  cursor: "pointer",
};

const grid4 = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "20px",
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
  boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
};

const cardTitle = {
  margin: 0,
  fontSize: "15px",
};

const valueStyle = {
  fontSize: "24px",
  fontWeight: 700,
  margin: "10px 0 6px 0",
};

const hintStyle = {
  margin: 0,
  color: "#666",
  fontSize: "12px",
};

const sectionTitle = {
  marginBottom: "15px",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 0",
  borderBottom: "1px solid #eee",
  gap: "20px",
};

const rowRight = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  flexWrap: "wrap" as const,
};

const muted = {
  color: "#777",
  fontSize: "12px",
};

const badge = {
  background: "#f59e0b",
  color: "white",
  padding: "4px 8px",
  borderRadius: "8px",
  fontSize: "12px",
};

const linkBtn = {
  background: "#f3f4f6",
  color: "#111",
  padding: "6px 10px",
  borderRadius: "8px",
  textDecoration: "none",
  fontSize: "12px",
  fontWeight: 600,
};

const actions = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap" as const,
};

const btnPrimary = {
  background: "#a16207",
  color: "white",
  padding: "10px 14px",
  borderRadius: "8px",
  textDecoration: "none",
};

const btnSecondary = {
  background: "#2563eb",
  color: "white",
  padding: "10px 14px",
  borderRadius: "8px",
  textDecoration: "none",
};

const btnDark = {
  background: "#111",
  color: "white",
  padding: "10px 14px",
  borderRadius: "8px",
  textDecoration: "none",
};

const emptyText = {
  color: "#666",
  fontSize: "14px",
};