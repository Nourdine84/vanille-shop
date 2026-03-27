import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Order, OrderStatus } from "@prisma/client";

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

  const orders: Order[] = await prisma.order.findMany({
    where: {
      ...(statusFilter ? { status: statusFilter as OrderStatus } : {}),
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

  const totalRevenue = orders.reduce(
    (acc, order) => acc + order.totalCents,
    0
  );

  const totalOrders = orders.length;
  const avgCart = totalOrders ? totalRevenue / totalOrders : 0;

  const paidOrders = orders.filter((o) => o.status === "PAID").length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;
  const shippedOrders = orders.filter((o) => o.status === "SHIPPED").length;
  const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;

  const productMap: Record<string, number> = {};

  orders.forEach((order) => {
    const items = Array.isArray(order.items)
      ? (order.items as unknown as OrderItem[])
      : [];

    items.forEach((item) => {
      productMap[item.name] = (productMap[item.name] || 0) + item.quantity;
    });
  });

  const topProducts = Object.entries(productMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div style={container}>
      <h1 style={title}>📊 Dashboard Vanille’Or</h1>

      <div style={grid4}>
        <Card title="💰 CA" value={`${(totalRevenue / 100).toFixed(2)} €`} />
        <Card title="📦 Commandes" value={String(totalOrders)} />
        <Card title="🛒 Panier moyen" value={`${(avgCart / 100).toFixed(2)} €`} />
        <Card title="✅ / ⏳" value={`${paidOrders} / ${pendingOrders}`} />
      </div>

      <div style={table}>
        <h2>Commandes</h2>

        {orders.map((order) => {
          const items = Array.isArray(order.items)
            ? (order.items as unknown as OrderItem[])
            : [];

          return (
            <div key={order.id} style={orderCard}>
              <div style={rowTop}>
                <strong>{order.email || "N/A"}</strong>
                <Status status={order.status} />
              </div>

              <div style={rowTop}>
                <span style={amount}>
                  {(order.totalCents / 100).toFixed(2)} €
                </span>
                <span style={date}>
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>

              <div style={itemsBox}>
                {items.map((item, i) => (
                  <p key={i}>{item.name} x{item.quantity}</p>
                ))}
              </div>

              {/* 🔥 TRACKING */}
              <form action="/api/admin/update-tracking" method="POST" style={actionRow}>
                <input type="hidden" name="id" value={order.id} />

                <input
                  name="trackingNumber"
                  placeholder="Tracking"
                  defaultValue={order.trackingNumber || ""}
                  style={input}
                />

                <input
                  name="carrier"
                  placeholder="Transporteur"
                  defaultValue={order.carrier || ""}
                  style={input}
                />

                <button style={primaryBtn}>Enregistrer</button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* COMPONENTS */

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div style={card}>
      <h3>{title}</h3>
      <p style={valueStyle}>{value}</p>
    </div>
  );
}

function Status({ status }: { status: OrderStatus }) {
  const colors: Record<OrderStatus, string> = {
    PAID: "#16a34a",
    PENDING: "#f59e0b",
    SHIPPED: "#2563eb",
    DELIVERED: "#7c3aed",
    FAILED: "#dc2626",
    CANCELED: "#dc2626",
  };

  return (
    <span style={{ ...badge, background: colors[status] }}>
      {status}
    </span>
  );
}

/* STYLES */

const container = { padding: "40px", background: "#faf7f2" };
const title = { fontSize: "28px", marginBottom: "30px" };
const grid4 = { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "20px" };
const card = { background: "white", padding: "20px", borderRadius: "12px" };
const valueStyle = { fontSize: "22px", fontWeight: 700 };
const table = { marginTop: "30px" };
const orderCard = { background: "white", padding: "20px", marginTop: "15px", borderRadius: "12px" };
const rowTop = { display: "flex", justifyContent: "space-between" };
const amount = { color: "#a16207", fontWeight: 700 };
const date = { fontSize: "12px", color: "#777" };
const itemsBox = { marginTop: "10px" };
const actionRow = { marginTop: "10px", display: "flex", gap: "10px" };
const input = { padding: "10px", borderRadius: "8px", border: "1px solid #ddd" };
const primaryBtn = { background: "#a16207", color: "white", padding: "10px", borderRadius: "8px", border: "none" };
const badge = { padding: "6px 10px", borderRadius: "999px", color: "white" };