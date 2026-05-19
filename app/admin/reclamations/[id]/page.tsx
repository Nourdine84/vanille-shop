import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminBackButton from "@/components/admin/AdminBackButton";

type Props = {
  params: {
    id: string;
  };
};

export default async function ReclamationDetailPage({
  params,
}: Props) {
  const isAdmin =
    cookies().get("admin");

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
    return (
      <div style={container}>
        Réclamation introuvable.
      </div>
    );
  }

  return (
    <div style={container}>
      <AdminBackButton
        label="Retour réclamations"
        fallback="/admin/reclamations"
      />

      <br />
      <br />

      <div style={hero}>
        <div>
          <p style={tag}>
            SUPPORT TICKET
          </p>

          <h1 style={title}>
            {reclamation.subject}
          </h1>

          <p style={subtitle}>
            Ticket SAV premium
          </p>
        </div>

        <div
          style={priorityBadge(
            reclamation.priority
          )}
        >
          {reclamation.priority}
        </div>
      </div>

      <div style={layout}>
        {/* LEFT */}

        <div style={left}>
          <div style={card}>
            <h2 style={sectionTitle}>
              👤 Client
            </h2>

            <p>
              <strong>Nom :</strong>{" "}
              {reclamation.name}
            </p>

            <p>
              <strong>Email :</strong>{" "}
              {reclamation.email}
            </p>

            {reclamation.orderId && (
              <p>
                <strong>
                  Commande :
                </strong>{" "}
                {
                  reclamation.orderId
                }
              </p>
            )}

            <p>
              <strong>Date :</strong>{" "}
              {new Date(
                reclamation.createdAt
              ).toLocaleString(
                "fr-FR"
              )}
            </p>
          </div>

          <div style={card}>
            <h2 style={sectionTitle}>
              💬 Message client
            </h2>

            <div style={messageBox}>
              {reclamation.message}
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div style={right}>
          <div style={card}>
            <h2 style={sectionTitle}>
              ⚙️ Gestion ticket
            </h2>

            <div
              style={statusBadge(
                reclamation.status
              )}
            >
              {
                reclamation.status
              }
            </div>

            <br />
            <br />

            <form
              action="/api/admin/reclamations/update-status"
              method="POST"
            >
              <input
                type="hidden"
                name="id"
                value={reclamation.id}
              />

              <select
                name="status"
                defaultValue={
                  reclamation.status
                }
                style={select}
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

              <button style={btn}>
                Sauvegarder
              </button>
            </form>
          </div>

          <div style={card}>
            <h2 style={sectionTitle}>
              📩 Actions
            </h2>

            <a
              href={`mailto:${reclamation.email}`}
              style={actionBtn}
            >
              Répondre au client
            </a>
          </div>
        </div>
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
  fontSize: "38px",
  margin: 0,
};

const subtitle = {
  color: "#666",
};

const layout = {
  display: "grid",
  gridTemplateColumns:
    "2fr 1fr",
  gap: "25px",
};

const left = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "20px",
};

const right = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "20px",
};

const card = {
  background: "white",
  borderRadius: "24px",
  padding: "24px",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.05)",
};

const sectionTitle = {
  marginTop: 0,
};

const messageBox = {
  background: "#f3f4f6",
  padding: "18px",
  borderRadius: "16px",
  lineHeight: 1.8,
};

const select = {
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #ddd",
  marginBottom: "15px",
};

const btn = {
  width: "100%",
  background:
    "linear-gradient(135deg,#b7791f,#8b5e14)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  padding: "14px",
  fontWeight: 800,
};

const actionBtn = {
  display: "block",
  background: "#111",
  color: "white",
  textAlign: "center" as const,
  padding: "14px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: 700,
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
  padding: "10px 14px",
  borderRadius: "999px",
  fontWeight: 800,
});

const statusBadge = (
  status: string
) => ({
  display: "inline-block",
  background:
    status === "NEW"
      ? "#f59e0b"
      : status ===
        "IN_PROGRESS"
      ? "#2563eb"
      : status ===
        "RESOLVED"
      ? "#16a34a"
      : "#111",

  color: "white",
  padding: "8px 12px",
  borderRadius: "999px",
  fontWeight: 700,
});