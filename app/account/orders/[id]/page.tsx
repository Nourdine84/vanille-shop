import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import BackButton from "@/components/ui/BackButton";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type OrderItem = {
  id?: string;
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
      return "Échec";

    case "CANCELED":
      return "Annulée";

    default:
      return "En attente";
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

function getTimeline(status: string) {
  return [
    {
      label: "Commande créée",
      done: true,
    },

    {
      label: "Paiement validé",
      done: [
        "PAID",
        "SHIPPED",
        "DELIVERED",
      ].includes(status),
    },

    {
      label: "Commande expédiée",
      done: [
        "SHIPPED",
        "DELIVERED",
      ].includes(status),
    },

    {
      label: "Commande livrée",
      done:
        status === "DELIVERED",
    },
  ];
}

/* ================= PAGE ================= */

export default async function OrderDetailPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const user =
    await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const order =
    await prisma.order.findUnique({
      where: {
        id: params.id,
      },
    });

  if (!order) {
    return notFound();
  }

  if (order.userId !== user.id) {
    redirect("/account/orders");
  }

  let items: OrderItem[] = [];

  try {
    if (
      typeof order.items ===
      "string"
    ) {
      items = JSON.parse(
        order.items
      );
    } else if (
      Array.isArray(order.items)
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

  const timeline =
    getTimeline(order.status);

  return (
    <div style={page}>
      <div style={container}>
        <BackButton
          label="Retour commandes"
          fallback="/account/orders"
        />

        {/* HERO */}

        <div style={hero}>
          <div>
            <p style={heroSubtitle}>
              Détail commande
              Vanille’Or
            </p>

            <h1 style={title}>
              Commande #
              {order.id.slice(0, 8)}
            </h1>

            <p style={date}>
              {new Date(
                order.createdAt
              ).toLocaleString(
                "fr-FR"
              )}
            </p>
          </div>

          <div
            style={{
              ...statusBadge,
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

        {/* KPI */}

        <div style={kpiGrid}>
          <div style={kpiCard}>
            <p style={kpiLabel}>
              💰 Total
            </p>

            <h3 style={kpiValue}>
              {formatPrice(
                order.totalCents
              )}
            </h3>
          </div>

          <div style={kpiCard}>
            <p style={kpiLabel}>
              📦 Articles
            </p>

            <h3 style={kpiValue}>
              {items.length}
            </h3>
          </div>

          <div style={kpiCard}>
            <p style={kpiLabel}>
              🚚 Livraison
            </p>

            <h3 style={kpiValue}>
              {order.carrier
                ? order.carrier.toUpperCase()
                : "En attente"}
            </h3>
          </div>
        </div>

        {/* GRID */}

        <div style={mainGrid}>
          {/* LEFT */}

          <div>
            {/* PRODUCTS */}

            <div style={card}>
              <h2 style={sectionTitle}>
                📦 Produits
              </h2>

              <div style={productsList}>
                {items.length ===
                0 ? (
                  <div
                    style={
                      emptyProducts
                    }
                  >
                    Aucun produit
                    trouvé.
                  </div>
                ) : (
                  items.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={index}
                        style={
                          productCard
                        }
                      >
                        <div
                          style={
                            productLeft
                          }
                        >
                          <img
                            src={
                              item.imageUrl ||
                              "/images/default.jpg"
                            }
                            alt={
                              item.name
                            }
                            style={
                              productImage
                            }
                          />

                          <div>
                            <h3
                              style={
                                productName
                              }
                            >
                              {
                                item.name
                              }
                            </h3>

                            <p
                              style={
                                productQty
                              }
                            >
                              Quantité :{" "}
                              {
                                item.quantity
                              }
                            </p>
                          </div>
                        </div>

                        <strong
                          style={
                            productPrice
                          }
                        >
                          {formatPrice(
                            item.priceCents *
                              item.quantity
                          )}
                        </strong>
                      </div>
                    )
                  )
                )}
              </div>
            </div>

            {/* TIMELINE */}

            <div style={card}>
              <h2 style={sectionTitle}>
                🚀 Suivi commande
              </h2>

              <div
                style={
                  timelineWrapper
                }
              >
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

            {/* TRACKING */}

            {(order.trackingNumber ||
              order.carrier) && (
              <div style={card}>
                <h2
                  style={
                    sectionTitle
                  }
                >
                  📦 Livraison
                </h2>

                <div
                  style={
                    trackingBox
                  }
                >
                  <div
                    style={
                      trackingRow
                    }
                  >
                    <span
                      style={
                        trackingLabel
                      }
                    >
                      Transporteur
                    </span>

                    <strong>
                      {order.carrier?.toUpperCase()}
                    </strong>
                  </div>

                  <div
                    style={
                      trackingRow
                    }
                  >
                    <span
                      style={
                        trackingLabel
                      }
                    >
                      Tracking
                    </span>

                    <strong>
                      {
                        order.trackingNumber
                      }
                    </strong>
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
                      Suivre mon
                      colis →
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}

          <div>
            {/* SUMMARY */}

            <div style={card}>
              <h2 style={sectionTitle}>
                💳 Résumé
              </h2>

              <div
                style={
                  summaryRow
                }
              >
                <span>
                  Sous-total
                </span>

                <strong>
                  {formatPrice(
                    order.totalCents
                  )}
                </strong>
              </div>

              <div
                style={
                  summaryRow
                }
              >
                <span>
                  Livraison
                </span>

                <strong>
                  Incluse
                </strong>
              </div>

              <div style={totalRow}>
                <span>Total</span>

                <strong>
                  {formatPrice(
                    order.totalCents
                  )}
                </strong>
              </div>
            </div>

            {/* FACTURE */}

            <div style={card}>
              <h2 style={sectionTitle}>
                🧾 Facture
              </h2>

              <p style={supportText}>
                Téléchargez votre
                facture officielle
                Vanille’Or au format
                PDF.
              </p>

              <a
                href={`/api/invoice/${order.id}`}
                target="_blank"
                style={invoiceBtn}
              >
                Télécharger la
                facture
              </a>
            </div>

            {/* PAYMENT */}

            <div style={card}>
              <h2 style={sectionTitle}>
                🔒 Paiement
              </h2>

              <div style={paymentBox}>
                <p style={paymentText}>
                  Paiement sécurisé
                  via Stripe
                </p>

                <div
                  style={
                    secureBadge
                  }
                >
                  Transaction
                  protégée
                </div>
              </div>
            </div>

            {/* SUPPORT */}

            <div style={card}>
              <h2 style={sectionTitle}>
                🛟 Assistance
              </h2>

              <p style={supportText}>
                Besoin d’aide
                concernant votre
                commande ?
              </p>

              <Link
                href={`/support?orderId=${order.id}`}
                style={supportBtn}
              >
                Contacter le
                support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page: React.CSSProperties =
  {
    background: "#f8f5ef",
    minHeight: "100vh",
    padding: "50px 20px",
  };

const container: React.CSSProperties =
  {
    maxWidth: 1200,
    margin: "0 auto",
  };

const hero: React.CSSProperties =
  {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
    gap: 20,
    flexWrap: "wrap",
  };

const heroSubtitle: React.CSSProperties =
  {
    color: "#a16207",
    fontWeight: 700,
    textTransform:
      "uppercase",
    letterSpacing: "0.08em",
    fontSize: 12,
    marginBottom: 10,
  };

const title: React.CSSProperties =
  {
    fontSize: 42,
    margin: 0,
    fontWeight: 800,
  };

const date: React.CSSProperties =
  {
    color: "#666",
    marginTop: 10,
  };

const statusBadge: React.CSSProperties =
  {
    padding: "12px 18px",
    borderRadius: 999,
    fontWeight: 800,
    fontSize: 14,
  };

const kpiGrid: React.CSSProperties =
  {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",
    gap: 20,
    marginBottom: 24,
  };

const kpiCard: React.CSSProperties =
  {
    background: "white",
    borderRadius: 22,
    padding: 24,
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.05)",
  };

const kpiLabel: React.CSSProperties =
  {
    color: "#777",
    marginBottom: 12,
    fontSize: 14,
  };

const kpiValue: React.CSSProperties =
  {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
    color: "#111",
  };

const mainGrid: React.CSSProperties =
  {
    display: "grid",
    gridTemplateColumns:
      "2fr 1fr",
    gap: 24,
  };

const card: React.CSSProperties =
  {
    background: "white",
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.06)",
  };

const sectionTitle: React.CSSProperties =
  {
    marginTop: 0,
    marginBottom: 20,
    fontSize: 22,
  };

const productsList: React.CSSProperties =
  {
    display: "grid",
    gap: 16,
  };

const emptyProducts: React.CSSProperties =
  {
    color: "#777",
    padding: "10px 0",
  };

const productCard: React.CSSProperties =
  {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: 20,
    paddingBottom: 16,
    borderBottom:
      "1px solid #eee",
  };

const productLeft: React.CSSProperties =
  {
    display: "flex",
    gap: 14,
    alignItems: "center",
  };

const productImage: React.CSSProperties =
  {
    width: 72,
    height: 72,
    objectFit: "cover",
    borderRadius: 14,
    background: "#f3f4f6",
  };

const productName: React.CSSProperties =
  {
    margin: 0,
    fontSize: 16,
  };

const productQty: React.CSSProperties =
  {
    color: "#777",
    marginTop: 6,
    fontSize: 13,
  };

const productPrice: React.CSSProperties =
  {
    color: "#a16207",
    fontSize: 18,
  };

const timelineWrapper: React.CSSProperties =
  {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  };

const timelineItem: React.CSSProperties =
  {
    display: "flex",
    alignItems: "center",
    gap: 14,
  };

const timelineDot: React.CSSProperties =
  {
    width: 14,
    height: 14,
    borderRadius: 999,
  };

const trackingBox: React.CSSProperties =
  {
    background: "#faf7f2",
    borderRadius: 18,
    padding: 18,
  };

const trackingRow: React.CSSProperties =
  {
    display: "flex",
    justifyContent:
      "space-between",
    marginBottom: 14,
  };

const trackingLabel: React.CSSProperties =
  {
    color: "#666",
  };

const trackingBtn: React.CSSProperties =
  {
    display: "inline-block",
    marginTop: 10,
    background: "#111",
    color: "white",
    padding: "12px 16px",
    borderRadius: 12,
    textDecoration: "none",
    fontWeight: 700,
  };

const summaryRow: React.CSSProperties =
  {
    display: "flex",
    justifyContent:
      "space-between",
    marginBottom: 14,
  };

const totalRow: React.CSSProperties =
  {
    display: "flex",
    justifyContent:
      "space-between",
    borderTop:
      "1px solid #eee",
    paddingTop: 18,
    marginTop: 18,
    fontSize: 20,
    fontWeight: 800,
  };

const paymentBox: React.CSSProperties =
  {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  };

const paymentText: React.CSSProperties =
  {
    color: "#555",
    lineHeight: 1.6,
  };

const secureBadge: React.CSSProperties =
  {
    background: "#f3f4f6",
    padding: "12px 14px",
    borderRadius: 12,
    fontWeight: 700,
    width: "fit-content",
  };

const supportText: React.CSSProperties =
  {
    color: "#666",
    lineHeight: 1.6,
    marginBottom: 20,
  };

const supportBtn: React.CSSProperties =
  {
    display: "inline-block",
    background:
      "linear-gradient(135deg,#b7791f,#8b5e14)",
    color: "white",
    padding: "14px 18px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 700,
  };

const invoiceBtn: React.CSSProperties =
  {
    display: "inline-block",
    width: "100%",
    textAlign: "center",
    background: "#111",
    color: "white",
    padding: "14px 18px",
    borderRadius: 14,
    textDecoration: "none",
    fontWeight: 700,
  };