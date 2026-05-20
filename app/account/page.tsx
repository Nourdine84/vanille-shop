import Link from "next/link";
import { redirect } from "next/navigation";

import BackButton from "@/components/ui/BackButton";
import {
  getCurrentUser,
  clearUserSession,
} from "@/lib/auth";

import { prisma } from "@/lib/prisma";

export const dynamic =
  "force-dynamic";

/* =========================
   SERVER ACTION
========================= */

async function logoutAction() {
  "use server";

  clearUserSession();

  redirect("/login");
}

/* =========================
   PAGE
========================= */

export default async function AccountPage() {
  const user =
    await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  /* =========================
     KPI CLIENT
  ========================= */

  const orders =
    await prisma.order.findMany({
      where: {
        userId: user.id,
      },
    });

  const totalOrders =
    orders.length;

  const deliveredOrders =
    orders.filter(
      (o) =>
        o.status ===
        "DELIVERED"
    ).length;

  const totalSpent =
    orders.reduce(
      (acc, order) =>
        acc + order.totalCents,
      0
    );

  const lastOrder =
    orders.sort(
      (a, b) =>
        new Date(
          b.createdAt
        ).getTime() -
        new Date(
          a.createdAt
        ).getTime()
    )[0];

  return (
    <div style={page}>
      <div style={container}>
        {/* HERO */}

        <div style={hero}>
          <div style={heroOverlay} />

          <div style={heroContent}>
            <div style={badge}>
              Compte client premium
            </div>

            <BackButton
              label="Retour boutique"
              fallback="/products"
            />

            <h1 style={title}>
              Bonjour{" "}
              {user.name ||
                "Client"}{" "}
              👋
            </h1>

            <p style={subtitle}>
              Retrouvez vos commandes,
              factures et suivis
              directement depuis votre
              espace Vanille’Or.
            </p>

            {/* KPI */}

            <div style={heroStats}>
              <div style={heroCard}>
                <span
                  style={
                    heroCardLabel
                  }
                >
                  Commandes
                </span>

                <strong
                  style={
                    heroCardValue
                  }
                >
                  {totalOrders}
                </strong>
              </div>

              <div style={heroCard}>
                <span
                  style={
                    heroCardLabel
                  }
                >
                  Livrées
                </span>

                <strong
                  style={
                    heroCardValue
                  }
                >
                  {
                    deliveredOrders
                  }
                </strong>
              </div>

              <div style={heroCard}>
                <span
                  style={
                    heroCardLabel
                  }
                >
                  Total dépensé
                </span>

                <strong
                  style={
                    heroCardValue
                  }
                >
                  {(
                    totalSpent / 100
                  )
                    .toFixed(2)
                    .replace(
                      ".",
                      ","
                    )}{" "}
                  €
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* GRID */}

        <div style={grid}>
          {/* PROFILE */}

          <div style={card}>
            <div style={cardHeader}>
              <div>
                <p style={cardTag}>
                  Profil
                </p>

                <h2 style={cardTitle}>
                  Informations
                </h2>
              </div>

              <div
                style={
                  profileAvatar
                }
              >
                {(
                  user.name ||
                  user.email
                )
                  ?.charAt(0)
                  .toUpperCase()}
              </div>
            </div>

            <div style={infoGrid}>
              <div style={infoBox}>
                <span
                  style={
                    infoLabel
                  }
                >
                  Nom
                </span>

                <strong
                  style={
                    infoValue
                  }
                >
                  {user.name ||
                    "Non renseigné"}
                </strong>
              </div>

              <div style={infoBox}>
                <span
                  style={
                    infoLabel
                  }
                >
                  Email
                </span>

                <strong
                  style={
                    infoValue
                  }
                >
                  {user.email}
                </strong>
              </div>

              <div style={infoBox}>
                <span
                  style={
                    infoLabel
                  }
                >
                  Dernière commande
                </span>

                <strong
                  style={
                    infoValue
                  }
                >
                  {lastOrder
                    ? `#${lastOrder.id.slice(
                        0,
                        8
                      )}`
                    : "Aucune"}
                </strong>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}

          <div style={card}>
            <p style={cardTag}>
              Navigation
            </p>

            <h2 style={cardTitle}>
              Mon espace
            </h2>

            <div style={actions}>
              <Link
                href="/account/orders"
                style={primaryBtn}
              >
                📦 Mes commandes
              </Link>

              <Link
                href="/products"
                style={secondaryBtn}
              >
                🌿 Continuer mes achats
              </Link>

              <Link
                href="/support"
                style={ghostBtn}
              >
                🛟 Assistance
              </Link>

              {lastOrder && (
                <a
                  href={`/api/invoice/${lastOrder.id}`}
                  target="_blank"
                  style={invoiceBtn}
                >
                  📄 Dernière facture
                </a>
              )}

              {/* LOGOUT */}

              <form
                action={
                  logoutAction
                }
              >
                <button
                  type="submit"
                  style={
                    logoutBtn
                  }
                >
                  Déconnexion
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* TRUST */}

        <div style={trustSection}>
          <div style={trustCard}>
            <div style={trustIcon}>
              🔒
            </div>

            <h3 style={trustTitle}>
              Paiement sécurisé
            </h3>

            <p style={trustText}>
              Toutes vos transactions
              sont protégées via Stripe.
            </p>
          </div>

          <div style={trustCard}>
            <div style={trustIcon}>
              📦
            </div>

            <h3 style={trustTitle}>
              Suivi premium
            </h3>

            <p style={trustText}>
              Accédez facilement au
              suivi de vos commandes.
            </p>
          </div>

          <div style={trustCard}>
            <div style={trustIcon}>
              🌿
            </div>

            <h3 style={trustTitle}>
              Qualité Vanille’Or
            </h3>

            <p style={trustText}>
              Produits sélectionnés
              avec exigence et passion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */

const page: React.CSSProperties =
  {
    background: "#f8f5ef",
    minHeight: "100vh",
    padding: "50px 20px",
  };

const container: React.CSSProperties =
  {
    maxWidth: 1180,
    margin: "0 auto",
  };

const hero: React.CSSProperties =
  {
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(135deg,#050505,#2a2117)",
    borderRadius: 34,
    padding: "46px",
    marginBottom: 34,
  };

const heroOverlay: React.CSSProperties =
  {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top right, rgba(212,175,55,0.18), transparent 35%)",
  };

const heroContent: React.CSSProperties =
  {
    position: "relative",
    zIndex: 2,
    color: "white",
  };

const badge: React.CSSProperties =
  {
    display: "inline-block",
    background:
      "rgba(212,175,55,0.18)",
    border:
      "1px solid rgba(212,175,55,0.25)",
    color: "#f6d77d",
    padding: "8px 14px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 18,
    backdropFilter:
      "blur(6px)",
  };

const title: React.CSSProperties =
  {
    fontSize: 46,
    marginTop: 18,
    marginBottom: 10,
    fontWeight: 900,
  };

const subtitle: React.CSSProperties =
  {
    color: "#d6d0c8",
    marginTop: 10,
    fontSize: 16,
    lineHeight: 1.8,
    maxWidth: 700,
  };

const heroStats: React.CSSProperties =
  {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(180px,1fr))",
    gap: 16,
    marginTop: 34,
  };

const heroCard: React.CSSProperties =
  {
    background:
      "rgba(255,255,255,0.08)",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: 22,
    padding: "22px",
    backdropFilter:
      "blur(10px)",
  };

const heroCardLabel: React.CSSProperties =
  {
    display: "block",
    color: "#d6d0c8",
    fontSize: 12,
    marginBottom: 10,
  };

const heroCardValue: React.CSSProperties =
  {
    fontSize: 28,
    fontWeight: 900,
  };

const grid: React.CSSProperties =
  {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(340px,1fr))",
    gap: 24,
  };

const card: React.CSSProperties =
  {
    background: "white",
    borderRadius: 30,
    padding: 30,
    boxShadow:
      "0 12px 35px rgba(0,0,0,0.06)",
  };

const cardHeader: React.CSSProperties =
  {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "flex-start",
    gap: 20,
    marginBottom: 24,
  };

const cardTag: React.CSSProperties =
  {
    color: "#a16207",
    fontWeight: 700,
    textTransform:
      "uppercase",
    letterSpacing: "0.08em",
    fontSize: 12,
    marginBottom: 8,
  };

const cardTitle: React.CSSProperties =
  {
    margin: 0,
    fontSize: 28,
  };

const profileAvatar: React.CSSProperties =
  {
    width: 60,
    height: 60,
    borderRadius: 999,
    background:
      "linear-gradient(135deg,#b7791f,#8b5e14)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 24,
    flexShrink: 0,
  };

const infoGrid: React.CSSProperties =
  {
    display: "grid",
    gap: 18,
  };

const infoBox: React.CSSProperties =
  {
    background: "#faf7f2",
    borderRadius: 18,
    padding: 18,
  };

const infoLabel: React.CSSProperties =
  {
    display: "block",
    color: "#777",
    fontSize: 12,
    marginBottom: 8,
  };

const infoValue: React.CSSProperties =
  {
    fontSize: 16,
    fontWeight: 700,
    color: "#111",
  };

const actions: React.CSSProperties =
  {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    marginTop: 24,
  };

const primaryBtn: React.CSSProperties =
  {
    background:
      "linear-gradient(135deg,#b7791f,#8b5e14)",
    color: "white",
    textAlign: "center",
    padding: "15px 20px",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 700,
  };

const secondaryBtn: React.CSSProperties =
  {
    background: "#111",
    color: "white",
    textAlign: "center",
    padding: "15px 20px",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 700,
  };

const ghostBtn: React.CSSProperties =
  {
    background: "#f3f4f6",
    color: "#111",
    textAlign: "center",
    padding: "15px 20px",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 700,
  };

const invoiceBtn: React.CSSProperties =
  {
    background:
      "linear-gradient(135deg,#16a34a,#15803d)",
    color: "white",
    textAlign: "center",
    padding: "15px 20px",
    borderRadius: 16,
    textDecoration: "none",
    fontWeight: 700,
  };

const logoutBtn: React.CSSProperties =
  {
    width: "100%",
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "15px 20px",
    borderRadius: 16,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 15,
  };

const trustSection: React.CSSProperties =
  {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(240px,1fr))",
    gap: 20,
    marginTop: 30,
  };

const trustCard: React.CSSProperties =
  {
    background: "white",
    borderRadius: 26,
    padding: 28,
    textAlign: "center",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.05)",
  };

const trustIcon: React.CSSProperties =
  {
    fontSize: 42,
    marginBottom: 18,
  };

const trustTitle: React.CSSProperties =
  {
    fontSize: 20,
    marginBottom: 10,
  };

const trustText: React.CSSProperties =
  {
    color: "#666",
    lineHeight: 1.7,
  };