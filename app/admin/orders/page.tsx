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

/* ================= HELPERS ================= */

function formatPrice(priceCents: number) {
  return (
    (priceCents / 100)
      .toFixed(2)
      .replace(".", ",") + " €"
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(date);
}

function getStatusColor(
  status: OrderStatus
) {
  switch (status) {
    case "PENDING":
      return "#f59e0b";

    case "PAID":
      return "#16a34a";

    case "SHIPPED":
      return "#2563eb";

    case "DELIVERED":
      return "#7c3aed";

    case "FAILED":
      return "#dc2626";

    case "CANCELED":
      return "#6b7280";

    default:
      return "#111";
  }
}

/* ================= PAGE ================= */

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const isAdmin =
    cookies().get("admin")?.value ===
    "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const statusRaw = (
    searchParams?.status || "ACTIVE"
  ).trim();

  const search = (
    searchParams?.search || ""
  ).trim();

  const page = Number(
    searchParams?.page || "1"
  );

  const activeStatuses: OrderStatus[] =
    [
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
    where.status =
      statusRaw as OrderStatus;
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

  const skip =
    (page - 1) * PAGE_SIZE;

  let orders: any[] = [];
  let total = 0;

  try {
    const result =
      await Promise.all([
        prisma.order.findMany({
          where,

          include: {
            user: true,
          },

          orderBy: {
            createdAt: "desc",
          },

          skip,
          take: PAGE_SIZE,
        }),

        prisma.order.count({
          where,
        }),
      ]);

    orders = result[0];
    total = result[1];

  } catch (error) {
    console.error(
      "❌ ADMIN ORDERS ERROR:",
      error
    );
  }

  const totalPages = Math.ceil(
    total / PAGE_SIZE
  );

  /* ================= KPI ================= */

  const pendingCount = orders.filter(
    (o) => o.status === "PENDING"
  ).length;

  const paidCount = orders.filter(
    (o) => o.status === "PAID"
  ).length;

  const shippedCount = orders.filter(
    (o) => o.status === "SHIPPED"
  ).length;

  const deliveredCount =
    orders.filter(
      (o) =>
        o.status === "DELIVERED"
    ).length;

  const revenue = orders
    .filter(
      (o) => o.status === "PAID"
    )
    .reduce(
      (acc, o) =>
        acc + o.totalCents,
      0
    );

  return (
    <div style={container}>
      {/* TOP */}

      <div style={topBar}>
        <div>
          <AdminBackButton
            label="Retour dashboard"
            fallback="/admin"
          />

          <br />
          <br />

          <h1 style={title}>
            🧾 Commandes
          </h1>

          <p style={subtitle}>
            Gestion premium des
            commandes Vanille’Or
          </p>
        </div>

        <div style={heroBadge}>
          {total} commandes
        </div>
      </div>

      {/* KPI */}

      <div style={grid5}>
        <KpiCard
          title="En attente"
          value={pendingCount}
          color="#f59e0b"
        />

        <KpiCard
          title="Payées"
          value={paidCount}
          color="#16a34a"
        />

        <KpiCard
          title="Expédiées"
          value={shippedCount}
          color="#2563eb"
        />

        <KpiCard
          title="Livrées"
          value={deliveredCount}
          color="#7c3aed"
        />

        <KpiCard
          title="CA"
          value={formatPrice(revenue)}
          color="#111"
        />
      </div>

      {/* FILTERS */}

      <div style={card}>
        <form
          method="GET"
          style={filterRow}
        >
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
              Tous statuts
            </option>

            {Object.values(
              OrderStatus
            ).map((s) => (
              <option
                key={s}
                value={s}
              >
                {s}
              </option>
            ))}
          </select>

          <button
            type="submit"
            style={primaryBtn}
          >
            Filtrer
          </button>
        </form>
      </div>

      {/* LIST */}

      {orders.length === 0 ? (
        <div style={emptyCard}>
          Aucune commande trouvée.
        </div>
      ) : (
        <>
          <div style={listWrapper}>
            {orders.map((order) => {
              let items: OrderItem[] =
                [];

              try {
                if (
                  typeof order.items ===
                  "string"
                ) {
                  items = JSON.parse(
                    order.items
                  );
                } else if (
                  Array.isArray(
                    order.items
                  )
                ) {
                  items = order.items;
                }
              } catch {}

              return (
                <div
                  key={order.id}
                  style={orderCard}
                >
                  {/* HEADER */}

                  <div style={orderHeader}>
                    <div>
                      <h3 style={orderId}>
                        #
                        {order.id.slice(
                          0,
                          8
                        )}
                      </h3>

                      <p style={mutedText}>
                        {formatDate(
                          order.createdAt
                        )}
                      </p>
                    </div>

                    <div
                      style={
                        headerRight
                      }
                    >
                      <StatusBadge
                        status={
                          order.status
                        }
                      />

                      <strong
                        style={
                          priceText
                        }
                      >
                        {formatPrice(
                          order.totalCents
                        )}
                      </strong>
                    </div>
                  </div>

                  {/* META */}

                  <div style={metaGrid}>
                    <Meta
                      label="Client"
                      value={
                        order.email ||
                        order.user
                          ?.email ||
                        "Non renseigné"
                      }
                    />

                    <Meta
                      label="Tracking"
                      value={
                        order.trackingNumber ||
                        "Non renseigné"
                      }
                    />

                    <Meta
                      label="Paiement"
                      value={
                        order.stripePaymentId
                          ? "Validé"
                          : "En attente"
                      }
                    />
                  </div>

                  {/* ITEMS */}

                  <div style={itemsBox}>
                    <h4
                      style={
                        itemsTitle
                      }
                    >
                      Articles
                    </h4>

                    {items.map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          key={
                            index
                          }
                          style={
                            itemRow
                          }
                        >
                          <span>
                            {
                              item.name
                            }
                          </span>

                          <span>
                            {
                              item.quantity
                            }
                            ×{" "}
                            {formatPrice(
                              item.priceCents
                            )}
                          </span>
                        </div>
                      )
                    )}
                  </div>

                  {/* ACTIONS */}

                  <div style={actionsRow}>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      style={detailsBtn}
                    >
                      Voir détail
                    </Link>

                    <form
                      action="/api/admin/orders/update-status"
                      method="POST"
                      style={
                        statusForm
                      }
                    >
                      <input
                        type="hidden"
                        name="orderId"
                        value={
                          order.id
                        }
                      />

                      <select
                        name="status"
                        defaultValue={
                          order.status
                        }
                        style={
                          input
                        }
                      >
                        {Object.values(
                          OrderStatus
                        ).map(
                          (
                            s
                          ) => (
                            <option
                              key={
                                s
                              }
                              value={
                                s
                              }
                            >
                              {
                                s
                              }
                            </option>
                          )
                        )}
                      </select>

                      <button
                        type="submit"
                        style={
                          secondaryBtn
                        }
                      >
                        Sauvegarder
                      </button>
                    </form>
                  </div>
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
              Page {page} /{" "}
              {totalPages || 1}
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

/* ================= COMPONENTS ================= */

function KpiCard({
  title,
  value,
  color,
}: any) {
  return (
    <div
      style={{
        ...card,
        borderLeft: `5px solid ${color}`,
      }}
    >
      <h3 style={cardTitle}>
        {title}
      </h3>

      <p style={valueStyle}>
        {value}
      </p>
    </div>
  );
}

function Meta({
  label,
  value,
}: any) {
  return (
    <div>
      <span style={metaLabel}>
        {label}
      </span>

      <p style={metaValue}>
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: OrderStatus;
}) {
  return (
    <span
      style={{
        ...statusBadge,
        background:
          getStatusColor(status),
      }}
    >
      {status}
    </span>
  );
}

/* ================= STYLES ================= */

const container = {
  padding: 30,
};

const topBar = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "flex-start",
  marginBottom: 24,
};

const title = {
  fontSize: 34,
  margin: 0,
};

const subtitle = {
  color: "#666",
};

const heroBadge = {
  background: "#111",
  color: "white",
  padding: "12px 18px",
  borderRadius: 999,
  fontWeight: 800,
};

const grid5 = {
  display: "grid",
  gridTemplateColumns:
    "repeat(5,1fr)",
  gap: 20,
  marginBottom: 20,
};

const card = {
  background: "white",
  padding: 20,
  borderRadius: 18,
};

const cardTitle = {
  margin: 0,
};

const valueStyle = {
  fontSize: 26,
  fontWeight: 800,
};

const filterRow = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap" as const,
};

const input = {
  padding: 12,
  borderRadius: 12,
  border: "1px solid #ddd",
};

const searchInput = {
  ...input,
  minWidth: 320,
};

const primaryBtn = {
  background: "#a16207",
  color: "white",
  border: "none",
  borderRadius: 12,
  padding: "12px 18px",
};

const secondaryBtn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 12,
  padding: "12px 18px",
};

const emptyCard = {
  background: "white",
  padding: 30,
  borderRadius: 20,
};

const listWrapper = {
  display: "grid",
  gap: 18,
  marginTop: 20,
};

const orderCard = {
  background: "white",
  padding: 24,
  borderRadius: 20,
  boxShadow:
    "0 6px 20px rgba(0,0,0,0.05)",
};

const orderHeader = {
  display: "flex",
  justifyContent:
    "space-between",
  marginBottom: 18,
};

const orderId = {
  margin: 0,
  fontSize: 22,
};

const headerRight = {
  display: "flex",
  alignItems: "center",
  gap: 14,
};

const priceText = {
  fontSize: 20,
};

const mutedText = {
  color: "#777",
  fontSize: 13,
};

const statusBadge = {
  color: "white",
  padding: "8px 12px",
  borderRadius: 999,
  fontWeight: 800,
  fontSize: 12,
};

const metaGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(3,1fr)",
  gap: 18,
  marginBottom: 18,
};

const metaLabel = {
  color: "#777",
  fontSize: 12,
};

const metaValue = {
  marginTop: 6,
  fontWeight: 600,
};

const itemsBox = {
  background: "#faf7f2",
  padding: 16,
  borderRadius: 14,
};

const itemsTitle = {
  marginTop: 0,
};

const itemRow = {
  display: "flex",
  justifyContent:
    "space-between",
  padding: "8px 0",
  borderBottom:
    "1px solid #ece7df",
};

const actionsRow = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  marginTop: 20,
  gap: 20,
  flexWrap: "wrap" as const,
};

const detailsBtn = {
  background: "#111",
  color: "white",
  padding: "12px 18px",
  borderRadius: 12,
  textDecoration: "none",
  fontWeight: 700,
};

const statusForm = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap" as const,
};

const pagination = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 18,
  marginTop: 30,
};

const pageBtn = {
  background: "#111",
  color: "white",
  padding: "10px 16px",
  borderRadius: 10,
  textDecoration: "none",
};

const pageInfo = {
  fontWeight: 700,
};