import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { OrderStatus } from "@prisma/client";

import AdminBackButton from "@/components/admin/AdminBackButton";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/* =========================
   HELPERS
========================= */

function formatPrice(price: number) {
  return (
    (price / 100)
      .toFixed(2)
      .replace(".", ",") + " €"
  );
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(
    "fr-FR",
    {
      dateStyle: "full",
      timeStyle: "short",
    }
  ).format(date);
}

function parseItems(items: any) {
  try {
    if (!items) return [];

    if (typeof items === "string") {
      return JSON.parse(items);
    }

    if (Array.isArray(items)) {
      return items;
    }

    return [];
  } catch {
    return [];
  }
}

function getStatusColor(
  status: OrderStatus
) {
  switch (status) {
    case "PENDING":
      return "#f59e0b";

    case "PAID":
      return "#16a34a";

    case "SHIPPED":
      return "#2563eb";

    case "DELIVERED":
      return "#7c3aed";

    case "FAILED":
      return "#dc2626";

    case "CANCELED":
      return "#6b7280";

    default:
      return "#111";
  }
}

function getTrackingUrl(
  carrier?: string | null,
  tracking?: string | null
) {
  if (!carrier || !tracking) {
    return null;
  }

  switch (
    carrier.toLowerCase()
  ) {
    case "colissimo":
      return `https://www.laposte.fr/outils/suivre-vos-envois?code=${tracking}`;

    case "chronopost":
      return `https://www.chronopost.fr/tracking-no-cms/suivi-page?listeNumerosLT=${tracking}`;

    case "dhl":
      return `https://www.dhl.com/fr-fr/home/tracking/tracking-express.html?tracking-id=${tracking}`;

    case "ups":
      return `https://www.ups.com/track?tracknum=${tracking}`;

    default:
      return null;
  }
}

function getTimeline(
  status: OrderStatus
) {
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

/* =========================
   PAGE
========================= */

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const isAdmin =
    cookies().get("admin")?.value ===
    "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const order =
    await prisma.order.findUnique({
      where: {
        id: params.id,
      },

      include: {
        user: true,
      },
    });

  if (!order) {
    return notFound();
  }

  const items = parseItems(
    order.items
  );

  const timeline =
    getTimeline(order.status);

  const trackingUrl =
    getTrackingUrl(
      order.carrier,
      order.trackingNumber
    );

  return (
    <div style={container}>
      <AdminBackButton
        label="Retour commandes"
        fallback="/admin/orders"
      />

      {/* HERO */}

      <div style={hero}>
        <div>
          <p style={heroTag}>
            ORDER DETAIL
          </p>

          <h1 style={title}>
            Commande #
            {order.id.slice(0, 8)}
          </h1>

          <p style={subtitle}>
            {formatDate(
              order.createdAt
            )}
          </p>
        </div>

        <div
          style={{
            ...statusBadge,
            background:
              getStatusColor(
                order.status
              ),
          }}
        >
          {order.status}
        </div>
      </div>

      {/* KPI */}

      <div style={grid3}>
        <Card
          title="💰 Total"
          value={formatPrice(
            order.totalCents
          )}
        />

        <Card
          title="📦 Articles"
          value={items.length}
        />

        <Card
          title="💳 Paiement"
          value={
            order.stripePaymentId
              ? "Validé"
              : "En attente"
          }
        />
      </div>

      {/* TIMELINE */}

      <div style={section}>
        <h2 style={sectionTitle}>
          🚀 Timeline commande
        </h2>

        <div style={timelineWrapper}>
          {timeline.map(
            (step, index) => (
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
                  {step.label}
                </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* MAIN */}

      <div style={mainGrid}>
        {/* LEFT */}

        <div>
          {/* CLIENT */}

          <div style={section}>
            <h2 style={sectionTitle}>
              👤 Client
            </h2>

            <div style={infoGrid}>
              <Info
                label="Email"
                value={
                  order.email ||
                  order.user
                    ?.email ||
                  "Non renseigné"
                }
              />

              <Info
                label="User ID"
                value={
                  order.userId ||
                  "-"
                }
              />

              <Info
                label="Commande"
                value={order.id}
              />
            </div>
          </div>

          {/* PRODUCTS */}

          <div style={section}>
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
                  Aucun produit.
                </div>
              ) : (
                items.map(
                  (
                    item: any,
                    index: number
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
                            Quantité :
                            {" "}
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
                          item.priceCents
                        )}
                      </strong>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div>
          {/* SHIPPING */}

          <div style={section}>
            <h2 style={sectionTitle}>
              🚚 Livraison
            </h2>

            <div style={infoGrid}>
              <Info
                label="Tracking"
                value={
                  order.trackingNumber ||
                  "Non renseigné"
                }
              />

              <Info
                label="Transporteur"
                value={
                  order.carrier ||
                  "Non renseigné"
                }
              />

              <Info
                label="Stripe"
                value={
                  order.stripePaymentId ||
                  "Non payé"
                }
              />
            </div>

            {trackingUrl && (
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={
                  trackingBtn
                }
              >
                📦 Suivre colis
              </a>
            )}
          </div>

          {/* UPDATE */}

          <div style={section}>
            <h2 style={sectionTitle}>
              ⚙️ Mise à jour
            </h2>

            <form
              action="/api/admin/orders/update-status"
              method="POST"
              style={form}
            >
              <input
                type="hidden"
                name="orderId"
                value={order.id}
              />

              <select
                name="status"
                defaultValue={
                  order.status
                }
                style={input}
              >
                {Object.values(
                  OrderStatus
                ).map((s) => (
                  <option
                    key={s}
                    value={s}
                  >
                    {s}
                  </option>
                ))}
              </select>

              <input
                name="trackingNumber"
                defaultValue={
                  order.trackingNumber ||
                  ""
                }
                placeholder="Tracking"
                style={input}
              />

              <select
                name="carrier"
                defaultValue={
                  order.carrier ||
                  ""
                }
                style={input}
              >
                <option value="">
                  Transporteur
                </option>

                <option value="colissimo">
                  Colissimo
                </option>

                <option value="chronopost">
                  Chronopost
                </option>

                <option value="dhl">
                  DHL
                </option>

                <option value="ups">
                  UPS
                </option>
              </select>

              <button
                type="submit"
                style={updateBtn}
              >
                💾 Sauvegarder
              </button>
            </form>
          </div>

          {/* ACTIONS */}

          <div style={section}>
            <h2 style={sectionTitle}>
              📩 Actions rapides
            </h2>

            <div style={actions}>
              <a
                href={`mailto:${order.email}`}
                style={primaryBtn}
              >
                Contacter client
              </a>

              <a
                href="/admin/reclamations"
                style={secondaryBtn}
              >
                Voir SAV
              </a>
              <a
                href={`/api/invoice/${order.id}`}
                target="_blank"
                style={invoiceBtn}
            >
              📄 Télécharger facture
            </a>
            </div>
          </div>

          <a
            href={`/api/invoice/${order.id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={invoicePreviewBtn}
          >
            👁️ Prévisualiser facture
          </a>

          {/* SUMMARY */}

          <div style={section}>
            <h2 style={sectionTitle}>
              💳 Résumé
            </h2>

            <div style={summaryRow}>
              <span>
                Sous-total
              </span>

              <strong>
                {formatPrice(
                  order.totalCents
                )}
              </strong>
            </div>

            <div style={summaryRow}>
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
        </div>
      </div>
    </div>
  );
}

/* =========================
   COMPONENTS
========================= */

function Card({
  title,
  value,
}: any) {
  return (
    <div style={card}>
      <p style={cardTitle}>
        {title}
      </p>

      <h3 style={cardValue}>
        {value}
      </h3>
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

const container = {
  padding: 30,
};

const hero = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  marginTop: 20,
  marginBottom: 30,
  flexWrap: "wrap" as const,
  gap: 20,
};

const heroTag = {
  color: "#a16207",
  fontWeight: 800,
  fontSize: 12,
  letterSpacing: "0.1em",
};

const title = {
  fontSize: 38,
  marginTop: 10,
  marginBottom: 10,
};

const subtitle = {
  color: "#666",
};

const statusBadge = {
  color: "white",
  padding: "10px 18px",
  borderRadius: 999,
  fontWeight: 800,
};

const grid3 = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: 20,
};

const card = {
  background: "white",
  padding: 24,
  borderRadius: 20,
};

const cardTitle = {
  color: "#777",
  marginBottom: 10,
};

const cardValue = {
  fontSize: 28,
  fontWeight: 800,
  margin: 0,
};

const section = {
  background: "white",
  padding: 24,
  borderRadius: 24,
  marginTop: 24,
};

const sectionTitle = {
  marginBottom: 20,
};

const timelineWrapper = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 18,
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

const mainGrid = {
  display: "grid",
  gridTemplateColumns:
    "2fr 1fr",
  gap: 24,
  marginTop: 10,
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

const productsList = {
  display: "grid",
  gap: 14,
};

const productCard = {
  background: "#faf7f2",
  borderRadius: 18,
  padding: 18,
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
};

const productLeft = {
  display: "flex",
  alignItems: "center",
  gap: 14,
};

const productImage = {
  width: 70,
  height: 70,
  borderRadius: 14,
  objectFit: "cover" as const,
};

const productName = {
  margin: 0,
};

const productQty = {
  color: "#777",
  marginTop: 8,
};

const productPrice = {
  color: "#a16207",
  fontSize: 18,
};

const emptyProducts = {
  color: "#777",
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

const updateBtn = {
  background:
    "linear-gradient(135deg,#b7791f,#8b5e14)",
  color: "white",
  border: "none",
  borderRadius: 14,
  padding: 16,
  fontWeight: 800,
  cursor: "pointer",
};

const trackingBtn = {
  display: "inline-block",
  marginTop: 20,
  background: "#111",
  color: "white",
  padding: "12px 16px",
  borderRadius: 12,
  textDecoration: "none",
  fontWeight: 700,
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

const summaryRow = {
  display: "flex",
  justifyContent:
    "space-between",
  marginBottom: 14,
};

const totalRow = {
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

const invoiceBtn = {

  background:

    "linear-gradient(135deg,#16a34a,#15803d)",

  color: "white",

  padding: "14px 18px",

  borderRadius: 14,

  textDecoration: "none",

  textAlign: "center" as const,

  fontWeight: 700,

}

const invoicePreviewBtn = {
  background: "#f3f4f6",
  color: "#111",
  padding: "14px 18px",
  borderRadius: 14,
  textDecoration: "none",
  textAlign: "center" as const,
  fontWeight: 700,
  border: "1px solid #ddd",
};