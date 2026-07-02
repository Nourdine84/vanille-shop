import Link from "next/link";
import type { Metadata } from "next";
import {
  HeartHandshake,
  Gem,
  Route,
  Sprout,
  Truck,
  CreditCard,
  RotateCcw,
  HelpCircle,
  Headphones,
  ShieldCheck,
  Cookie,
  FileText,
  ScrollText,
  Landmark,
  type LucideIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Confiance & Transparence | Vanille’Or",
  description:
    "Découvrez les engagements, la politique de qualité et toutes les informations relatives à votre expérience d’achat chez Vanille’Or.",
  keywords: [
    "confiance",
    "transparence",
    "engagements",
    "CGV",
    "confidentialité",
    "Vanille’Or",
  ],
  alternates: {
    canonical: "/confiance",
  },
  openGraph: {
    title: "Confiance & Transparence | Vanille’Or",
    description:
      "Découvrez les engagements, la politique de qualité et toutes les informations relatives à votre expérience d’achat chez Vanille’Or.",
    type: "website",
  },
};

/* ================= CARTES ================= */

type TrustCard = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
};

const cards: TrustCard[] = [
  {
    icon: HeartHandshake,
    title: "Notre engagement",
    description:
      "Ce que Vanille’Or promet à chaque client, à chaque commande.",
    href: "/confiance/engagement",
  },
  {
    icon: Gem,
    title: "Notre qualité",
    description:
      "Les standards de sélection derrière chacun de nos produits.",
    href: "/confiance/qualite",
  },
  {
    icon: Route,
    title: "Traçabilité",
    description:
      "Le parcours de nos produits, de la récolte jusqu’à votre porte.",
    href: "/confiance/tracabilite",
  },
  {
    icon: Sprout,
    title: "Producteurs partenaires",
    description:
      "Notre lien avec les producteurs de Madagascar.",
    href: "/confiance/producteurs",
  },
  {
    icon: Truck,
    title: "Livraison",
    description:
      "Délais, zones de livraison et suivi de commande.",
    href: "/legal/livraison",
  },
  {
    icon: CreditCard,
    title: "Paiements sécurisés",
    description:
      "Le paiement en ligne sécurisé via Stripe.",
    href: "/legal/paiements",
  },
  {
    icon: RotateCcw,
    title: "Retours",
    description:
      "Notre politique de retours et de rétractation.",
    href: "/legal/retours",
  },
  {
    icon: HelpCircle,
    title: "FAQ",
    description:
      "Les réponses aux questions les plus fréquentes.",
    href: "/support/faq",
  },
  {
    icon: Headphones,
    title: "SAV",
    description:
      "Un service client premium à votre écoute.",
    href: "/reclamation",
  },
  {
    icon: ShieldCheck,
    title: "Confidentialité",
    description:
      "La protection de vos données personnelles.",
    href: "/legal/confidentialite",
  },
  {
    icon: Cookie,
    title: "Cookies",
    description:
      "Notre politique d’utilisation des cookies.",
    href: "/legal/cookies",
  },
  {
    icon: FileText,
    title: "CGV",
    description:
      "Conditions générales de vente de Vanille’Or.",
    href: "/cgv",
  },
  {
    icon: ScrollText,
    title: "CGU",
    description:
      "Conditions générales d’utilisation du site.",
    href: "/legal/cgu",
  },
  {
    icon: Landmark,
    title: "Mentions légales",
    description:
      "Les informations légales relatives à l’éditeur du site.",
    href: "/legal/mentions-legales",
  },
];

/* ================= PAGE ================= */

export default function ConfiancePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://vanille-or.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Confiance & Transparence",
        item: "https://vanille-or.com/confiance",
      },
    ],
  };

  return (
    <div style={page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      {/* BREADCRUMB */}

      <div style={breadcrumbWrapper}>
        <nav aria-label="Fil d’Ariane" style={breadcrumb}>
          <Link href="/" style={breadcrumbLink}>
            Accueil
          </Link>

          <span style={breadcrumbSep}>/</span>

          <span style={breadcrumbCurrent}>
            Confiance & Transparence
          </span>
        </nav>
      </div>

      {/* HERO */}

      <section style={hero}>
        <div style={overlay} />

        <div style={heroContent}>
          <p style={heroTag}>VANILLE’OR</p>

          <h1 style={heroTitle}>
            Confiance & Transparence
          </h1>

          <p style={heroSubtitle}>
            Chez Vanille’Or, nous pensons qu’un produit d’exception
            mérite une transparence totale. Découvrez nos engagements,
            notre politique de qualité et toutes les informations
            relatives à votre expérience d’achat.
          </p>
        </div>
      </section>

      {/* GRID */}

      <div style={container}>
        <div style={grid}>
          {cards.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                style={cardLink}
              >
                <div style={card}>
                  <div style={iconWrap}>
                    <Icon size={26} color="#a16207" />
                  </div>

                  <h3 style={cardTitle}>
                    {item.title}
                  </h3>

                  <p style={cardDesc}>
                    {item.description}
                  </p>

                  <span style={cardCta}>
                    Découvrir →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* CTA FINAL */}

      <section style={ctaSection}>
        <div style={ctaBox}>
          <h2 style={ctaTitle}>
            Vous ne trouvez pas votre réponse ?
          </h2>

          <p style={ctaText}>
            Notre équipe reste disponible du lundi au vendredi
            de 10h à 18h.
          </p>

          <Link href="/support" style={ctaBtn}>
            Contacter le service client
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ================= STYLES ================= */

const page: React.CSSProperties = {
  background: "#f8f5ef",
};

const breadcrumbWrapper: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "18px 20px 0",
};

const breadcrumb: React.CSSProperties = {
  fontSize: "13px",
  color: "#777",
};

const breadcrumbLink: React.CSSProperties = {
  color: "#777",
  textDecoration: "none",
};

const breadcrumbSep: React.CSSProperties = {
  margin: "0 8px",
};

const breadcrumbCurrent: React.CSSProperties = {
  color: "#a16207",
  fontWeight: 600,
};

const hero: React.CSSProperties = {
  position: "relative",
  height: "320px",
  marginTop: "16px",
  backgroundImage: "url('/images/hero-vanille.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const overlay: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(135deg,#000000cc,#2a2117cc)",
};

const heroContent: React.CSSProperties = {
  position: "relative",
  textAlign: "center",
  color: "white",
  paddingTop: "90px",
  paddingInline: "20px",
  maxWidth: "760px",
  margin: "0 auto",
};

const heroTag: React.CSSProperties = {
  color: "#d4af37",
  letterSpacing: "0.3em",
  fontWeight: 800,
  fontSize: "13px",
};

const heroTitle: React.CSSProperties = {
  fontSize: "38px",
  marginTop: "10px",
  marginBottom: "16px",
  fontWeight: 800,
};

const heroSubtitle: React.CSSProperties = {
  color: "#ddd",
  lineHeight: 1.7,
  maxWidth: "700px",
  margin: "0 auto",
};

const container: React.CSSProperties = {
  padding: "50px 20px",
  maxWidth: "1200px",
  margin: "0 auto",
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))",
  gap: "24px",
};

const cardLink: React.CSSProperties = {
  textDecoration: "none",
  color: "inherit",
};

const card: React.CSSProperties = {
  background: "white",
  borderRadius: "18px",
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.25s ease",
  padding: "26px",
  height: "100%",
};

const iconWrap: React.CSSProperties = {
  width: "52px",
  height: "52px",
  borderRadius: "14px",
  background: "#fff7ed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "18px",
};

const cardTitle: React.CSSProperties = {
  margin: 0,
  fontWeight: 700,
  fontSize: "17px",
  marginBottom: "8px",
  color: "#111",
};

const cardDesc: React.CSSProperties = {
  color: "#666",
  fontSize: "14px",
  lineHeight: 1.5,
  margin: "0 0 16px",
  flex: 1,
};

const cardCta: React.CSSProperties = {
  color: "#a16207",
  fontWeight: 700,
  fontSize: "14px",
};

const ctaSection: React.CSSProperties = {
  padding: "20px 20px 90px",
};

const ctaBox: React.CSSProperties = {
  maxWidth: "700px",
  margin: "0 auto",
  textAlign: "center",
  background: "white",
  borderRadius: "24px",
  padding: "50px 30px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const ctaTitle: React.CSSProperties = {
  fontSize: "26px",
  fontWeight: 800,
  marginBottom: "12px",
  color: "#111",
};

const ctaText: React.CSSProperties = {
  color: "#666",
  lineHeight: 1.7,
  marginBottom: "26px",
};

const ctaBtn: React.CSSProperties = {
  display: "inline-block",
  background: "#a16207",
  color: "white",
  padding: "15px 28px",
  borderRadius: "14px",
  textDecoration: "none",
  fontWeight: 700,
};
