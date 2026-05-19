import Link from "next/link";
import { redirect } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import { getCurrentUser, clearUserSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/* =========================
   SERVER ACTION
========================= */

async function logoutAction() {
  "use server";

  clearUserSession();

  redirect("/login");
}

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div style={page}>
      <div style={container}>

        {/* HERO */}
        <div style={hero}>
          <div>
            <div style={badge}>
              Compte client
            </div>

            <BackButton
              label="Retour à la boutique"
              fallback="/products"
            />

            <h1 style={title}>
              Bonjour {user.name || "Client"} 👋
            </h1>

            <p style={subtitle}>
              Gérez vos commandes et votre espace personnel Vanille’Or.
            </p>
          </div>
        </div>

        {/* GRID */}
        <div style={grid}>

          {/* INFOS */}
          <div style={card}>
            <h2 style={cardTitle}>
              Informations
            </h2>

            <div style={infoRow}>
              <span style={label}>Nom</span>

              <span style={value}>
                {user.name || "Non renseigné"}
              </span>
            </div>

            <div style={infoRow}>
              <span style={label}>Email</span>

              <span style={value}>
                {user.email}
              </span>
            </div>
          </div>

          {/* ACTIONS */}
          <div style={card}>
            <h2 style={cardTitle}>
              Mon espace
            </h2>

            <div style={actions}>

              <Link
                href="/account/orders"
                style={primaryBtn}
              >
                Voir mes commandes
              </Link>

              <Link
                href="/products"
                style={secondaryBtn}
              >
                Continuer mes achats
              </Link>

              {/* LOGOUT */}
              <form action={logoutAction}>
                <button
                  type="submit"
                  style={logoutBtn}
                >
                  Déconnexion
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */

const page: React.CSSProperties = {
  background: "#f8f5ef",
  minHeight: "100vh",
  padding: "50px 20px",
};

const container: React.CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
};

const hero: React.CSSProperties = {
  background: "linear-gradient(135deg,#050505,#2a2117)",
  borderRadius: 28,
  padding: "42px",
  color: "white",
  marginBottom: 30,
};

const badge: React.CSSProperties = {
  display: "inline-block",
  background: "#a16207",
  padding: "8px 14px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 16,
};

const title: React.CSSProperties = {
  fontSize: 42,
  margin: 0,
  fontWeight: 800,
};

const subtitle: React.CSSProperties = {
  color: "#d6d0c8",
  marginTop: 10,
  fontSize: 16,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
  gap: 24,
};

const card: React.CSSProperties = {
  background: "white",
  borderRadius: 24,
  padding: 28,
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
};

const cardTitle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 24,
  fontSize: 24,
};

const infoRow: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  marginBottom: 18,
};

const label: React.CSSProperties = {
  fontSize: 13,
  color: "#777",
  marginBottom: 4,
};

const value: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 700,
  color: "#111",
};

const actions: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const primaryBtn: React.CSSProperties = {
  background: "#a16207",
  color: "white",
  textAlign: "center",
  padding: "14px 20px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 700,
};

const secondaryBtn: React.CSSProperties = {
  background: "#f3f4f6",
  color: "#111",
  textAlign: "center",
  padding: "14px 20px",
  borderRadius: 14,
  textDecoration: "none",
  fontWeight: 700,
};

const logoutBtn: React.CSSProperties = {
  width: "100%",
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "14px 20px",
  borderRadius: 14,
  cursor: "pointer",
  fontWeight: 700,
};