import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import AdminBackButton from "@/components/admin/AdminBackButton";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SearchParams = {
  status?: string;
  search?: string;
  page?: string;
};

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  priceCents: number;
};

const PAGE_SIZE = 12;

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const isAdmin = cookies().get("admin")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const statusRaw = (searchParams?.status || "ACTIVE").trim();
  const search = (searchParams?.search || "").trim();
  const page = Number(searchParams?.page || "1");

  const activeStatuses: OrderStatus[] = [
    "PENDING",
    "PAID",
    "SHIPPED",
  ];

  let where: any = {};

  if (statusRaw === "ACTIVE") {
    where.status = {
      in: activeStatuses,
    };
  } else if (
    Object.values(OrderStatus).includes(
      statusRaw as OrderStatus
    )
  ) {
    where.status = statusRaw as OrderStatus;
  }

  if (search) {
    where.OR = [
      {
        id: {
          contains: search,
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        trackingNumber: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const skip = (page - 1) * PAGE_SIZE;

  let orders: any[] = [];
  let total = 0;

  try {
    const result = await Promise.all([
      prisma.order.findMany({
        where,

        include: {
          user: true,
        },

        orderBy: [
          {
            createdAt: "desc",
          },
        ],

        skip,
        take: PAGE_SIZE,
      }),

      prisma.order.count({
        where,
      }),
    ]);

    orders = result[0];
    total = result[1];

    console.log("📦 ADMIN ORDERS:", total);

  } catch (error) {
    console.error("❌ ADMIN ORDERS ERROR:", error);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const pendingCount = orders.filter(
    (o) => o.status === "PENDING"
  ).length;
  
  const paidCount = orders.filter(
    (o) => o.status === "PAID"
  ).length;
  
  const shippedCount = orders.filter(
    (o) => o.status === "SHIPPED"
  ).length;

  return (
    <div style={container}>
      <div style={topBar}>
        <div>
          
        <AdminBackButton
            label="Retour dashboard"
            fallback="/admin"
          />

          <br />
          <br />

          <h1 style={title}>🧾 Commandes</h1>

          <p style={subtitle}>
            Gestion des commandes Vanille’Or
          </p>
        </div>
      </div>

      <div style={grid3}>
        <Card title="En attente" value={pendingCount} />
        <Card title="Payées" value={paidCount} />
        <Card title="Expédiées" value={shippedCount} />
      </div>

      <div style={card}>
        <form method="GET" style={filterRow}>
          <input
            type="text"
            name="search"
            placeholder="Recherche email, ID, tracking..."
            defaultValue={search}
            style={searchInput}
          />

          <select
            name="status"
            defaultValue={statusRaw}
            style={input}
          >
            <option value="ACTIVE">
              Actives uniquement
            </option>

            <option value="">
              Tous les statuts
            </option>

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

      {orders.length === 0 ? (
        <div style={card}>
          Aucune commande trouvée.
        </div>
      ) : (
        <>
          <div style={listWrapper}>
            {orders.map((order) => {
              let items: OrderItem[] = [];

              try {
                if (Array.isArray(order.items)) {
                  items = order.items as OrderItem[];
                }
              } catch {}

              return (
                <div
                  key={order.id}
                  style={orderCard}
                >
                  <div style={orderHeader}>
                    <div>
                      <h3 style={{ margin: 0 }}>
                        #{order.id.slice(0, 8)}
                      </h3>

                      <p style={mutedText}>
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div style={headerRight}>
                      <StatusBadge status={order.status} />

                      <strong>
                        {formatPrice(order.totalCents)}
                      </strong>
                    </div>
                  </div>

                  <div style={metaGrid}>
                    <div>
                      <span style={metaLabel}>
                        Client
                      </span>

                      <p style={metaValue}>
                        {order.email ||
                          order.user?.email ||
                          "Non renseigné"}
                      </p>
                    </div>

                    <div>
                      <span style={metaLabel}>
                        Tracking
                      </span>

                      <p style={metaValue}>
                        {order.trackingNumber ||
                          "Non renseigné"}
                      </p>
                    </div>

                    <div>
                      <span style={metaLabel}>
                        Stripe
                      </span>

                      <p style={metaValue}>
                        {order.stripePaymentId
                          ? "Payé"
                          : "En attente"}
                      </p>
                    </div>
                  </div>

                  <div style={itemsBox}>
                    <h4 style={itemsTitle}>
                      Articles
                    </h4>

                    {items.map((item, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        style={itemRow}
                      >
                        <span>
                          {item.name}
                        </span>

                        <span>
                          {item.quantity} ×{" "}
                          {formatPrice(item.priceCents)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <form
                    action="/api/admin/update-status"
                    method="POST"
                    style={statusForm}
                  >
                    <input
                      type="hidden"
                      name="orderId"
                      value={order.id}
                    />

                    <select
                      name="status"
                      defaultValue={order.status}
                      style={input}
                    >
                      {Object.values(OrderStatus).map(
                        (s) => (
                          <option
                            key={s}
                            value={s}
                          >
                            {s}
                          </option>
                        )
                      )}
                    </select>

                    <input
                      name="trackingNumber"
                      placeholder="Tracking"
                      defaultValue={
                        order.trackingNumber || ""
                      }
                      style={input}
                    />

                    <select
                      name="carrier"
                      defaultValue={
                        order.carrier || ""
                      }
                      style={input}
                    >
                      <option value="">
                        Transporteur
                      </option>

                      <option value="colissimo">
                        Colissimo
                      </option>

                      <option value="chronopost">
                        Chronopost
                      </option>

                      <option value="dhl">
                        DHL
                      </option>
                    </select>

                    <button
                      type="submit"
                      style={secondaryBtn}
                    >
                      Mettre à jour
                    </button>
                  </form>
                </div>
              );
            })}
          </div>

          {/* PAGINATION */}

          <div style={pagination}>
            {page > 1 && (
              <Link
                href={`/admin/orders?page=${page - 1}&status=${statusRaw}&search=${search}`}
                style={pageBtn}
              >
                ← Précédent
              </Link>
            )}

            <span style={pageInfo}>
              Page {page} / {totalPages || 1}
            </span>

            {page < totalPages && (
              <Link
                href={`/admin/orders?page=${page + 1}&status=${statusRaw}&search=${search}`}
                style={pageBtn}
              >
                Suivant →
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div style={card}>
      <h3 style={cardTitle}>{title}</h3>

      <p style={valueStyle}>{value}</p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  const colors: Record<OrderStatus, string> = {
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
        ...statusBadge,
        background: colors[status],
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
  marginBottom: "20px",
};

const title = {
  fontSize: "32px",
  margin: 0,
};

const subtitle = {
  color: "#666",
};

const grid3 = {
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: "20px",
  marginBottom: "20px",
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "14px",
};

const cardTitle = {
  margin: 0,
};

const valueStyle = {
  fontSize: "26px",
  fontWeight: 800,
};

const filterRow = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap" as const,
};

const input = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
};

const searchInput = {
  ...input,
  minWidth: "320px",
};

const primaryBtn = {
  background: "#a16207",
  color: "white",
  border: "none",
  borderRadius: "10px",
  padding: "12px 18px",
  cursor: "pointer",
};

const secondaryBtn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "10px",
  padding: "12px 18px",
  cursor: "pointer",
};

const listWrapper = {
  display: "grid",
  gap: "18px",
  marginTop: "20px",
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

const metaValue = {
  margin: 0,
};

const itemsBox = {
  background: "#faf7f2",
  padding: "14px",
  borderRadius: "10px",
  marginBottom: "16px",
};

const itemsTitle = {
  margin: "0 0 10px 0",
};

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

const pagination = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "16px",
  marginTop: "30px",
};

const pageBtn = {
  background: "#111",
  color: "white",
  padding: "10px 16px",
  borderRadius: "10px",
  textDecoration: "none",
};

const pageInfo = {
  fontWeight: 700,
};