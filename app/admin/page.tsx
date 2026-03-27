import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

type OrderItem = {
  name: string;
  quantity: number;
  priceCents: number;
};

type SearchParams = {
  status?: string;
  q?: string;
};

type DailyRevenue = {
  label: string;
  cents: number;
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const isAdmin = cookies().get("admin");

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const statusFilter = searchParams?.status?.trim() || "";
  const query = searchParams?.q?.trim() || "";

  const orders = await prisma.order.findMany({
    where: {
      ...(statusFilter ? { status: statusFilter as any } : {}),
      ...(query
        ? {
            email: {
              contains: query,
              mode: "insensitive",
            },
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  // KPI
  const totalRevenue = orders.reduce(
    (acc: number, order) => acc + order.totalCents,
    0
  );

  const totalOrders = orders.length;
  const avgCart = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const paidOrders = orders.filter((o) => o.status === "PAID").length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const shippedOrders = orders.filter((o) => o.status === "SHIPPED").length;
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;
  const failedOrders = orders.filter((o) => o.status === "FAILED").length;
  const canceledOrders = orders.filter((o) => o.status === "CANCELED").length;

  // Top produits
  const productMap: Record<string, number> = {};

  orders.forEach((order) => {
    const items = Array.isArray(order.items)
      ? (order.items as unknown as OrderItem[])
      : [];

    items.forEach((item) => {
      if (!productMap[item.name]) {
        productMap[item.name] = 0;
      }
      productMap[item.name] += item.quantity;
    });
  });

  const topProducts = Object.entries(productMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // CA 7 derniers jours
  const dailyRevenue = buildLast7DaysRevenue(orders);
  const maxDailyRevenue = Math.max(...dailyRevenue.map((d) => d.cents), 1);

  return (
    <div style={container}>
      <h1 style={title}>📊 Dashboard Vanille’Or</h1>

      {/* KPI */}
      <div style={grid4}>
        <Card title="💰 Chiffre d’affaires" value={`${(totalRevenue / 100).toFixed(2)} €`} />
        <Card title="📦 Commandes" value={String(totalOrders)} />
        <Card title="🛒 Panier moyen" value={`${(avgCart / 100).toFixed(2)} €`} />
        <Card title="✅ Payées / ⏳ En attente" value={`${paidOrders} / ${pendingOrders}`} />
      </div>

      {/* Actions */}
      <div style={actionsRow}>
        <a href="/api/admin/export" style={exportBtn}>
          📥 Export CSV
        </a>

        <div style={quickFilters}>
          <a href="/admin" style={quickFilterLink}>Tous</a>
          <a href="/admin?status=PENDING" style={quickFilterLink}>PENDING</a>
          <a href="/admin?status=PAID" style={quickFilterLink}>PAID</a>
          <a href="/admin?status=SHIPPED" style={quickFilterLink}>SHIPPED</a>
          <a href="/admin?status=DELIVERED" style={quickFilterLink}>DELIVERED</a>
        </div>
      </div>

      {/* Filtres */}
      <div style={filterBox}>
        <form method="GET" style={filterForm}>
          <input
            type="text"
            name="q"
            placeholder="Rechercher par email"
            defaultValue={query}
            style={input}
          />

          <select name="status" defaultValue={statusFilter} style={select}>
            <option value="">Tous les statuts</option>
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="FAILED">FAILED</option>
            <option value="CANCELED">CANCELED</option>
          </select>

          <button type="submit" style={primaryBtn}>
            Filtrer
          </button>
        </form>
      </div>

      {/* Blocs V4 */}
      <div style={grid2}>
        <div style={card}>
          <h2 style={sectionTitle}>🚚 Logistique</h2>

          <div style={statsList}>
            <StatLine label="Commandes payées" value={String(paidOrders)} />
            <StatLine label="Commandes expédiées" value={String(shippedOrders)} />
            <StatLine label="Commandes livrées" value={String(deliveredOrders)} />
            <StatLine label="Échecs paiement" value={String(failedOrders)} />
            <StatLine label="Annulées" value={String(canceledOrders)} />
          </div>
        </div>

        <div style={card}>
          <h2 style={sectionTitle}>📈 CA sur 7 jours</h2>

          <div style={{ marginTop: "14px" }}>
            {dailyRevenue.map((day) => (
              <div key={day.label} style={chartRow}>
                <div style={chartLabel}>{day.label}</div>

                <div style={chartBarTrack}>
                  <div
                    style={{
                      ...chartBarFill,
                      width: `${(day.cents / maxDailyRevenue) * 100}%`,
                    }}
                  />
                </div>

                <div style={chartValue}>
                  {(day.cents / 100).toFixed(2)} €
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top produits */}
      <div style={card}>
        <h2 style={sectionTitle}>🏆 Top produits</h2>

        {topProducts.length === 0 ? (
          <p style={{ color: "#777", marginTop: "12px" }}>Aucune vente.</p>
        ) : (
          <div style={{ marginTop: "12px" }}>
            {topProducts.map(([name, qty], index) => (
              <div key={name} style={topProductRow}>
                <span>
                  {index + 1}. {name}
                </span>
                <strong>{qty} ventes</strong>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Commandes */}
      <div style={table}>
        <h2 style={{ marginBottom: "10px" }}>Commandes</h2>

        {orders.length === 0 ? (
          <div style={emptyState}>Aucune commande trouvée.</div>
        ) : (
          orders.map((order) => {
            const items = Array.isArray(order.items)
              ? (order.items as unknown as OrderItem[])
              : [];

            return (
              <div key={order.id} style={orderCard}>
                <div style={rowTop}>
                  <span>
                    <strong>{order.email || "N/A"}</strong>
                  </span>
                  <Status status={String(order.status)} />
                </div>

                <div style={{ ...rowTop, marginTop: "8px" }}>
                  <span style={amount}>
                    {(order.totalCents / 100).toFixed(2)} €
                  </span>
                  <span style={date}>
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>

                <div style={itemsBox}>
                  {items.length === 0 ? (
                    <p style={{ color: "#777", margin: 0 }}>
                      Aucun détail produit disponible.
                    </p>
                  ) : (
                    items.map((item, i) => (
                      <p key={i} style={itemLine}>
                        {item.name} x{item.quantity}
                      </p>
                    ))
                  )}
                </div>

                <form action="/api/admin/update-order" method="POST" style={actionRow}>
                  <input type="hidden" name="id" value={order.id} />

                  <select
                    name="status"
                    defaultValue={String(order.status)}
                    style={select}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="FAILED">FAILED</option>
                    <option value="CANCELED">CANCELED</option>
                  </select>

                  <button type="submit" style={primaryBtn}>
                    Mettre à jour
                  </button>
                </form>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function buildLast7DaysRevenue(
  orders: Array<{
    createdAt: Date;
    totalCents: number;
  }>
): DailyRevenue[] {
  const result: DailyRevenue[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setHours(0, 0, 0, 0);
    day.setDate(today.getDate() - i);

    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);

    const cents = orders
      .filter((order) => order.createdAt >= day && order.createdAt < nextDay)
      .reduce((acc, order) => acc + order.totalCents, 0);

    result.push({
      label: day.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
      }),
      cents,
    });
  }

  return result;
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div style={card}>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={valueStyle}>{value}</p>
    </div>
  );
}

function StatLine({ label, value }: { label: string; value: string }) {
  return (
    <div style={statLine}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Status({ status }: { status: string }) {
  const bg =
    status === "PAID"
      ? "#16a34a"
      : status === "PENDING"
      ? "#f59e0b"
      : status === "SHIPPED"
      ? "#2563eb"
      : status === "DELIVERED"
      ? "#7c3aed"
      : "#dc2626";

  return (
    <span
      style={{
        padding: "6px 10px",
        borderRadius: "999px",
        background: bg,
        color: "white",
        fontSize: "12px",
        fontWeight: 700,
      }}
    >
      {status}
    </span>
  );
}

const container = {
  padding: "40px",
  background: "#faf7f2",
  minHeight: "100vh",
};

const title = {
  fontSize: "28px",
  marginBottom: "30px",
};

const grid4 = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "20px",
  marginBottom: "24px",
};

const grid2 = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
  marginBottom: "20px",
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  marginBottom: "20px",
};

const valueStyle = {
  fontSize: "22px",
  fontWeight: 700,
  marginTop: "10px",
};

const actionsRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  flexWrap: "wrap" as const,
  marginBottom: "20px",
};

const exportBtn = {
  display: "inline-block",
  background: "#111",
  color: "white",
  padding: "12px 18px",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: 600,
};

const quickFilters = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap" as const,
};

const quickFilterLink = {
  display: "inline-block",
  background: "white",
  color: "#111",
  padding: "10px 14px",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: 600,
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
};

const filterBox = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
  marginBottom: "25px",
};

const filterForm = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  flexWrap: "wrap" as const,
};

const input = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  minWidth: "260px",
};

const select = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  background: "white",
};

const primaryBtn = {
  background: "#a16207",
  color: "white",
  border: "none",
  borderRadius: "10px",
  padding: "12px 16px",
  cursor: "pointer",
  fontWeight: 700,
};

const sectionTitle = {
  margin: 0,
};

const statsList = {
  marginTop: "14px",
};

const statLine = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  borderBottom: "1px solid #f1f1f1",
};

const chartRow = {
  display: "grid",
  gridTemplateColumns: "60px 1fr 90px",
  alignItems: "center",
  gap: "12px",
  marginBottom: "10px",
};

const chartLabel = {
  fontSize: "13px",
  color: "#666",
};

const chartBarTrack = {
  width: "100%",
  height: "10px",
  background: "#f1f1f1",
  borderRadius: "999px",
  overflow: "hidden" as const,
};

const chartBarFill = {
  height: "100%",
  background: "#a16207",
  borderRadius: "999px",
};

const chartValue = {
  fontSize: "13px",
  textAlign: "right" as const,
  color: "#444",
};

const topProductRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  borderBottom: "1px solid #f1f1f1",
};

const table = {
  marginTop: "10px",
};

const orderCard = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  marginTop: "15px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
};

const rowTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const amount = {
  fontWeight: 700,
  color: "#a16207",
};

const date = {
  fontSize: "12px",
  color: "#777",
};

const itemsBox = {
  marginTop: "14px",
  paddingTop: "12px",
  borderTop: "1px solid #eee",
};

const itemLine = {
  margin: "4px 0",
};

const actionRow = {
  marginTop: "16px",
  display: "flex",
  gap: "10px",
  alignItems: "center",
  flexWrap: "wrap" as const,
};

const emptyState = {
  background: "white",
  padding: "24px",
  borderRadius: "12px",
  color: "#777",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
};