import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminBackButton from "@/components/admin/AdminBackButton";

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

export default async function AdminReclamationsPage({
  searchParams,
}: {
  searchParams?: {
    status?: string;
    priority?: string;
    q?: string;
  };
}) {
  const isAdmin = cookies().get("admin");

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
                    mode: "insensitive",
                  },
                },

                {
                  name: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  const total = reclamations.length;

  const newCount =
    reclamations.filter(
      (r) => r.status === "NEW"
    ).length;

  const progressCount =
    reclamations.filter(
      (r) =>
        r.status === "IN_PROGRESS"
    ).length;

  const resolvedCount =
    reclamations.filter(
      (r) =>
        r.status === "RESOLVED"
    ).length;

  const urgentCount =
    reclamations.filter(
      (r) =>
        r.priority === "URGENT"
    ).length;

  return (
    <div style={container}>
      <AdminBackButton
        label="Retour dashboard"
        fallback="/admin"
      />

      <br />
      <br />

      <div style={hero}>
        <div>
          <p style={tag}>
            SUPPORT CENTER
          </p>

          <h1 style={title}>
            SAV & Réclamations
          </h1>

          <p style={subtitle}>
            Gestion du support client
            premium Vanille’Or
          </p>
        </div>

        <div style={heroBadge}>
          {total} tickets
        </div>
      </div>

      {/* KPI */}

      <div style={kpiGrid}>
        <KPI
          title="Total"
          value={total}
        />

        <KPI
          title="Nouveaux"
          value={newCount}
          color="#f59e0b"
        />

        <KPI
          title="En cours"
          value={progressCount}
          color="#2563eb"
        />

        <KPI
          title="Résolus"
          value={resolvedCount}
          color="#16a34a"
        />

        <KPI
          title="Urgents"
          value={urgentCount}
          color="#dc2626"
        />
      </div>

      {/* FILTER */}

      <form
        method="GET"
        style={filterBar}
      >
        <input
          name="q"
          placeholder="Recherche client..."
          defaultValue={query}
          style={input}
        />

        <select
          name="status"
          defaultValue={statusFilter}
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

        <button style={filterBtn}>
          Filtrer
        </button>
      </form>

      {/* LIST */}

      {reclamations.length === 0 ? (
        <div style={empty}>
          Aucun ticket SAV
        </div>
      ) : (
        <div style={grid}>
          {reclamations.map((r) => (
            <div
              key={r.id}
              style={{
                ...card,

                borderLeft: `5px solid ${
                  r.priority === "URGENT"
                    ? "#dc2626"
                    : r.priority ===
                      "HIGH"
                    ? "#f59e0b"
                    : r.priority ===
                      "MEDIUM"
                    ? "#2563eb"
                    : "#9ca3af"
                }`,
              }}
            >
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
                  style={priorityBadge(
                    r.priority
                  )}
                >
                  {r.priority}
                </div>
              </div>

              <div style={statusBadge(
                r.status
              )}>
                {r.status}
              </div>

              {r.orderId && (
                <p style={order}>
                  🧾 {r.orderId}
                </p>
              )}

              <h4 style={subject}>
                {r.subject}
              </h4>

              <div style={messageBox}>
                {r.message}
              </div>

              <p style={date}>
                {new Date(
                  r.createdAt
                ).toLocaleString(
                  "fr-FR"
                )}
              </p>

              <div style={actions}>
                <a
                  href={`mailto:${r.email}`}
                  style={btnPrimary}
                >
                  Répondre
                </a>

                <a
                  href={`/admin/reclamations/${r.id}`}
                  style={btnSecondary}
                >
                  Ouvrir
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* COMPONENTS */

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

/* STYLES */

const container = {
  padding: "40px",
  background: "#f8f5ef",
  minHeight: "100vh",
};

const hero = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  marginBottom: "30px",
};

const tag = {
  color: "#a16207",
  fontWeight: 800,
  letterSpacing: "0.1em",
};

const title = {
  fontSize: "40px",
  margin: 0,
};

const subtitle = {
  color: "#666",
};

const heroBadge = {
  background: "#111",
  color: "white",
  padding: "14px 18px",
  borderRadius: "999px",
  fontWeight: 800,
};

const kpiGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(5,1fr)",
  gap: "15px",
  marginBottom: "25px",
};

const kpiCard = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
};

const kpiTitle = {
  fontSize: "12px",
  color: "#777",
};

const kpiValue = {
  fontSize: "26px",
  fontWeight: 800,
};

const filterBar = {
  display: "flex",
  gap: "10px",
  marginBottom: "25px",
  flexWrap: "wrap" as const,
};

const input = {
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  minWidth: "240px",
};

const select = {
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #ddd",
};

const filterBtn = {
  background:
    "linear-gradient(135deg,#b7791f,#8b5e14)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  padding: "12px 18px",
  fontWeight: 800,
};

const grid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fill,minmax(340px,1fr))",
  gap: "20px",
};

const card = {
  background: "white",
  padding: "24px",
  borderRadius: "20px",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.05)",
};

const topRow = {
  display: "flex",
  justifyContent:
    "space-between",
  gap: "15px",
};

const name = {
  margin: 0,
};

const email = {
  color: "#666",
  fontSize: "14px",
};

const order = {
  fontSize: "13px",
  color: "#666",
};

const subject = {
  marginTop: "15px",
};

const messageBox = {
  background: "#f3f4f6",
  padding: "14px",
  borderRadius: "14px",
  marginTop: "12px",
  lineHeight: 1.6,
};

const date = {
  color: "#999",
  fontSize: "12px",
  marginTop: "16px",
};

const actions = {
  display: "flex",
  gap: "10px",
  marginTop: "20px",
};

const btnPrimary = {
  flex: 1,
  background: "#a16207",
  color: "white",
  padding: "12px",
  borderRadius: "12px",
  textAlign: "center" as const,
  textDecoration: "none",
};

const btnSecondary = {
  flex: 1,
  background: "#111",
  color: "white",
  padding: "12px",
  borderRadius: "12px",
  textAlign: "center" as const,
  textDecoration: "none",
};

const empty = {
  background: "white",
  padding: "40px",
  borderRadius: "20px",
  textAlign: "center" as const,
};

const priorityBadge = (
  priority: string
) => ({
  background:
    priority === "URGENT"
      ? "#dc2626"
      : priority === "HIGH"
      ? "#f59e0b"
      : priority === "MEDIUM"
      ? "#2563eb"
      : "#9ca3af",

  color: "white",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 700,
});

const statusBadge = (
  status: string
) => ({
  display: "inline-block",
  marginTop: "14px",
  background: "#111",
  color: "white",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "12px",
});