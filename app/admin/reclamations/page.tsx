import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken, ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

import AdminBackButton from "@/components/admin/AdminBackButton";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Status =
  | "NEW"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

type Priority =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "URGENT";

/* =========================
   HELPERS
========================= */

function getPriorityColor(
  priority: string
) {
  switch (priority) {
    case "URGENT":
      return "#dc2626";

    case "HIGH":
      return "#f59e0b";

    case "MEDIUM":
      return "#2563eb";

    default:
      return "#9ca3af";
  }
}

function getStatusColor(
  status: string
) {
  switch (status) {
    case "NEW":
      return "#f59e0b";

    case "IN_PROGRESS":
      return "#2563eb";

    case "RESOLVED":
      return "#16a34a";

    case "CLOSED":
      return "#6b7280";

    default:
      return "#111";
  }
}

function formatDate(
  date: Date
) {
  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(date);
}

/* =========================
   PAGE
========================= */

export default async function AdminReclamationsPage({
  searchParams,
}: {
  searchParams?: {
    status?: string;
    priority?: string;
    q?: string;
  };
}) {
  const isAdmin = verifyAdminToken(
    cookies().get(ADMIN_SESSION_COOKIE)?.value
  );

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const statusFilter =
    searchParams?.status || "";

  const priorityFilter =
    searchParams?.priority || "";

  const query =
    searchParams?.q || "";

  const reclamations =
    await prisma.reclamation.findMany({
      where: {
        ...(statusFilter
          ? {
              status:
                statusFilter as Status,
            }
          : {}),

        ...(priorityFilter
          ? {
              priority:
                priorityFilter as Priority,
            }
          : {}),

        ...(query
          ? {
              OR: [
                {
                  email: {
                    contains: query,
                    mode:
                      "insensitive",
                  },
                },

                {
                  name: {
                    contains: query,
                    mode:
                      "insensitive",
                  },
                },

                {
                  subject: {
                    contains: query,
                    mode:
                      "insensitive",
                  },
                },
              ],
            }
          : {}),
      },

      orderBy: [
        {
          priority: "desc",
        },

        {
          createdAt: "desc",
        },
      ],
    });

  /* ================= KPI ================= */

  const total =
    reclamations.length;

  const newCount =
    reclamations.filter(
      (r) => r.status === "NEW"
    ).length;

  const progressCount =
    reclamations.filter(
      (r) =>
        r.status ===
        "IN_PROGRESS"
    ).length;

  const resolvedCount =
    reclamations.filter(
      (r) =>
        r.status ===
        "RESOLVED"
    ).length;

  const urgentCount =
    reclamations.filter(
      (r) =>
        r.priority ===
        "URGENT"
    ).length;

  return (
    <div style={page}>
      <div style={container}>
        <AdminBackButton
          label="Retour dashboard"
          fallback="/admin"
        />

        {/* HERO */}

        <div style={hero}>
          <div>
            <p style={heroTag}>
              SUPPORT CENTER
            </p>

            <h1 style={title}>
              SAV & Réclamations
            </h1>

            <p style={subtitle}>
              Gestion premium du
              support Vanille’Or
            </p>
          </div>

          <div style={heroBadge}>
            {total} ticket
            {total > 1 ? "s" : ""}
          </div>
        </div>

        {/* KPI */}

        <div style={kpiGrid}>
          <KPI
            title="📨 Total"
            value={total}
          />

          <KPI
            title="🆕 Nouveaux"
            value={newCount}
            color="#f59e0b"
          />

          <KPI
            title="⚡ En cours"
            value={progressCount}
            color="#2563eb"
          />

          <KPI
            title="✅ Résolus"
            value={resolvedCount}
            color="#16a34a"
          />

          <KPI
            title="🚨 Urgents"
            value={urgentCount}
            color="#dc2626"
          />
        </div>

        {/* FILTERS */}

        <div style={filterCard}>
          <form
            method="GET"
            style={filterBar}
          >
            <input
              name="q"
              placeholder="Recherche email, client, sujet..."
              defaultValue={query}
              style={searchInput}
            />

            <select
              name="status"
              defaultValue={
                statusFilter
              }
              style={select}
            >
              <option value="">
                Tous statuts
              </option>

              <option value="NEW">
                NEW
              </option>

              <option value="IN_PROGRESS">
                IN_PROGRESS
              </option>

              <option value="RESOLVED">
                RESOLVED
              </option>

              <option value="CLOSED">
                CLOSED
              </option>
            </select>

            <select
              name="priority"
              defaultValue={
                priorityFilter
              }
              style={select}
            >
              <option value="">
                Toutes priorités
              </option>

              <option value="LOW">
                LOW
              </option>

              <option value="MEDIUM">
                MEDIUM
              </option>

              <option value="HIGH">
                HIGH
              </option>

              <option value="URGENT">
                URGENT
              </option>
            </select>

            <button
              type="submit"
              style={filterBtn}
            >
              Filtrer
            </button>
          </form>
        </div>

        {/* LIST */}

        {reclamations.length ===
        0 ? (
          <div style={emptyBox}>
            Aucun ticket SAV
            trouvé.
          </div>
        ) : (
          <div style={ticketsGrid}>
            {reclamations.map(
              (r) => (
                <div
                  key={r.id}
                  style={{
                    ...ticketCard,

                    borderLeft: `5px solid ${getPriorityColor(
                      r.priority
                    )}`,
                  }}
                >
                  {/* TOP */}

                  <div style={topRow}>
                    <div>
                      <h3 style={name}>
                        {r.name}
                      </h3>

                      <p style={email}>
                        {r.email}
                      </p>
                    </div>

                    <div
                      style={{
                        ...priorityBadge,
                        background:
                          getPriorityColor(
                            r.priority
                          ),
                      }}
                    >
                      {
                        r.priority
                      }
                    </div>
                  </div>

                  {/* STATUS */}

                  <div
                    style={{
                      ...statusBadge,
                      background:
                        getStatusColor(
                          r.status
                        ),
                    }}
                  >
                    {r.status}
                  </div>

                  {/* ORDER */}

                  {r.orderId && (
                    <div style={orderBox}>
                      🧾 Commande :
                      {" "}
                      {
                        r.orderId
                      }
                    </div>
                  )}

                  {/* SUBJECT */}

                  <h4 style={subject}>
                    {r.subject}
                  </h4>

                  {/* MESSAGE */}

                  <div
                    style={messageBox}
                  >
                    {r.message}
                  </div>

                  {/* DATE */}

                  <div style={footer}>
                    <span
                      style={
                        date
                      }
                    >
                      {formatDate(
                        r.createdAt
                      )}
                    </span>

                    <div
                      style={
                        actions
                      }
                    >
                      <a
                        href={`mailto:${r.email}`}
                        style={
                          btnPrimary
                        }
                      >
                        Répondre
                      </a>

                      <a
                        href={`/admin/reclamations/${r.id}`}
                        style={
                          btnSecondary
                        }
                      >
                        Ouvrir
                      </a>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   COMPONENTS
========================= */

function KPI({
  title,
  value,
  color,
}: any) {
  return (
    <div
      style={{
        ...kpiCard,
        borderLeft: `4px solid ${
          color || "#a16207"
        }`,
      }}
    >
      <div style={kpiTitle}>
        {title}
      </div>

      <div style={kpiValue}>
        {value}
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */

const page = {
  background: "#f8f5ef",
  minHeight: "100vh",
  padding: "40px 20px",
};

const container = {
  maxWidth: 1450,
  margin: "0 auto",
};

const hero = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  marginTop: 20,
  marginBottom: 30,
  gap: 20,
  flexWrap: "wrap" as const,
};

const heroTag = {
  color: "#a16207",
  fontWeight: 800,
  fontSize: 12,
  letterSpacing: "0.12em",
};

const title = {
  fontSize: 42,
  marginTop: 10,
  marginBottom: 10,
  fontWeight: 800,
};

const subtitle = {
  color: "#666",
};

const heroBadge = {
  background: "#111",
  color: "white",
  padding: "14px 20px",
  borderRadius: 999,
  fontWeight: 800,
};

const kpiGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: 18,
  marginBottom: 24,
};

const kpiCard = {
  background: "white",
  padding: 22,
  borderRadius: 20,
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.04)",
};

const kpiTitle = {
  color: "#777",
  fontSize: 13,
};

const kpiValue = {
  marginTop: 10,
  fontSize: 30,
  fontWeight: 800,
};

const filterCard = {
  background: "white",
  padding: 20,
  borderRadius: 22,
  marginBottom: 26,
};

const filterBar = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap" as const,
};

const searchInput = {
  padding: 14,
  borderRadius: 14,
  border: "1px solid #ddd",
  minWidth: 300,
};

const select = {
  padding: 14,
  borderRadius: 14,
  border: "1px solid #ddd",
};

const filterBtn = {
  background:
    "linear-gradient(135deg,#b7791f,#8b5e14)",
  color: "white",
  border: "none",
  borderRadius: 14,
  padding: "14px 22px",
  fontWeight: 800,
  cursor: "pointer",
};

const ticketsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fill,minmax(380px,1fr))",
  gap: 22,
};

const ticketCard = {
  background: "white",
  padding: 24,
  borderRadius: 24,
  boxShadow:
    "0 12px 35px rgba(0,0,0,0.05)",
};

const topRow = {
  display: "flex",
  justifyContent:
    "space-between",
  gap: 14,
};

const name = {
  margin: 0,
  fontSize: 20,
  fontWeight: 800,
};

const email = {
  color: "#666",
  marginTop: 6,
  fontSize: 14,
};

const priorityBadge = {
  color: "white",
  padding: "8px 12px",
  borderRadius: 999,
  fontWeight: 800,
  fontSize: 12,
  height: "fit-content",
};

const statusBadge = {
  display: "inline-block",
  marginTop: 18,
  color: "white",
  padding: "7px 12px",
  borderRadius: 999,
  fontWeight: 700,
  fontSize: 12,
};

const orderBox = {
  marginTop: 18,
  background: "#faf7f2",
  padding: 12,
  borderRadius: 14,
  fontSize: 13,
  color: "#555",
};

const subject = {
  marginTop: 20,
  marginBottom: 12,
  fontSize: 18,
};

const messageBox = {
  background: "#f9fafb",
  borderRadius: 18,
  padding: 16,
  lineHeight: 1.7,
  color: "#555",
  minHeight: 120,
};

const footer = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  marginTop: 22,
  gap: 14,
  flexWrap: "wrap" as const,
};

const date = {
  color: "#888",
  fontSize: 12,
};

const actions = {
  display: "flex",
  gap: 10,
};

const btnPrimary = {
  background: "#a16207",
  color: "white",
  padding: "12px 16px",
  borderRadius: 12,
  textDecoration: "none",
  fontWeight: 700,
};

const btnSecondary = {
  background: "#111",
  color: "white",
  padding: "12px 16px",
  borderRadius: 12,
  textDecoration: "none",
  fontWeight: 700,
};

const emptyBox = {
  background: "white",
  padding: 40,
  borderRadius: 24,
  textAlign: "center" as const,
};