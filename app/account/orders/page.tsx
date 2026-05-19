import { redirect } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import AdminBackButton from "@/components/admin/AdminBackButton";

export const dynamic = "force-dynamic";

type OrderItem = {
  name: string;
  quantity: number;
  priceCents: number;
};

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

function formatStatus(status: string) {
  switch (status) {
    case "PAID":
      return "Paiement confirmé";

    case "SHIPPED":
      return "Commande expédiée";

    case "DELIVERED":
      return "Livrée";

    case "FAILED":
      return "Échec";

    case "CANCELED":
      return "Annulée";

    default:
      return "En attente";
  }
}

function getStatusStyle(status: string): React.CSSProperties {
  switch (status) {
    case "PAID":
      return {
        background: "#dcfce7",
        color: "#166534",
      };

    case "SHIPPED":
      return {
        background: "#dbeafe",
        color: "#1d4ed8",
      };

    case "DELIVERED":
      return {
        background: "#ede9fe",
        color: "#6d28d9",
      };

    case "FAILED":
      return {
        background: "#fee2e2",
        color: "#b91c1c",
      };

    case "CANCELED":
      return {
        background: "#f3f4f6",
        color: "#4b5563",
      };

    default:
      return {
        background: "#fef3c7",
        color: "#92400e",
      };
  }
}

function getTrackingUrl(
  carrier?: string | null,
  tracking?: string | null
) {
  if (!carrier || !tracking) return null;

  const cleanCarrier = carrier.toLowerCase();

  switch (cleanCarrier) {
    case "colissimo":
      return `https://www.laposte.fr/outils/suivre-vos-envois?code=${tracking}`;

    case "chronopost":
      return `https://www.chronopost.fr/tracking-no-cms/suivi-page?listeNumerosLT=${tracking}`;

    case "dhl":
      return `https://www.dhl.com/fr-fr/home/tracking/tracking-express.html?submit=1&tracking-id=${tracking}`;

    default:
      return null;
  }
}

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: user.id,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div style={page}>
      <div style={container}>
        <BackButton
          label="Retour au compte"
          fallback="/account"
        />

        <div style={hero}>
          <div>
            <p style={heroSubtitle}>
              Espace client Vanille’Or
            </p>

            <AdminBackButton
              label="Retour produits"
              fallback="/admin/products"
            />

            <br />
            <br />


            <h1 style={title}>
              Créer un produit</h1>

            <h1 style={title}>
              Mes commandes
            </h1>
          </div>

          <div style={heroBadge}>
            {orders.length} commande
            {orders.length > 1 ? "s" : ""}
          </div>
        </div>

        {orders.length === 0 ? (
          <div style={emptyBox}>
            <h3 style={emptyTitle}>
              Aucune commande pour le moment
            </h3>

            <p style={emptyText}>
              Vos futures commandes Vanille’Or
              apparaîtront ici.
            </p>
          </div>
        ) : (
          <div style={ordersGrid}>
            {orders.map((order) => {
              const items = Array.isArray(order.items)
                ? (order.items as OrderItem[])
                : [];

              const trackingUrl = getTrackingUrl(
                order.carrier,
                order.trackingNumber
              );

              return (
                <div
                  key={order.id}
                  style={card}
                >
                  {/* HEADER */}
                  <div style={top}>
                    <div>
                      <div style={orderId}>
                        Commande #
                        {order.id.slice(0, 8)}
                      </div>

                      <div style={date}>
                        {new Date(
                          order.createdAt
                        ).toLocaleString("fr-FR")}
                      </div>
                    </div>

                    <div
                      style={{
                        ...status,
                        ...getStatusStyle(order.status),
                      }}
                    >
                      {formatStatus(order.status)}
                    </div>
                  </div>

                  {/* ITEMS */}
                  <div style={itemsBox}>
                    {items.map((item, index) => (
                      <div
                        key={index}
                        style={itemRow}
                      >
                        <div>
                          <div style={itemName}>
                            {item.name}
                          </div>

                          <div style={itemQty}>
                            Quantité :{" "}
                            {item.quantity}
                          </div>
                        </div>

                        <strong>
                          {formatPrice(
                            item.priceCents *
                              item.quantity
                          )}
                        </strong>
                      </div>
                    ))}
                  </div>

                  {/* TIMELINE */}
                  <div style={timeline}>
                    <div style={timelineItem}>
                      ✅ Commande créée
                    </div>

                    {(order.status === "PAID" ||
                      order.status === "SHIPPED" ||
                      order.status === "DELIVERED") && (
                      <div style={timelineItem}>
                        💳 Paiement validé
                      </div>
                    )}

                    {(order.status === "SHIPPED" ||
                      order.status === "DELIVERED") && (
                      <div style={timelineItem}>
                        📦 Colis expédié
                      </div>
                    )}

                    {order.status === "DELIVERED" && (
                      <div style={timelineItem}>
                        🏠 Livraison effectuée
                      </div>
                    )}
                  </div>

                  {/* TRACKING */}
                  {(order.trackingNumber ||
                    order.carrier) && (
                    <div style={trackingBox}>
                      <div style={trackingTop}>
                        <span style={trackingTitle}>
                          📦 Suivi colis
                        </span>

                        <span style={trackingCarrier}>
                          {order.carrier?.toUpperCase()}
                        </span>
                      </div>

                      <div style={trackingNumber}>
                        {order.trackingNumber}
                      </div>

                      {trackingUrl && (
                        <a
                          href={trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={trackingBtn}
                        >
                          Suivre le colis →
                        </a>
                      )}
                    </div>
                  )}

                  {/* FOOTER */}
                  <div style={footer}>
                    <div>
                      <div style={footerLabel}>
                        Total payé
                      </div>

                      <div style={totalPrice}>
                        {formatPrice(
                          order.totalCents
                        )}
                      </div>
                    </div>

                    <div style={secureBadge}>
                      Paiement sécurisé
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 30,
  gap: 20,
  flexWrap: "wrap",
};

const heroSubtitle: React.CSSProperties = {
  color: "#a16207",
  fontWeight: 700,
  marginBottom: 10,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: 12,
};

const heroBadge: React.CSSProperties = {
  background: "white",
  padding: "12px 18px",
  borderRadius: 999,
  fontWeight: 700,
  boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
};

const title: React.CSSProperties = {
  fontSize: 42,
  margin: 0,
  fontWeight: 800,
};

const emptyBox: React.CSSProperties = {
  background: "white",
  padding: 40,
  borderRadius: 24,
  textAlign: "center",
};

const emptyTitle: React.CSSProperties = {
  marginBottom: 10,
};

const emptyText: React.CSSProperties = {
  color: "#666",
};

const ordersGrid: React.CSSProperties = {
  display: "grid",
  gap: 24,
};

const card: React.CSSProperties = {
  background: "white",
  borderRadius: 24,
  padding: 28,
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
};

const top: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 20,
  marginBottom: 24,
  flexWrap: "wrap",
};

const orderId: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 20,
};

const date: React.CSSProperties = {
  color: "#777",
  marginTop: 6,
  fontSize: 14,
};

const status: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 700,
  height: "fit-content",
};

const itemsBox: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
};

const itemRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 20,
  borderBottom: "1px solid #eee",
  paddingBottom: 14,
};

const itemName: React.CSSProperties = {
  fontWeight: 700,
  marginBottom: 4,
};

const itemQty: React.CSSProperties = {
  color: "#777",
  fontSize: 13,
};

const timeline: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  marginTop: 20,
  marginBottom: 20,
};

const timelineItem: React.CSSProperties = {
  background: "#faf7f2",
  padding: "10px 14px",
  borderRadius: 12,
  fontSize: 13,
  fontWeight: 600,
};

const trackingBox: React.CSSProperties = {
  marginTop: 24,
  background: "#f9fafb",
  border: "1px solid #eee",
  borderRadius: 18,
  padding: 18,
};

const trackingTop: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
};

const trackingTitle: React.CSSProperties = {
  fontWeight: 700,
};

const trackingCarrier: React.CSSProperties = {
  fontSize: 12,
  color: "#666",
  fontWeight: 700,
};

const trackingNumber: React.CSSProperties = {
  fontWeight: 800,
  marginBottom: 16,
  fontSize: 15,
};

const trackingBtn: React.CSSProperties = {
  display: "inline-block",
  background: "#111",
  color: "white",
  padding: "12px 16px",
  borderRadius: 12,
  textDecoration: "none",
  fontWeight: 700,
  fontSize: 14,
};

const footer: React.CSSProperties = {
  marginTop: 28,
  paddingTop: 20,
  borderTop: "1px solid #eee",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 20,
  flexWrap: "wrap",
};

const footerLabel: React.CSSProperties = {
  fontSize: 13,
  color: "#777",
  marginBottom: 4,
};

const totalPrice: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 800,
};

const secureBadge: React.CSSProperties = {
  background: "#f3f4f6",
  padding: "10px 14px",
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 700,
};