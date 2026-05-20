import { redirect } from "next/navigation";
import Link from "next/link";

import BackButton from "@/components/ui/BackButton";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type OrderItem = {
  name: string;
  quantity: number;
  priceCents: number;
  imageUrl?: string;
};

/* ================= HELPERS ================= */

function formatPrice(cents: number) {
  return (cents / 100)
    .toFixed(2)
    .replace(".", ",") + " €";
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
      return "Échec paiement";

    case "CANCELED":
      return "Commande annulée";

    default:
      return "En préparation";
  }
}

function getStatusStyle(
  status: string
): React.CSSProperties {
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
  if (!carrier || !tracking) {
    return null;
  }

  const cleanCarrier =
    carrier.toLowerCase();

  switch (cleanCarrier) {
    case "colissimo":
      return `https://www.laposte.fr/outils/suivre-vos-envois?code=${tracking}`;

    case "chronopost":
      return `https://www.chronopost.fr/tracking-no-cms/suivi-page?listeNumerosLT=${tracking}`;

    case "dhl":
      return `https://www.dhl.com/fr-fr/home/tracking/tracking-express.html?submit=1&tracking-id=${tracking}`;

    case "ups":
      return `https://www.ups.com/track?tracknum=${tracking}`;

    default:
      return null;
  }
}

function getTimelineProgress(
  status: string
) {
  switch (status) {
    case "PAID":
      return 35;

    case "SHIPPED":
      return 75;

    case "DELIVERED":
      return 100;

    case "FAILED":
      return 0;

    case "CANCELED":
      return 0;

    default:
      return 15;
  }
}

/* ================= PAGE ================= */

export default async function OrdersPage() {
  const user =
    await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const orders =
    await prisma.order.findMany({
      where: {
        userId: user.id,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

  const totalSpent = orders.reduce(
    (acc, order) =>
      acc + order.totalCents,
    0
  );

  const deliveredOrders =
    orders.filter(
      (o) =>
        o.status === "DELIVERED"
    ).length;

  return (
    <div style={page}>
      <div style={container}>
        <BackButton
          label="Retour au compte"
          fallback="/account"
        />

        {/* HERO */}

        <div style={hero}>
          <div>
            <p style={heroSubtitle}>
              Espace client Vanille’Or
            </p>

            <h1 style={title}>
              Mes commandes
            </h1>

            <p style={heroText}>
              Retrouvez l’historique,
              le suivi et les factures
              de vos commandes premium.
            </p>
          </div>

          <div style={heroStats}>
            <div style={heroStatCard}>
              <span style={heroStatLabel}>
                Commandes
              </span>

              <strong style={heroStatValue}>
                {orders.length}
              </strong>
            </div>

            <div style={heroStatCard}>
              <span style={heroStatLabel}>
                Livrées
              </span>

              <strong style={heroStatValue}>
                {deliveredOrders}
              </strong>
            </div>

            <div style={heroStatCard}>
              <span style={heroStatLabel}>
                Total dépensé
              </span>

              <strong style={heroStatValue}>
                {formatPrice(totalSpent)}
              </strong>
            </div>
          </div>
        </div>

        {/* EMPTY */}

        {orders.length === 0 ? (
          <div style={emptyBox}>
            <div style={emptyIcon}>
              📦
            </div>

            <h3 style={emptyTitle}>
              Aucune commande pour le
              moment
            </h3>

            <p style={emptyText}>
              Découvrez nos vanilles et
              épices premium de
              Madagascar.
            </p>

            <Link
              href="/products"
              style={emptyBtn}
            >
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <div style={ordersGrid}>
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
                  items =
                    order.items as OrderItem[];
                }
              } catch (e) {
                console.error(
                  "❌ ITEMS PARSE ERROR:",
                  e
                );
              }

              const trackingUrl =
                getTrackingUrl(
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
                      <div
                        style={orderId}
                      >
                        Commande #
                        {order.id.slice(
                          0,
                          8
                        )}
                      </div>

                      <div
                        style={date}
                      >
                        {new Date(
                          order.createdAt
                        ).toLocaleString(
                          "fr-FR"
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        ...status,
                        ...getStatusStyle(
                          order.status
                        ),
                      }}
                    >
                      {formatStatus(
                        order.status
                      )}
                    </div>
                  </div>

                  {/* ITEMS */}

                  <div
                    style={itemsBox}
                  >
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
                          <div
                            style={
                              itemLeft
                            }
                          >
                            <div
                              style={
                                itemImagePlaceholder
                              }
                            >
                              🌿
                            </div>

                            <div>
                              <div
                                style={
                                  itemName
                                }
                              >
                                {
                                  item.name
                                }
                              </div>

                              <div
                                style={
                                  itemQty
                                }
                              >
                                Quantité :{" "}
                                {
                                  item.quantity
                                }
                              </div>
                            </div>
                          </div>

                          <strong>
                            {formatPrice(
                              item.priceCents *
                                item.quantity
                            )}
                          </strong>
                        </div>
                      )
                    )}
                  </div>

                  {/* PROGRESS */}

                  <div
                    style={
                      progressWrapper
                    }
                  >
                    <div
                      style={
                        progressHeader
                      }
                    >
                      <span>
                        Progression
                      </span>

                      <strong>
                        {getTimelineProgress(
                          order.status
                        )}
                        %
                      </strong>
                    </div>

                    <div
                      style={
                        progressBar
                      }
                    >
                      <div
                        style={{
                          ...progressFill,

                          width: `${getTimelineProgress(
                            order.status
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* TIMELINE */}

                  <div
                    style={timeline}
                  >
                    <div
                      style={
                        timelineItem
                      }
                    >
                      ✅ Commande créée
                    </div>

                    {(order.status ===
                      "PAID" ||
                      order.status ===
                        "SHIPPED" ||
                      order.status ===
                        "DELIVERED") && (
                      <div
                        style={
                          timelineItem
                        }
                      >
                        💳 Paiement validé
                      </div>
                    )}

                    {(order.status ===
                      "SHIPPED" ||
                      order.status ===
                        "DELIVERED") && (
                      <div
                        style={
                          timelineItem
                        }
                      >
                        📦 Colis expédié
                      </div>
                    )}

                    {order.status ===
                      "DELIVERED" && (
                      <div
                        style={
                          timelineItem
                        }
                      >
                        🏠 Livraison
                        effectuée
                      </div>
                    )}
                  </div>

                  {/* TRACKING */}

                  {(order.trackingNumber ||
                    order.carrier) && (
                    <div
                      style={
                        trackingBox
                      }
                    >
                      <div
                        style={
                          trackingTop
                        }
                      >
                        <span
                          style={
                            trackingTitle
                          }
                        >
                          📦 Suivi colis
                        </span>

                        <span
                          style={
                            trackingCarrier
                          }
                        >
                          {order.carrier?.toUpperCase()}
                        </span>
                      </div>

                      <div
                        style={
                          trackingNumber
                        }
                      >
                        {
                          order.trackingNumber
                        }
                      </div>

                      {trackingUrl && (
                        <a
                          href={
                            trackingUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          style={
                            trackingBtn
                          }
                        >
                          Suivre le colis →
                        </a>
                      )}
                    </div>
                  )}

                  {/* ACTIONS */}

                  <div
                    style={actionRow}
                  >
                    <Link
                      href={`/account/orders/${order.id}`}
                      style={
                        detailsBtn
                      }
                    >
                      Voir détail
                    </Link>

                    <a
                      href={`/api/invoice/${order.id}`}
                      target="_blank"
                      style={
                        invoiceBtn
                      }
                    >
                      Télécharger facture
                    </a>

                    <Link
                      href="/support"
                      style={
                        supportBtn
                      }
                    >
                      Assistance
                    </Link>
                  </div>

                  {/* FOOTER */}

                  <div
                    style={footer}
                  >
                    <div>
                      <div
                        style={
                          footerLabel
                        }
                      >
                        Total payé
                      </div>

                      <div
                        style={
                          totalPrice
                        }
                      >
                        {formatPrice(
                          order.totalCents
                        )}
                      </div>
                    </div>

                    <div
                      style={
                        secureBadge
                      }
                    >
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

/* ================= STYLES ================= */

const page: React.CSSProperties = {
  background: "#f8f5ef",
  minHeight: "100vh",
  padding: "50px 20px",
};

const container: React.CSSProperties =
  {
    maxWidth: 1180,
    margin: "0 auto",
  };

const hero: React.CSSProperties = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "flex-start",
  marginBottom: 34,
  gap: 24,
  flexWrap: "wrap",
};

const heroSubtitle: React.CSSProperties =
  {
    color: "#a16207",
    fontWeight: 700,
    marginBottom: 10,
    textTransform:
      "uppercase",
    letterSpacing: "0.08em",
    fontSize: 12,
  };

const heroText: React.CSSProperties =
  {
    color: "#666",
    marginTop: 14,
    maxWidth: 520,
    lineHeight: 1.7,
  };

const heroStats: React.CSSProperties =
  {
    display: "flex",
    gap: 14,
    flexWrap: "wrap",
  };

const heroStatCard: React.CSSProperties =
  {
    background: "white",
    borderRadius: 18,
    padding: "18px 20px",
    minWidth: 150,
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.05)",
  };

const heroStatLabel: React.CSSProperties =
  {
    display: "block",
    color: "#777",
    fontSize: 12,
    marginBottom: 8,
  };

const heroStatValue: React.CSSProperties =
  {
    fontSize: 24,
    fontWeight: 800,
  };

const title: React.CSSProperties = {
  fontSize: 42,
  margin: 0,
  fontWeight: 800,
};

const emptyBox: React.CSSProperties =
  {
    background: "white",
    padding: 50,
    borderRadius: 28,
    textAlign: "center",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.05)",
  };

const emptyIcon: React.CSSProperties =
  {
    fontSize: 54,
    marginBottom: 18,
  };

const emptyTitle: React.CSSProperties =
  {
    marginBottom: 12,
    fontSize: 28,
  };

const emptyText: React.CSSProperties =
  {
    color: "#666",
    marginBottom: 24,
    lineHeight: 1.7,
  };

const emptyBtn: React.CSSProperties =
  {
    display: "inline-block",
    background:
      "linear-gradient(135deg,#b7791f,#8b5e14)",
    color: "white",
    padding: "14px 22px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 700,
  };

const ordersGrid: React.CSSProperties =
  {
    display: "grid",
    gap: 26,
  };

const card: React.CSSProperties = {
  background: "white",
  borderRadius: 28,
  padding: 30,
  boxShadow:
    "0 12px 35px rgba(0,0,0,0.06)",
};

const top: React.CSSProperties = {
  display: "flex",
  justifyContent:
    "space-between",
  gap: 20,
  marginBottom: 26,
  flexWrap: "wrap",
};

const orderId: React.CSSProperties =
  {
    fontWeight: 800,
    fontSize: 22,
  };

const date: React.CSSProperties = {
  color: "#777",
  marginTop: 8,
  fontSize: 14,
};

const status: React.CSSProperties =
  {
    padding: "10px 16px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 700,
    height: "fit-content",
  };

const itemsBox: React.CSSProperties =
  {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  };

const itemRow: React.CSSProperties =
  {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: 20,
    borderBottom:
      "1px solid #eee",
    paddingBottom: 14,
  };

const itemLeft: React.CSSProperties =
  {
    display: "flex",
    alignItems: "center",
    gap: 14,
  };

const itemImagePlaceholder: React.CSSProperties =
  {
    width: 54,
    height: 54,
    borderRadius: 14,
    background: "#faf7f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
  };

const itemName: React.CSSProperties =
  {
    fontWeight: 700,
    marginBottom: 4,
  };

const itemQty: React.CSSProperties =
  {
    color: "#777",
    fontSize: 13,
  };

const progressWrapper: React.CSSProperties =
  {
    marginTop: 26,
  };

const progressHeader: React.CSSProperties =
  {
    display: "flex",
    justifyContent:
      "space-between",
    marginBottom: 10,
    fontSize: 13,
    color: "#666",
  };

const progressBar: React.CSSProperties =
  {
    width: "100%",
    height: 12,
    background: "#ece7df",
    borderRadius: 999,
    overflow: "hidden",
  };

const progressFill: React.CSSProperties =
  {
    height: "100%",
    borderRadius: 999,
    background:
      "linear-gradient(90deg,#a16207,#d4af37)",
    transition: "0.4s",
  };

const timeline: React.CSSProperties =
  {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 22,
    marginBottom: 20,
  };

const timelineItem: React.CSSProperties =
  {
    background: "#faf7f2",
    padding: "10px 14px",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 600,
  };

const trackingBox: React.CSSProperties =
  {
    marginTop: 24,
    background: "#f9fafb",
    border: "1px solid #eee",
    borderRadius: 18,
    padding: 20,
  };

const trackingTop: React.CSSProperties =
  {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: 12,
  };

const trackingTitle: React.CSSProperties =
  {
    fontWeight: 700,
  };

const trackingCarrier: React.CSSProperties =
  {
    fontSize: 12,
    color: "#666",
    fontWeight: 700,
  };

const trackingNumber: React.CSSProperties =
  {
    fontWeight: 800,
    marginBottom: 16,
    fontSize: 15,
  };

const trackingBtn: React.CSSProperties =
  {
    display: "inline-block",
    background: "#111",
    color: "white",
    padding: "12px 16px",
    borderRadius: 12,
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 14,
  };

const actionRow: React.CSSProperties =
  {
    display: "flex",
    gap: 12,
    marginTop: 26,
    flexWrap: "wrap",
  };

const detailsBtn: React.CSSProperties =
  {
    flex: 1,
    background: "#111",
    color: "white",
    padding: "13px 18px",
    borderRadius: 14,
    textDecoration: "none",
    textAlign: "center",
    fontWeight: 700,
  };

const invoiceBtn: React.CSSProperties =
  {
    flex: 1,
    background:
      "linear-gradient(135deg,#16a34a,#15803d)",
    color: "white",
    padding: "13px 18px",
    borderRadius: 14,
    textDecoration: "none",
    textAlign: "center",
    fontWeight: 700,
  };

const supportBtn: React.CSSProperties =
  {
    flex: 1,
    background: "#f3f4f6",
    color: "#111",
    padding: "13px 18px",
    borderRadius: 14,
    textDecoration: "none",
    textAlign: "center",
    fontWeight: 700,
  };

const footer: React.CSSProperties = {
  marginTop: 30,
  paddingTop: 22,
  borderTop: "1px solid #eee",
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  gap: 20,
  flexWrap: "wrap",
};

const footerLabel: React.CSSProperties =
  {
    fontSize: 13,
    color: "#777",
    marginBottom: 6,
  };

const totalPrice: React.CSSProperties =
  {
    fontSize: 26,
    fontWeight: 800,
  };

const secureBadge: React.CSSProperties =
  {
    background: "#f3f4f6",
    padding: "10px 14px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 700,
  };