import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

type OrderItem = {
  name: string;
  quantity: number;
  priceCents: number;
};

type OrderSafe = {
  id: string;
  email: string | null;
  status: OrderStatus;
  totalCents: number;
  createdAt: Date;
  items: unknown;
  trackingNumber: string | null;
  carrier: string | null;
};

type SearchParams = {
  status?: string;
  q?: string;
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

  /* =========================
     FILTERS SAFE
  ========================= */

  const rawStatus = searchParams?.status?.trim() || "";
  const query = searchParams?.q?.trim() || "";

  const validStatuses: OrderStatus[] = [
    "PENDING",
    "PAID",
    "SHIPPED",
    "DELIVERED",
    "FAILED",
    "CANCELED",
  ];

  const statusFilter = validStatuses.includes(rawStatus as OrderStatus)
    ? (rawStatus as OrderStatus)
    : undefined;

  /* =========================
     QUERY SAFE (NO TYPE BUG)
  ========================= */

  const orders: OrderSafe[] = await prisma.order.findMany({
    where: {
      ...(statusFilter ? { status: statusFilter } : {}),
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

  /* =========================
     KPIs
  ========================= */

  const totalRevenue = orders.reduce(
    (acc, order) => acc + order.totalCents,
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

  /* =========================
     TOP PRODUCTS SAFE
  ========================= */

  const productMap: Record<string, number> = {};

  orders.forEach((order) => {
    const items = Array.isArray(order.items)
      ? (order.items as OrderItem[])
      : [];

    items.forEach((item) => {
      if (!item?.name || !item?.quantity) return;

      productMap[item.name] =
        (productMap[item.name] || 0) + item.quantity;
    });
  });

  const topProducts = Object.entries(productMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  /* =========================
     UI
  ========================= */

  return (
    <div style={container}>
      <h1 style={title}>📊 Dashboard Vanille’Or</h1>

      <div style={grid4}>
        <Card title="💰 CA" value={`${(totalRevenue / 100).toFixed(2)} €`} />
        <Card title="📦 Commandes" value={String(totalOrders)} />
        <Card title="🛒 Panier moyen" value={`${(avgCart / 100).toFixed(2)} €`} />
        <Card title="✅ / ⏳" value={`${paidOrders} / ${pendingOrders}`} />
      </div>

      <div style={card}>
        <h2 style={{ marginBottom: "10px" }}>📦 Logistique</h2>

        <div style={statsRow}>
          <span>Payées: {paidOrders}</span>
          <span>Expédiées: {shippedOrders}</span>
          <span>Livrées: {deliveredOrders}</span>
          <span>Échecs: {failedOrders}</span>
          <span>Annulées: {canceledOrders}</span>
        </div>
      </div>

      <div style={card}>
        <h2 style={{ marginBottom: "10px" }}>🏆 Top produits</h2>

        {topProducts.length === 0 ? (
          <p style={{ color: "#777" }}>Aucune vente</p>
        ) : (
          topProducts.map(([name, qty], i) => (
            <div key={i} style={topProductRow}>
              <span>{i + 1}. {name}</span>
              <strong>{qty} ventes</strong>
            </div>
          ))
        )}
      </div>

      <div style={table}>
        <h2>Commandes</h2>

        {orders.length === 0 ? (
          <div style={emptyState}>Aucune commande trouvée.</div>
        ) : (
          orders.map((order) => {
            const items = Array.isArray(order.items)
              ? (order.items as OrderItem[])
              : [];

            return (
              <div key={order.id} style={orderCard}>
                <div style={rowTop}>
                  <strong>{order.email || "N/A"}</strong>
                  <Status status={order.status} />
                </div>

                <div style={{ ...rowTop, marginTop: "8px" }}>
                  <span style={amount}>
                    {(order.totalCents / 100).toFixed(2)} €
                  </span>
                  <span style={date}>
                    {new Date(order.createdAt).toLocaleString("fr-FR")}
                  </span>
                </div>

                <div style={itemsBox}>
                  {items.length === 0 ? (
                    <p style={{ color: "#777" }}>Aucun détail produit</p>
                  ) : (
                    items.map((item, i) => (
                      <p key={i}>
                        {item.name} x{item.quantity}
                      </p>
                    ))
                  )}
                </div>

                <form
                  action="/api/admin/update-order"
                  method="POST"
                  style={actionRow}
                >
                  <input type="hidden" name="id" value={order.id} />

                  <select name="status" defaultValue={order.status} style={input}>
                    {validStatuses.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>

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

                  <button type="submit" style={primaryBtn}>
                    Enregistrer
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

/* ========================= COMPONENTS ========================= */

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

/* ========================= STYLE ========================= */

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
  gridTemplateColumns: "repeat(4,1fr)",
  gap: "20px",
  marginBottom: "20px",
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "20px",
};

const valueStyle = {
  fontSize: "22px",
  fontWeight: 700,
};

const statsRow = {
  display: "flex",
  gap: "20px",
  flexWrap: "wrap" as const,
};

const table = {
  marginTop: "30px",
};

const orderCard = {
  background: "white",
  padding: "20px",
  marginTop: "15px",
  borderRadius: "12px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
};

const rowTop = {
  display: "flex",
  justifyContent: "space-between",
};

const amount = {
  color: "#a16207",
  fontWeight: 700,
};

const date = {
  fontSize: "12px",
  color: "#777",
};

const itemsBox = {
  marginTop: "10px",
};

const actionRow = {
  marginTop: "15px",
  display: "flex",
  gap: "10px",
  flexWrap: "wrap" as const,
};

const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const primaryBtn = {
  background: "#a16207",
  color: "white",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};

const badge = {
  padding: "6px 10px",
  borderRadius: "999px",
  color: "white",
  fontSize: "12px",
  fontWeight: 700,
};

const topProductRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "6px 0",
};

const emptyState = {
  background: "white",
  padding: "24px",
  borderRadius: "12px",
  color: "#777",
};