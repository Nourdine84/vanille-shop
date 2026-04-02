import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type OrderItem = {
  id?: string;
  name: string;
  quantity: number;
  priceCents: number;
};

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getTrackingLink(carrier?: string | null, tracking?: string | null) {
  if (!carrier || !tracking) return null;

  switch (carrier.toLowerCase()) {
    case "colissimo":
      return `https://www.laposte.fr/outils/suivre-vos-envois?code=${tracking}`;
    case "chronopost":
      return `https://www.chronopost.fr/tracking-no-cms/suivi-page?listeNumerosLT=${tracking}`;
    case "dhl":
      return `https://www.dhl.com/fr-fr/home/tracking.html?tracking-id=${tracking}`;
    default:
      return null;
  }
}

function getStatusLabel(status: OrderStatus) {
  switch (status) {
    case "PENDING":
      return "Commande enregistrée";
    case "PAID":
      return "Paiement confirmé";
    case "SHIPPED":
      return "Commande expédiée";
    case "DELIVERED":
      return "Commande livrée";
    case "FAILED":
      return "Paiement échoué";
    case "CANCELED":
      return "Commande annulée";
    default:
      return status;
  }
}

function getStatusColor(status: OrderStatus) {
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
      return "#6b7280";
  }
}

export default async function OrderTrackingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
  });

  if (!order) {
    notFound();
  }

  const items: OrderItem[] = Array.isArray(order.items)
    ? (order.items as OrderItem[])
    : [];

  const trackingLink = getTrackingLink(
    order.carrier,
    order.trackingNumber
  );

  return (
    <div style={page}>
      <div style={wrapper}>
        <div style={heroCard}>
          <p style={eyebrow}>Suivi Vanille’Or</p>
          <h1 style={title}>Commande #{order.id.slice(0, 8)}</h1>
          <p style={subtitle}>
            Dernière mise à jour : {formatDate(order.updatedAt)}
          </p>

          <div
            style={{
              ...statusPill,
              background: getStatusColor(order.status),
            }}
          >
            {getStatusLabel(order.status)}
          </div>
        </div>

        <div style={grid}>
          <div style={mainCol}>
            <div style={card}>
              <h2 style={sectionTitle}>État de la commande</h2>

              <div style={timeline}>
                <Step
                  active={[
                    "PENDING",
                    "PAID",
                    "SHIPPED",
                    "DELIVERED",
                  ].includes(order.status)}
                  title="Commande enregistrée"
                  text="Votre commande a bien été créée dans notre système."
                />

                <Step
                  active={[
                    "PAID",
                    "SHIPPED",
                    "DELIVERED",
                  ].includes(order.status)}
                  title="Paiement confirmé"
                  text="Le paiement a été validé avec succès."
                />

                <Step
                  active={["SHIPPED", "DELIVERED"].includes(order.status)}
                  title="Commande expédiée"
                  text="Votre colis a été remis au transporteur."
                />

                <Step
                  active={["DELIVERED"].includes(order.status)}
                  title="Commande livrée"
                  text="Votre commande a été marquée comme livrée."
                />
              </div>
            </div>

            <div style={card}>
              <h2 style={sectionTitle}>Articles</h2>

              {items.length === 0 ? (
                <p style={muted}>Aucun article enregistré.</p>
              ) : (
                <div style={itemsList}>
                  {items.map((item, index) => (
                    <div key={`${item.id || item.name}-${index}`} style={itemRow}>
                      <div>
                        <p style={itemName}>{item.name}</p>
                        <p style={muted}>Quantité : {item.quantity}</p>
                      </div>

                      <strong>
                        {formatPrice(item.priceCents * item.quantity)}
                      </strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={sideCol}>
            <div style={card}>
              <h2 style={sectionTitle}>Résumé</h2>

              <Info label="Référence" value={`#${order.id.slice(0, 8)}`} />
              <Info label="Date" value={formatDate(order.createdAt)} />
              <Info label="Statut" value={getStatusLabel(order.status)} />
              <Info
                label="Montant total"
                value={formatPrice(order.totalCents)}
              />
              <Info label="Email" value={order.email || "Non renseigné"} />
            </div>

            <div style={card}>
              <h2 style={sectionTitle}>Livraison</h2>

              <Info
                label="Transporteur"
                value={order.carrier || "En attente"}
              />
              <Info
                label="Tracking"
                value={order.trackingNumber || "En attente"}
              />

              {trackingLink && (
                <a
                  href={trackingLink}
                  target="_blank"
                  rel="noreferrer"
                  style={trackingBtn}
                >
                  Suivre le colis
                </a>
              )}
            </div>

            <div style={cardSoft}>
              <h3 style={{ marginTop: 0 }}>Besoin d’aide ?</h3>
              <p style={muted}>
                Notre équipe reste disponible pour toute question liée à votre
                commande ou à la livraison.
              </p>

              <Link href="/contact" style={contactBtn}>
                Contacter Vanille’Or
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({
  active,
  title,
  text,
}: {
  active: boolean;
  title: string;
  text: string;
}) {
  return (
    <div style={stepRow}>
      <div
        style={{
          ...stepDot,
          background: active ? "#16a34a" : "#d1d5db",
        }}
      />
      <div>
        <p style={stepTitle}>{title}</p>
        <p style={stepText}>{text}</p>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div style={infoRow}>
      <span style={infoLabel}>{label}</span>
      <span style={infoValue}>{value}</span>
    </div>
  );
}

const page = {
  background: "#faf7f2",
  minHeight: "100vh",
  padding: "40px 20px 60px",
};

const wrapper = {
  maxWidth: "1180px",
  margin: "0 auto",
};

const heroCard = {
  background: "white",
  borderRadius: "20px",
  padding: "28px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
  marginBottom: "24px",
};

const eyebrow = {
  color: "#a16207",
  fontWeight: 700,
  margin: "0 0 8px 0",
};

const title = {
  margin: "0 0 10px 0",
  fontSize: "34px",
};

const subtitle = {
  margin: "0 0 18px 0",
  color: "#666",
};

const statusPill = {
  display: "inline-block",
  color: "white",
  fontWeight: 700,
  fontSize: "13px",
  padding: "8px 12px",
  borderRadius: "999px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1.4fr 0.9fr",
  gap: "24px",
};

const mainCol = {
  display: "grid",
  gap: "24px",
};

const sideCol = {
  display: "grid",
  gap: "24px",
  alignSelf: "start",
};

const card = {
  background: "white",
  borderRadius: "18px",
  padding: "24px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
};

const cardSoft = {
  background: "#fffaf1",
  borderRadius: "18px",
  padding: "24px",
};

const sectionTitle = {
  marginTop: 0,
  marginBottom: "18px",
  fontSize: "20px",
};

const timeline = {
  display: "grid",
  gap: "18px",
};

const stepRow = {
  display: "flex",
  gap: "14px",
  alignItems: "flex-start",
};

const stepDot = {
  width: "14px",
  height: "14px",
  borderRadius: "50%",
  marginTop: "4px",
  flexShrink: 0 as const,
};

const stepTitle = {
  margin: "0 0 6px 0",
  fontWeight: 700,
};

const stepText = {
  margin: 0,
  color: "#666",
  lineHeight: 1.6,
};

const itemsList = {
  display: "grid",
  gap: "12px",
};

const itemRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: "14px",
  alignItems: "center",
  padding: "12px 0",
  borderBottom: "1px solid #eee",
};

const itemName = {
  margin: "0 0 4px 0",
  fontWeight: 700,
};

const muted = {
  margin: 0,
  color: "#666",
  lineHeight: 1.6,
};

const infoRow = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  padding: "10px 0",
  borderBottom: "1px solid #eee",
};

const infoLabel = {
  color: "#777",
};

const infoValue = {
  fontWeight: 600,
  textAlign: "right" as const,
};

const trackingBtn = {
  display: "inline-block",
  marginTop: "16px",
  background: "#a16207",
  color: "white",
  padding: "12px 18px",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: 700,
};

const contactBtn = {
  display: "inline-block",
  marginTop: "10px",
  background: "#111827",
  color: "white",
  padding: "12px 18px",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: 700,
};