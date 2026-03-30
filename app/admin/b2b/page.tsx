import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Status = "NEW" | "CONTACTED" | "CLOSED";

type B2BRequest = {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  quantity: string;
  message?: string | null;
  status: Status;
  createdAt: Date;
};

export default async function AdminB2BPage({
  searchParams,
}: {
  searchParams?: {
    status?: string;
    q?: string;
  };
}) {
  const isAdmin = cookies().get("admin");

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const statusFilter = searchParams?.status || "";
  const query = searchParams?.q || "";

  const requests: B2BRequest[] = await prisma.b2BRequest.findMany({
    where: {
      ...(statusFilter ? { status: statusFilter as Status } : {}),
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

  const total = requests.length;
  const newCount = requests.filter((r) => r.status === "NEW").length;
  const contacted = requests.filter((r) => r.status === "CONTACTED").length;
  const closed = requests.filter((r) => r.status === "CLOSED").length;

  return (
    <div style={container}>
      <h1 style={title}>📦 CRM B2B</h1>

      {/* FILTRES */}
      <form method="GET" style={filterBar}>
        <input
          name="q"
          placeholder="Rechercher email..."
          defaultValue={query}
          style={input}
        />

        <select name="status" defaultValue={statusFilter} style={select}>
          <option value="">Tous</option>
          <option value="NEW">NEW</option>
          <option value="CONTACTED">CONTACTED</option>
          <option value="CLOSED">CLOSED</option>
        </select>

        <button style={btnSecondary}>Filtrer</button>
      </form>

      {/* KPI */}
      <div style={kpiGrid}>
        <KPI title="Total" value={total} />
        <KPI title="Nouveaux" value={newCount} color="#f59e0b" />
        <KPI title="Contactés" value={contacted} color="#2563eb" />
        <KPI title="Clôturés" value={closed} color="#16a34a" />
      </div>

      {requests.length === 0 ? (
        <div style={empty}>Aucune demande</div>
      ) : (
        <div style={grid}>
          {requests.map((r) => {
            const score = getLeadScore(r);
            const level = getLeadLevel(score);

            return (
              <div
                key={r.id}
                style={{
                  ...card,
                  borderLeft:
                    r.status === "NEW"
                      ? "4px solid #f59e0b"
                      : r.status === "CONTACTED"
                      ? "4px solid #2563eb"
                      : "4px solid #16a34a",
                }}
              >
                <div style={header}>
                  <strong>{r.name}</strong>
                  <span style={badge(r.status)}>
                    {formatStatus(r.status)}
                  </span>
                </div>

                <p style={email}>{r.email}</p>

                {r.company && <p>🏢 {r.company}</p>}

                <p>📦 {r.quantity}</p>

                {/* LEAD */}
                <p>
                  🔥 Lead :
                  <span style={leadBadge(level)}>{level}</span>
                </p>

                <p style={date}>
                  {new Date(r.createdAt).toLocaleString("fr-FR")}
                </p>

                {r.message && (
                  <div style={messageBox}>{r.message}</div>
                )}

                {/* ACTIONS */}
                <div style={actions}>
                  {/* EMAIL */}
                  <a href={`mailto:${r.email}`} style={btnPrimary}>
                    Répondre
                  </a>

                  {/* 🔥 DEVIS AUTO */}
                  <a
                    href={`/api/b2b/generate-devis?name=${encodeURIComponent(
                      r.name
                    )}&email=${encodeURIComponent(
                      r.email
                    )}&quantity=${encodeURIComponent(
                      r.quantity
                    )}&company=${encodeURIComponent(r.company || "")}`}
                    target="_blank"
                    style={btnSecondary}
                  >
                    📄 Devis
                  </a>

                  {/* STATUS */}
                  <form
                    action="/api/admin/b2b/update-status"
                    method="POST"
                    style={{ display: "flex", gap: "5px" }}
                  >
                    <input type="hidden" name="id" value={r.id} />

                    <select
                      name="status"
                      defaultValue={r.status}
                      style={select}
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>

                    <button style={btnSecondary}>OK</button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* =======================
   LOGIC
======================= */

function getLeadScore(r: B2BRequest) {
  let score = 0;

  if (r.quantity.includes("10")) score += 1;
  if (r.quantity.includes("25")) score += 2;
  if (r.quantity.includes("50")) score += 3;
  if (r.quantity.includes("100")) score += 5;

  if (r.message && r.message.length > 10) score += 2;
  if (r.company) score += 2;

  return score;
}

function getLeadLevel(score: number) {
  if (score >= 6) return "HOT";
  if (score >= 3) return "WARM";
  return "COLD";
}

function formatStatus(status: Status) {
  if (status === "NEW") return "Nouveau";
  if (status === "CONTACTED") return "Contacté";
  return "Clôturé";
}

function KPI({ title, value, color }: any) {
  return (
    <div
      style={{
        background: "white",
        padding: "15px",
        borderRadius: "12px",
        borderLeft: `4px solid ${color || "#a16207"}`,
      }}
    >
      <div style={{ fontSize: "12px", color: "#777" }}>{title}</div>
      <div style={{ fontSize: "20px", fontWeight: 700 }}>{value}</div>
    </div>
  );
}

/* STYLES */

const container = {
  padding: "40px",
  background: "#faf7f2",
  minHeight: "100vh",
};

const title = {
  fontSize: "28px",
  marginBottom: "20px",
};

const filterBar = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
};

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: "15px",
  marginBottom: "25px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "20px",
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
};

const email = {
  fontSize: "14px",
  color: "#555",
};

const date = {
  fontSize: "12px",
  color: "#999",
};

const messageBox = {
  marginTop: "10px",
  padding: "10px",
  background: "#f3f4f6",
  borderRadius: "10px",
};

const actions = {
  display: "flex",
  gap: "10px",
  marginTop: "15px",
  flexWrap: "wrap" as const,
};

const btnPrimary = {
  flex: 1,
  background: "#a16207",
  color: "white",
  padding: "10px",
  borderRadius: "10px",
  textAlign: "center" as const,
  textDecoration: "none",
};

const btnSecondary = {
  background: "#333",
  color: "white",
  border: "none",
  padding: "10px",
  borderRadius: "10px",
  cursor: "pointer",
  textDecoration: "none",
};

const select = {
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ddd",
};

const input = {
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ddd",
};

const empty = {
  background: "white",
  padding: "30px",
  borderRadius: "12px",
  textAlign: "center" as const,
};

const badge = (status: Status) => ({
  padding: "6px 10px",
  borderRadius: "999px",
  color: "white",
  fontSize: "12px",
  background:
    status === "NEW"
      ? "#f59e0b"
      : status === "CONTACTED"
      ? "#2563eb"
      : "#16a34a",
});

const leadBadge = (level: string) => ({
  marginLeft: "8px",
  padding: "4px 8px",
  borderRadius: "6px",
  color: "white",
  fontSize: "12px",
  background:
    level === "HOT"
      ? "#dc2626"
      : level === "WARM"
      ? "#f59e0b"
      : "#6b7280",
});