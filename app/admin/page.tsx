import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

type OrderItem = {
  name: string;
  quantity: number;
  priceCents: number;
};

type AdminOrder = {
  id: string;
  email: string | null;
  totalCents: number;
  status: string;
  createdAt: Date;
  items: unknown;
};

export default async function AdminPage() {
  const cookieStore = cookies();
  const isAdmin = cookieStore.get("admin");

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const ordersRaw = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  const orders = ordersRaw as AdminOrder[];

  const totalRevenue = orders.reduce(
    (acc: number, order: AdminOrder) => acc + order.totalCents,
    0
  );

  const totalOrders = orders.length;
  const avgCart = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const productMap: Record<string, number> = {};

  orders.forEach((order: AdminOrder) => {
    const items: OrderItem[] = Array.isArray(order.items)
      ? (order.items as OrderItem[])
      : [];

    items.forEach((item: OrderItem) => {
      if (!productMap[item.name]) {
        productMap[item.name] = 0;
      }
      productMap[item.name] += item.quantity;
    });
  });

  const topProducts = Object.entries(productMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div style={{ padding: "40px", background: "#faf7f2", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "30px" }}>
        📊 Dashboard Vanille’Or
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div style={cardStyle}>
          <h3>💰 Chiffre d’affaires</h3>
          <p style={valueStyle}>{(totalRevenue / 100).toFixed(2)} €</p>
        </div>

        <div style={cardStyle}>
          <h3>📦 Commandes</h3>
          <p style={valueStyle}>{totalOrders}</p>
        </div>

        <div style={cardStyle}>
          <h3>🛒 Panier moyen</h3>
          <p style={valueStyle}>{(avgCart / 100).toFixed(2)} €</p>
        </div>
      </div>

      <div style={cardStyle}>
        <h2>🏆 Top produits</h2>

        {topProducts.length === 0 && <p>Aucune vente.</p>}

        {topProducts.map(([name, qty]) => (
          <p key={name}>
            {name} — {qty} ventes
          </p>
        ))}
      </div>

      <h2 style={{ marginTop: "40px" }}>📦 Commandes</h2>

      {orders.map((order: AdminOrder) => {
        const items: OrderItem[] = Array.isArray(order.items)
          ? (order.items as OrderItem[])
          : [];

        return (
          <div key={order.id} style={orderCard}>
            <p>
              <strong>Email :</strong> {order.email || "N/A"}
            </p>

            <p>
              <strong>Total :</strong> {(order.totalCents / 100).toFixed(2)} €
            </p>

            <p>
              <strong>Statut :</strong> {order.status}
            </p>

            <p style={{ fontSize: "12px", color: "#666" }}>
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <div style={{ marginTop: "10px" }}>
              {items.map((item: OrderItem, i: number) => (
                <p key={i}>
                  {item.name} x{item.quantity}
                </p>
              ))}
            </div>

            <form
              action="/api/admin/update-order"
              method="POST"
              style={{
                marginTop: "16px",
                display: "flex",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <input type="hidden" name="id" value={order.id} />

              <select
                name="status"
                defaultValue={order.status}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  background: "white",
                }}
              >
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="FAILED">FAILED</option>
                <option value="CANCELED">CANCELED</option>
              </select>

              <button
                type="submit"
                style={{
                  background: "#a16207",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Mettre à jour
              </button>
            </form>
          </div>
        );
      })}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
};

const orderCard: React.CSSProperties = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  marginTop: "20px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
};

const valueStyle: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: "600",
};