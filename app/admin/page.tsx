import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken, ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";
import RevenueChart from "@/components/admin/RevenueChart";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SearchParams = {
  period?: string;
};

/* ================= HELPERS ================= */

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
  if (!isFinite(value)) return "0 %";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)} %`;
}

function getGrowth(current: number, previous: number) {
  if (!previous && !current) return 0;
  if (!previous) return 100;
  return ((current - previous) / previous) * 100;
}

/* ================= GROUP ================= */

function groupOrdersByDay(orders: any[]) {
  const map = new Map<
    string,
    { revenue: number; count: number; date: Date }
  >();

  orders.forEach((order) => {
    const dateObj = new Date(order.createdAt);

    const key = dateObj.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
    });

    if (!map.has(key)) {
      map.set(key, {
        revenue: 0,
        count: 0,
        date: dateObj,
      });
    }

    const entry = map.get(key)!;

    if (order.status === "PAID") {
      entry.revenue += order.totalCents / 100;
    }

    entry.count += 1;
  });

  const sorted = Array.from(map.entries()).sort(
    (a, b) => a[1].date.getTime() - b[1].date.getTime()
  );

  return {
    labels: sorted.map(([k]) => k),
    revenue: sorted.map(([, v]) => v.revenue),
    ordersCount: sorted.map(([, v]) => v.count),
  };
}

/* ================= PAGE ================= */

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const isAdmin = verifyAdminToken(cookies().get(ADMIN_SESSION_COOKIE)?.value);

  if (!isAdmin) redirect("/admin/login");

  const period = searchParams?.period || "30d";
  const periodDays = getPeriodDays(period);

  const now = new Date();

  const currentStart =
    periodDays === null
      ? null
      : new Date(now.getTime() - periodDays * 86400000);

  const previousStart =
    periodDays === null
      ? null
      : new Date(now.getTime() - periodDays * 2 * 86400000);

  let recentProducts: any[] = [];
  let recentOrders: any[] = [];
  let allOrders: any[] = [];

  let totalProducts = 0;
  let activeProducts = 0;
  let outOfStockProducts = 0;
  let totalPacks = 0; // 🔥 NEW

  try {
    const [
      recentProductsData,
      recentOrdersData,
      allOrdersData,
      totalProductsCount,
      activeProductsCount,
      outOfStockCount,
      packCount,
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
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { stock: { lte: 0 } } }),
      prisma.product.count({ where: { isPack: true } }), // 🔥 NEW
    ]);

    recentProducts = recentProductsData;
    recentOrders = recentOrdersData;
    allOrders = allOrdersData;

    totalProducts = totalProductsCount;
    activeProducts = activeProductsCount;
    outOfStockProducts = outOfStockCount;
    totalPacks = packCount;
  } catch (error) {
    console.error("❌ DASHBOARD ERROR:", error);
  }

  /* ================= FILTER ================= */

  const filteredOrders =
    currentStart === null
      ? allOrders
      : allOrders.filter(
          (o) => new Date(o.createdAt) >= currentStart
        );

  const previousOrders =
    !previousStart || !currentStart
      ? []
      : allOrders.filter((o) => {
          const d = new Date(o.createdAt);
          return d >= previousStart && d < currentStart;
        });

  /* ================= KPI ================= */

  const totalRevenue = filteredOrders.reduce(
    (acc, o) => acc + (o.status === "PAID" ? o.totalCents : 0),
    0
  );

  const previousRevenue = previousOrders.reduce(
    (acc, o) => acc + (o.status === "PAID" ? o.totalCents : 0),
    0
  );

  const totalOrders = filteredOrders.length;
  const previousTotalOrders = previousOrders.length;

  const paidOrders = filteredOrders.filter((o) => o.status === "PAID").length;
  const pendingOrders = filteredOrders.filter((o) => o.status === "PENDING").length;

  const aov = paidOrders ? Math.round(totalRevenue / paidOrders) : 0;

  const revenueGrowth = getGrowth(totalRevenue, previousRevenue);
  const ordersGrowth = getGrowth(totalOrders, previousTotalOrders);

  const { labels, revenue, ordersCount } =
    groupOrdersByDay(filteredOrders);

  /* ================= UI ================= */

  return (
    <div style={container}>
      <div style={topBar}>
        <div>
          <h1 style={title}>📊 Dashboard</h1>
          <p style={subtitle}>Vue globale Vanille’Or</p>
        </div>

        <form method="GET" style={periodForm}>
          <select name="period" defaultValue={period} style={select}>
            <option value="7d">7 jours</option>
            <option value="30d">30 jours</option>
            <option value="90d">90 jours</option>
            <option value="all">Tout</option>
          </select>

          <button type="submit" style={filterBtn}>
            Filtrer
          </button>
        </form>
      </div>

      {/* KPI */}
      <div style={grid4}>
        <KpiCard title="💰 CA" value={formatPrice(totalRevenue)} hint={formatPercent(revenueGrowth)} />
        <KpiCard title="📦 Commandes" value={totalOrders} hint={formatPercent(ordersGrowth)} />
        <KpiCard title="📊 Produits" value={totalProducts} hint={`Actifs: ${activeProducts}`} />
        <KpiCard title="📦 Packs" value={totalPacks} hint="Produits pack" /> {/* 🔥 NEW */}
      </div>

      {/* GRAPH */}
      <div style={card}>
        <h2 style={sectionTitle}>📈 Performance</h2>

        {labels.length === 0 ? (
          <p style={emptyText}>Aucune donnée</p>
        ) : (
          <RevenueChart
            labels={labels}
            revenue={revenue}
            orders={ordersCount}
          />
        )}
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function KpiCard({ title, value, hint }: any) {
  return (
    <div style={card}>
      <h3 style={cardTitle}>{title}</h3>
      <p style={valueStyle}>{value}</p>
      {hint && <p style={hintStyle}>{hint}</p>}
    </div>
  );
}

/* ================= STYLE ================= */

const container = { padding: 30 };
const title = { fontSize: 28 };
const subtitle = { color: "#666" };

const topBar = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 20,
};

const periodForm = { display: "flex", gap: 10 };
const select = { padding: 10, borderRadius: 8, border: "1px solid #ddd" };
const filterBtn = { background: "#111", color: "white", padding: 10 };

const grid4 = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: 20,
};

const card = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  marginTop: 20,
};

const cardTitle = { margin: 0 };
const valueStyle = { fontSize: 22, fontWeight: 700 };
const hintStyle = { fontSize: 12, color: "#666" };

const sectionTitle = { marginBottom: 10 };
const emptyText = { color: "#666" };