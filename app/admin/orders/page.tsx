import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SearchParams = {
  status?: string;
};

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  priceCents: number;
};

/* ================= UTIL ================= */

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

/* ================= PAGE ================= */

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const isAdmin = cookies().get("admin")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  /* ================= FILTER ================= */

  const statusRaw = searchParams?.status?.trim() || "";

  const status = Object.values(OrderStatus).includes(
    statusRaw as OrderStatus
  )
    ? (statusRaw as OrderStatus)
    : undefined;

  let orders: any[] = [];

  try {
    orders = await prisma.order.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("❌ ADMIN ORDERS ERROR:", error);
    orders = [];
  }

  /* ================= KPI ================= */

  const pendingCount = orders.filter((o) => o.status === "PENDING").length;
  const paidCount = orders.filter((o) => o.status === "PAID").length;
  const shippedCount = orders.filter((o) => o.status === "SHIPPED").length;

  return (
    <div style={container}>
      <h1 style={title}>🧾 Commandes</h1>

      {/* KPI */}
      <div style={grid3}>
        <Card title="En attente" value={pendingCount} />
        <Card title="Payées" value={paidCount} />
        <Card title="Expédiées" value={shippedCount} />
      </div>

      {/* FILTRE */}
      <div style={card}>
        <form method="GET" style={filterRow}>
          <select name="status" defaultValue={status} style={input}>
            <option value="">Tous les statuts</option>
            {Object.values(OrderStatus).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button type="submit" style={primaryBtn}>
            Filtrer
          </button>
        </form>
      </div>

      {/* LISTE */}
      {orders.length === 0 ? (
        <div style={card}>Aucune commande trouvée.</div>
      ) : (
        <div style={listWrapper}>
          {orders.map((order) => {
            const items = Array.isArray(order.items)
              ? (order.items as OrderItem[])
              : [];

            return (
              <div key={order.id} style={orderCard}>
                {/* HEADER */}
                <div style={orderHeader}>
                  <div>
                    <h3 style={{ margin: 0 }}>
                      Commande {order.id.slice(0, 8)}
                    </h3>
                    <p style={mutedText}>
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div style={headerRight}>
                    <StatusBadge status={order.status} />
                    <strong>{formatPrice(order.totalCents)}</strong>
                  </div>
                </div>

                {/* TRACKING BLOCK 🔥 */}
                {order.trackingNumber && (
                  <div style={trackingBox}>
                    📦 Tracking : <strong>{order.trackingNumber}</strong>
                    {order.carrier && (
                      <> — {order.carrier.toUpperCase()}</>
                    )}
                  </div>
                )}

                {/* META */}
                <div style={metaGrid}>
                  <div>
                    <span style={metaLabel}>Email</span>
                    <p style={metaValue}>
                      {order.email || "Non renseigné"}
                    </p>
                  </div>

                  <div>
                    <span style={metaLabel}>Paiement Stripe</span>
                    <p style={metaValue}>
                      {order.stripePaymentId || "En attente"}
                    </p>
                  </div>

                  <div>
                    <span style={metaLabel}>Tracking</span>
                    <p style={metaValue}>
                      {order.trackingNumber || "Non renseigné"}
                    </p>
                  </div>
                </div>

                {/* ITEMS */}
                <div style={itemsBox}>
                  <h4 style={itemsTitle}>Articles</h4>

                  {items.length === 0 ? (
                    <p style={mutedText}>Aucun article enregistré.</p>
                  ) : (
                    items.map((item, index) => (
                      <div key={`${item.id}-${index}`} style={itemRow}>
                        <span>{item.name}</span>
                        <span>
                          {item.quantity} × {formatPrice(item.priceCents)}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* UPDATE */}
                <form
                  action="/api/admin/orders/update-status"
                  method="POST"
                  style={statusForm}
                >
                  <input type="hidden" name="orderId" value={order.id} />

                  <select
                    name="status"
                    defaultValue={order.status}
                    style={input}
                  >
                    {Object.values(OrderStatus).map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  {/* TRACKING INPUT */}
                  <input
                    name="trackingNumber"
                    placeholder="Tracking"
                    defaultValue={order.trackingNumber || ""}
                    style={input}
                  />

                  {/* CARRIER */}
                  <select
                    name="carrier"
                    defaultValue={order.carrier || ""}
                    style={input}
                  >
                    <option value="">Transporteur</option>
                    <option value="colissimo">Colissimo</option>
                    <option value="chronopost">Chronopost</option>
                    <option value="dhl">DHL</option>
                  </select>

                  <button type="submit" style={secondaryBtn}>
                    Mettre à jour
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
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

function StatusBadge({ status }: { status: OrderStatus }) {
  const colors: Record<OrderStatus, string> = {
    PENDING: "#f59e0b",
    PAID: "#16a34a",
    SHIPPED: "#2563eb",
    DELIVERED: "#7c3aed",
    FAILED: "#dc2626",
    CANCELED: "#6b7280",
  };

  return (
    <span style={{ ...statusBadge, background: colors[status] }}>
      {status}
    </span>
  );
}

/* ================= STYLES ================= */

const container = { padding: "30px" };
const title = { fontSize: "28px", marginBottom: "20px" };

const grid3 = {
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: "20px",
  marginBottom: "20px",
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
};

const cardTitle = { margin: 0 };

const valueStyle = {
  fontSize: "24px",
  fontWeight: 700,
};

const filterRow = { display: "flex", gap: "10px" };

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
};

const secondaryBtn = {
  background: "#2563eb",
  color: "white",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "none",
};

const listWrapper = {
  marginTop: "20px",
  display: "grid",
  gap: "16px",
};

const orderCard = {
  background: "white",
  padding: "20px",
  borderRadius: "14px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
};

const orderHeader = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "16px",
};

const headerRight = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const mutedText = {
  color: "#777",
  fontSize: "13px",
};

const statusBadge = {
  color: "white",
  fontSize: "12px",
  fontWeight: 700,
  padding: "6px 10px",
  borderRadius: "999px",
};

const trackingBox = {
  background: "#eef2ff",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "10px",
  fontSize: "14px",
};

const metaGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: "16px",
  marginBottom: "16px",
};

const metaLabel = {
  display: "block",
  color: "#777",
  fontSize: "12px",
  marginBottom: "4px",
};

const metaValue = { margin: 0 };

const itemsBox = {
  background: "#faf7f2",
  padding: "14px",
  borderRadius: "10px",
  marginBottom: "16px",
};

const itemsTitle = { margin: "0 0 10px 0" };

const itemRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "6px 0",
  borderBottom: "1px solid #eee",
};

const statusForm = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap" as const,
  alignItems: "center",
};