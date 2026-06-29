"use client";

import Link from "next/link";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useSearchParams } from "next/navigation";

import { useCart } from "@/lib/cart-context";
import { useUIStore } from "@/components/ui-providers";

/* ================= TYPES ================= */

type OrderData = {
  id: string;
  email?: string | null;
  totalCents: number;
  status: string;
  createdAt: string;
  trackingNumber?: string | null;
  carrier?: string | null;
};

/* ================= UTILS ================= */

function getLogo() {
  return "/images/logo-vanilleor.png";
}

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace(".", ",") + " €";
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(date));
}

function getTrackingUrl(carrier?: string | null, tracking?: string | null) {
  if (!carrier || !tracking) return null;

  switch (carrier.toLowerCase()) {
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

function getTimeline(status: string) {
  return [
    { label: "Commande validée", done: true },
    { label: "Paiement confirmé", done: ["PAID", "SHIPPED", "DELIVERED"].includes(status) },
    { label: "Préparation expédition", done: ["SHIPPED", "DELIVERED"].includes(status) },
    { label: "Livraison", done: status === "DELIVERED" },
  ];
}

/* ================= CONTENT ================= */

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderIdParam = searchParams.get("order");

  const { clearCart } = useCart();
  const { resetUI } = useUIStore();

  const hasRun = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    if (hasRun.current) return;

    hasRun.current = true;

    sessionStorage.setItem("order_success", "true");
    clearCart();
    resetUI();

    if (typeof window !== "undefined") {
      document.body.style.overflow = "auto";
      document.body.style.pointerEvents = "auto";
      window.scrollTo({ top: 0 });
    }
  }, [clearCart, resetUI]);

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        setError("");

        if (!sessionId && !orderIdParam) {
          setError("Session de paiement invalide.");
          return;
        }

        let orderId = orderIdParam;

        if (!orderId && typeof window !== "undefined") {
          orderId = sessionStorage.getItem("last_order_id");
        }

        if (!orderId) {
          setError("Commande introuvable.");
          return;
        }

        const res = await fetch(`/api/orders/${orderId}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Erreur récupération commande");
        }

        setOrder(data);
      } catch (err: any) {
        console.error("❌ SUCCESS PAGE ERROR:", err);
        setError(err?.message || "Erreur chargement commande");
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [sessionId, orderIdParam]);

  const timeline = useMemo(() => getTimeline(order?.status || ""), [order]);
  const trackingUrl = getTrackingUrl(order?.carrier, order?.trackingNumber);

  if (loading) {
    return (
      <div style={page}>
        <section style={hero}>
          <div style={overlay} />
          <div style={content}>
            <h1 style={title}>Chargement...</h1>
          </div>
        </section>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={page}>
        <section style={hero}>
          <div style={overlay} />
          <div style={content}>
            <img src={getLogo()} alt="VanilleOr" style={logo} />
            <h1 style={title}>Session invalide</h1>
            <p style={text}>{error}</p>
            <div style={actions}>
              <Link href="/products" style={btnPrimary}>
                Retour boutique
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div style={page}>
      <section style={hero}>
        <div style={overlay} />

        <div style={content}>
          <div style={successCircle}>✓</div>

          <img
            src={getLogo()}
            alt="VanilleOr"
            style={logo}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/images/default.jpg";
            }}
          />

          <p style={eyebrow}>COMMANDE VALIDÉE</p>

          <h1 style={title}>Merci pour votre confiance ✨</h1>

          <p style={text}>
            Votre commande a bien été confirmée et notre équipe prépare actuellement votre sélection premium.
          </p>

          <p style={subText}>Un email récapitulatif vous a été envoyé.</p>

          <div style={orderBox}>
            <div style={orderRow}>
              <span>Numéro commande</span>
              <strong>#{order.id.slice(0, 8)}</strong>
            </div>

            <div style={orderRow}>
              <span>Date</span>
              <strong>{formatDate(order.createdAt)}</strong>
            </div>

            <div style={orderRow}>
              <span>Statut</span>
              <strong>{order.status}</strong>
            </div>

            <div style={orderRow}>
              <span>Total</span>
              <strong>{formatPrice(order.totalCents)}</strong>
            </div>

            {order.email && (
              <div style={orderRow}>
                <span>Email</span>
                <strong>{order.email}</strong>
              </div>
            )}
          </div>

          <div style={timelineBox}>
            <h3 style={timelineTitle}>🚀 Suivi commande</h3>

            <div style={timelineWrapper}>
              {timeline.map((step, index) => (
                <div key={index} style={timelineItem}>
                  <div
                    style={{
                      ...timelineDot,
                      background: step.done ? "#16a34a" : "rgba(255,255,255,0.2)",
                    }}
                  />

                  <span style={{ color: step.done ? "#fff" : "#bbb" }}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={actions}>
            <Link href="/products" style={btnPrimary}>
              Continuer mes achats
            </Link>

            <Link href="/account/orders" style={btnGhost}>
              Voir mes commandes
            </Link>

            <a
              href={`/api/invoice/${order.id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={btnInvoice}
            >
              Télécharger facture
            </a>

            {trackingUrl && (
              <a
                href={trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={btnTracking}
              >
                Suivre mon colis
              </a>
            )}
          </div>

          <div style={trustBox}>
            <div style={trustItem}>✔ Paiement sécurisé Stripe</div>
            <div style={trustItem}>✔ Expédition rapide & suivie</div>
            <div style={trustItem}>✔ Produits premium Madagascar</div>
          </div>

          <p style={signature}>
            VanilleOr — L’excellence de la vanille et des épices de Madagascar
          </p>
        </div>
      </section>
    </div>
  );
}

/* ================= PAGE WRAPPER ================= */

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div style={page}>
          <section style={hero}>
            <div style={overlay} />
            <div style={content}>
              <h1 style={title}>Chargement...</h1>
            </div>
          </section>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

/* ================= STYLES ================= */

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "#000",
};

const hero: React.CSSProperties = {
  position: "relative",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundImage: "url('/images/hero-vanille.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: "60px 20px",
};

const overlay: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(180deg, rgba(0,0,0,0.72), rgba(0,0,0,0.92))",
};

const content: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  textAlign: "center",
  color: "white",
  maxWidth: "760px",
  width: "100%",
};

const successCircle: React.CSSProperties = {
  width: "88px",
  height: "88px",
  borderRadius: "999px",
  background: "linear-gradient(135deg,#16a34a,#15803d)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 28px",
  fontSize: "42px",
  fontWeight: 900,
  boxShadow: "0 15px 40px rgba(22,163,74,0.35)",
};

const logo: React.CSSProperties = {
  width: "180px",
  marginBottom: "20px",
};

const eyebrow: React.CSSProperties = {
  color: "#d4af37",
  fontSize: "12px",
  fontWeight: 900,
  letterSpacing: "0.25em",
  marginBottom: "12px",
};

const title: React.CSSProperties = {
  fontSize: "42px",
  fontWeight: 900,
  marginBottom: "18px",
  lineHeight: 1.2,
};

const text: React.CSSProperties = {
  fontSize: "16px",
  marginBottom: "12px",
  color: "#e5e5e5",
  lineHeight: 1.8,
};

const subText: React.CSSProperties = {
  fontSize: "14px",
  color: "#bdbdbd",
  marginBottom: "28px",
};

const orderBox: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "24px",
  padding: "26px",
  marginBottom: "24px",
  backdropFilter: "blur(12px)",
};

const orderRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
  padding: "12px 0",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  fontSize: "14px",
};

const timelineBox: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "22px",
  padding: "24px",
  marginBottom: "26px",
};

const timelineTitle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "20px",
  fontSize: "18px",
};

const timelineWrapper: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const timelineItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
};

const timelineDot: React.CSSProperties = {
  width: "14px",
  height: "14px",
  borderRadius: "999px",
};

const actions: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "14px",
  flexWrap: "wrap",
};

const btnPrimary: React.CSSProperties = {
  background: "linear-gradient(135deg,#b7791f,#8b5e14)",
  color: "white",
  padding: "14px 24px",
  borderRadius: "14px",
  textDecoration: "none",
  fontWeight: 800,
};

const btnGhost: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  color: "white",
  padding: "14px 24px",
  borderRadius: "14px",
  textDecoration: "none",
  border: "1px solid rgba(255,255,255,0.15)",
};

const btnInvoice: React.CSSProperties = {
  background: "linear-gradient(135deg,#16a34a,#15803d)",
  color: "white",
  padding: "14px 24px",
  borderRadius: "14px",
  textDecoration: "none",
  fontWeight: 800,
};

const btnTracking: React.CSSProperties = {
  background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
  color: "white",
  padding: "14px 24px",
  borderRadius: "14px",
  textDecoration: "none",
  fontWeight: 800,
};

const trustBox: React.CSSProperties = {
  marginTop: "34px",
  display: "grid",
  gap: "10px",
};

const trustItem: React.CSSProperties = {
  color: "#d1d5db",
  fontSize: "14px",
};

const signature: React.CSSProperties = {
  marginTop: "34px",
  fontSize: "12px",
  color: "#8f8f8f",
  lineHeight: 1.8,
};