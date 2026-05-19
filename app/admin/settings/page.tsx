"use client";

import { useRouter } from "next/navigation";
import AdminBackButton from "@/components/admin/AdminBackButton";

export default function AdminSettingsPage() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });

      router.push("/admin/login");

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={container}>
      <AdminBackButton
        label="Retour dashboard"
        fallback="/admin"
      />

      {/* HERO */}
      <div style={hero}>
        <div>
          <p style={tag}>
            VANILLE’OR ADMIN
          </p>

          <h1 style={title}>
            ⚙️ Paramètres
          </h1>

          <p style={subtitle}>
            Configuration générale de la boutique,
            sécurité et environnement système.
          </p>
        </div>
      </div>

      {/* GRID */}

      <div style={grid}>
        {/* SHOP */}

        <div style={card}>
          <h2 style={cardTitle}>
            🏪 Boutique
          </h2>

          <div style={item}>
            <span>Nom boutique</span>
            <strong>Vanille’Or</strong>
          </div>

          <div style={item}>
            <span>Devise</span>
            <strong>EUR (€)</strong>
          </div>

          <div style={item}>
            <span>Mode</span>

            <strong style={{ color: "#16a34a" }}>
              Production
            </strong>
          </div>
        </div>

        {/* STRIPE */}

        <div style={card}>
          <h2 style={cardTitle}>
            💳 Paiement
          </h2>

          <div style={item}>
            <span>Stripe</span>

            <strong style={{ color: "#16a34a" }}>
              Connecté
            </strong>
          </div>

          <div style={item}>
            <span>Checkout</span>

            <strong>
              Actif
            </strong>
          </div>
        </div>

        {/* EMAIL */}

        <div style={card}>
          <h2 style={cardTitle}>
            📩 Emails
          </h2>

          <div style={item}>
            <span>Support SAV</span>

            <strong>
              Actif
            </strong>
          </div>

          <div style={item}>
            <span>Notifications</span>

            <strong>
              Activées
            </strong>
          </div>
        </div>

        {/* SYSTEM */}

        <div style={card}>
          <h2 style={cardTitle}>
            🛠 Système
          </h2>

          <div style={item}>
            <span>Next.js</span>

            <strong>
              14+
            </strong>
          </div>

          <div style={item}>
            <span>Prisma</span>

            <strong>
              Connecté
            </strong>
          </div>

          <div style={item}>
            <span>Base de données</span>

            <strong style={{ color: "#16a34a" }}>
              Online
            </strong>
          </div>
        </div>
      </div>

      {/* SECURITY */}

      <div style={actionsCard}>
        <h2 style={cardTitle}>
          🔐 Sécurité
        </h2>

        <p style={logoutText}>
          Déconnecter la session administrateur.
        </p>

        <button
          onClick={handleLogout}
          style={logoutBtn}
        >
          Déconnexion admin
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const container: React.CSSProperties = {
  padding: 30,
};

const hero: React.CSSProperties = {
  marginTop: 20,
  marginBottom: 30,
};

const tag: React.CSSProperties = {
  color: "#a16207",
  fontWeight: 800,
  letterSpacing: "0.08em",
  fontSize: 12,
  marginBottom: 10,
};

const title: React.CSSProperties = {
  fontSize: 36,
  margin: 0,
};

const subtitle: React.CSSProperties = {
  color: "#666",
  marginTop: 10,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(280px,1fr))",
  gap: 20,
};

const card: React.CSSProperties = {
  background: "white",
  padding: 24,
  borderRadius: 24,
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.05)",
};

const cardTitle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 20,
};

const item: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 0",
  borderBottom: "1px solid #f3f4f6",
};

const actionsCard: React.CSSProperties = {
  marginTop: 30,
  background: "white",
  padding: 24,
  borderRadius: 24,
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.05)",
};

const logoutText: React.CSSProperties = {
  color: "#666",
  marginBottom: 20,
};

const logoutBtn: React.CSSProperties = {
  background:
    "linear-gradient(135deg,#dc2626,#991b1b)",
  color: "white",
  border: "none",
  padding: "14px 20px",
  borderRadius: 14,
  fontWeight: 800,
  cursor: "pointer",
};