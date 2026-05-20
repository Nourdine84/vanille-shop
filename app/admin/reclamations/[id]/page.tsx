import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";

import AdminBackButton from "@/components/admin/AdminBackButton";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Props = {
  params: {
    id: string;
  };
};

/* =========================
   HELPERS
========================= */

function formatDate(
  date: Date
) {
  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      dateStyle: "full",
      timeStyle: "short",
    }
  ).format(date);
}

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

function getTimeline(
  status: string
) {
  return [
    {
      label: "Ticket créé",
      done: true,
    },

    {
      label:
        "Support pris en charge",
      done: [
        "IN_PROGRESS",
        "RESOLVED",
        "CLOSED",
      ].includes(status),
    },

    {
      label: "Résolution SAV",
      done: [
        "RESOLVED",
        "CLOSED",
      ].includes(status),
    },

    {
      label: "Ticket fermé",
      done:
        status === "CLOSED",
    },
  ];
}

/* =========================
   PAGE
========================= */

export default async function ReclamationDetailPage({
  params,
}: Props) {
  const isAdmin =
    cookies().get("admin")?.value ===
    "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const reclamation =
    await prisma.reclamation.findUnique({
      where: {
        id: params.id,
      },
    });

  if (!reclamation) {
    return notFound();
  }

  const timeline =
    getTimeline(
      reclamation.status
    );

  return (
    <div style={page}>
      <div style={container}>
        <AdminBackButton
          label="Retour réclamations"
          fallback="/admin/reclamations"
        />

        {/* HERO */}

        <div style={hero}>
          <div>
            <p style={heroTag}>
              SUPPORT TICKET
            </p>

            <h1 style={title}>
              {reclamation.subject}
            </h1>

            <p style={subtitle}>
              Ticket SAV premium
              Vanille’Or
            </p>
          </div>

          <div
            style={{
              ...priorityBadge,
              background:
                getPriorityColor(
                  reclamation.priority
                ),
            }}
          >
            {
              reclamation.priority
            }
          </div>
        </div>

        {/* KPI */}

        <div style={kpiGrid}>
          <KPI
            title="🎫 Ticket"
            value={reclamation.id.slice(
              0,
              8
            )}
          />

          <KPI
            title="📌 Status"
            value={
              reclamation.status
            }
            color={getStatusColor(
              reclamation.status
            )}
          />

          <KPI
            title="⚡ Priorité"
            value={
              reclamation.priority
            }
            color={getPriorityColor(
              reclamation.priority
            )}
          />

          <KPI
            title="📅 Création"
            value={new Date(
              reclamation.createdAt
            ).toLocaleDateString(
              "fr-FR"
            )}
          />
        </div>

        {/* TIMELINE */}

        <div style={section}>
          <h2 style={sectionTitle}>
            🚀 Timeline ticket
          </h2>

          <div style={timelineWrapper}>
            {timeline.map(
              (
                step,
                index
              ) => (
                <div
                  key={index}
                  style={
                    timelineItem
                  }
                >
                  <div
                    style={{
                      ...timelineDot,
                      background:
                        step.done
                          ? "#16a34a"
                          : "#d1d5db",
                    }}
                  />

                  <span
                    style={{
                      color:
                        step.done
                          ? "#111"
                          : "#777",
                    }}
                  >
                    {
                      step.label
                    }
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* MAIN GRID */}

        <div style={layout}>
          {/* LEFT */}

          <div style={left}>
            {/* CLIENT */}

            <div style={card}>
              <h2
                style={
                  sectionTitle
                }
              >
                👤 Client
              </h2>

              <div style={infoGrid}>
                <Info
                  label="Nom"
                  value={
                    reclamation.name
                  }
                />

                <Info
                  label="Email"
                  value={
                    reclamation.email
                  }
                />

                <Info
                  label="Commande"
                  value={
                    reclamation.orderId ||
                    "Non renseignée"
                  }
                />

                <Info
                  label="Date"
                  value={formatDate(
                    reclamation.createdAt
                  )}
                />
              </div>
            </div>

            {/* MESSAGE */}

            <div style={card}>
              <h2
                style={
                  sectionTitle
                }
              >
                💬 Message client
              </h2>

              <div
                style={
                  messageBox
                }
              >
                {
                  reclamation.message
                }
              </div>
            </div>

            {/* NOTE ADMIN */}

            <div style={card}>
              <h2
                style={
                  sectionTitle
                }
              >
                📝 Note interne
              </h2>

              <div
                style={
                  adminNoteBox
                }
              >
                {reclamation.adminNote ||
                  "Aucune note interne pour le moment."}
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div style={right}>
            {/* STATUS */}

            <div style={card}>
              <h2
                style={
                  sectionTitle
                }
              >
                ⚙️ Gestion
              </h2>

              <div
                style={{
                  ...statusBadge,
                  background:
                    getStatusColor(
                      reclamation.status
                    ),
                }}
              >
                {
                  reclamation.status
                }
              </div>

              <form
                action="/api/admin/reclamations/update"
                method="POST"
                style={form}
              >
                <input
                  type="hidden"
                  name="id"
                  value={
                    reclamation.id
                  }
                />

                <select
                  name="status"
                  defaultValue={
                    reclamation.status
                  }
                  style={input}
                >
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

                <textarea
                  name="adminNote"
                  placeholder="Ajouter une note interne..."
                  defaultValue={
                    reclamation.adminNote ||
                    ""
                  }
                  style={
                    textarea
                  }
                />

                <button
                  type="submit"
                  style={
                    saveBtn
                  }
                >
                  💾 Sauvegarder
                </button>
              </form>
            </div>

            {/* ACTIONS */}

            <div style={card}>
              <h2
                style={
                  sectionTitle
                }
              >
                📩 Actions
              </h2>

              <div style={actions}>
                <a
                  href={`mailto:${reclamation.email}`}
                  style={
                    primaryBtn
                  }
                >
                  Répondre
                </a>

                {reclamation.orderId && (
                  <a
                    href={`/admin/orders/${reclamation.orderId}`}
                    style={
                      secondaryBtn
                    }
                  >
                    Voir commande
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
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

function Info({
  label,
  value,
}: any) {
  return (
    <div>
      <p style={infoLabel}>
        {label}
      </p>

      <p style={infoValue}>
        {value}
      </p>
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
  letterSpacing: "0.1em",
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

const priorityBadge = {
  color: "white",
  padding: "12px 18px",
  borderRadius: 999,
  fontWeight: 800,
};

const kpiGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: 18,
  marginBottom: 26,
};

const kpiCard = {
  background: "white",
  padding: 22,
  borderRadius: 20,
};

const kpiTitle = {
  color: "#777",
  fontSize: 13,
};

const kpiValue = {
  marginTop: 10,
  fontSize: 26,
  fontWeight: 800,
};

const section = {
  background: "white",
  padding: 24,
  borderRadius: 24,
  marginBottom: 24,
};

const sectionTitle = {
  marginBottom: 20,
};

const timelineWrapper = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 16,
};

const timelineItem = {
  display: "flex",
  alignItems: "center",
  gap: 14,
};

const timelineDot = {
  width: 14,
  height: 14,
  borderRadius: 999,
};

const layout = {
  display: "grid",
  gridTemplateColumns:
    "2fr 1fr",
  gap: 24,
};

const left = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 24,
};

const right = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 24,
};

const card = {
  background: "white",
  padding: 24,
  borderRadius: 24,
};

const infoGrid = {
  display: "grid",
  gap: 18,
};

const infoLabel = {
  color: "#777",
  fontSize: 12,
  marginBottom: 6,
};

const infoValue = {
  margin: 0,
  fontWeight: 600,
};

const messageBox = {
  background: "#f9fafb",
  padding: 20,
  borderRadius: 18,
  lineHeight: 1.8,
  color: "#555",
};

const adminNoteBox = {
  background: "#faf7f2",
  padding: 20,
  borderRadius: 18,
  lineHeight: 1.8,
  color: "#555",
};

const statusBadge = {
  color: "white",
  padding: "10px 14px",
  borderRadius: 999,
  display: "inline-block",
  fontWeight: 800,
  marginBottom: 20,
};

const form = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 14,
};

const input = {
  padding: 14,
  borderRadius: 14,
  border: "1px solid #ddd",
};

const textarea = {
  minHeight: 140,
  padding: 16,
  borderRadius: 16,
  border: "1px solid #ddd",
  resize: "vertical" as const,
};

const saveBtn = {
  background:
    "linear-gradient(135deg,#b7791f,#8b5e14)",
  color: "white",
  border: "none",
  borderRadius: 14,
  padding: 16,
  fontWeight: 800,
  cursor: "pointer",
};

const actions = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 14,
};

const primaryBtn = {
  background: "#111",
  color: "white",
  padding: "14px 18px",
  borderRadius: 14,
  textDecoration: "none",
  textAlign: "center" as const,
  fontWeight: 700,
};

const secondaryBtn = {
  background: "#a16207",
  color: "white",
  padding: "14px 18px",
  borderRadius: 14,
  textDecoration: "none",
  textAlign: "center" as const,
  fontWeight: 700,
};