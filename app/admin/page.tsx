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

  const totalRevenue = orders.reduce(
    (acc: number, order) => acc + order.totalCents,
    0
  );

  const totalOrders = orders.length;
  const avgCart = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const paidOrders = orders.filter((o) => o.status === "PAID").length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

  return (
    <div style={container}>
      <h1 style={title}>📊 Dashboard Vanille’Or</h1>

      <div style={grid4}>
        <Card title="💰 CA" value={`${(totalRevenue / 100).toFixed(2)} €`} />
        <Card title="📦 Commandes" value={String(totalOrders)} />
        <Card title="🛒 Panier moyen" value={`${(avgCart / 100).toFixed(2)} €`} />
        <Card title="✅ Payées / ⏳ En attente" value={`${paidOrders} / ${pendingOrders}`} />
      </div>

      <div style={filterBox}>
        <form method="GET" style={filterForm}>
          <input
            type="text"
            name="q"
            placeholder="Rechercher par email"
            defaultValue={query}
            style={input}
          />

          <select
            name="status"
            defaultValue={statusFilter}
            style={select}
          >
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

      <div style={table}>
        <h2 style={{ marginBottom: "10px" }}>Commandes</h2>

        {orders.length === 0 ? (
          <div style={emptyState}>
            Aucune commande trouvée.
          </div>
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
                    <p style={{ margin: 0, color: "#777" }}>
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

                <form
                  action="/api/admin/update-order"
                  method="POST"
                  style={actionRow}
                >
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

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div style={card}>
      <h3 style={cardTitle}>{title}</h3>
      <p style={valueStyle}>{value}</p>
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
  marginBottom: "30px",
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
};

const cardTitle = {
  margin: 0,
  fontSize: "16px",
};

const valueStyle = {
  fontSize: "22px",
  fontWeight: 700,
  marginTop: "10px",
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