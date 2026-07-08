import Link from "next/link";
import type { ReactNode } from "react";

/* =========================
   Layout sobre partagé par les sous-pages du Centre de Confiance.
   Reprend strictement les tokens visuels de /confiance
   (fond #f8f5ef, or #a16207, cartes blanches arrondies).
========================= */

export type ConfianceSection = {
  title: string;
  body: ReactNode;
};

type Props = {
  title: string;
  intro: string;
  sections: ConfianceSection[];
  cta?: {
    label: string;
    href: string;
  };
};

export default function ConfianceSubPage({
  title,
  intro,
  sections,
  cta,
}: Props) {
  return (
    <div style={page}>
      {/* BREADCRUMB */}
      <div style={breadcrumbWrapper}>
        <nav aria-label="Fil d’Ariane" style={breadcrumb}>
          <Link href="/" style={breadcrumbLink}>
            Accueil
          </Link>

          <span style={breadcrumbSep}>/</span>

          <Link href="/confiance" style={breadcrumbLink}>
            Confiance &amp; Transparence
          </Link>

          <span style={breadcrumbSep}>/</span>

          <span style={breadcrumbCurrent}>{title}</span>
        </nav>
      </div>

      {/* HERO */}
      <section style={hero}>
        <div style={overlay} />

        <div style={heroContent}>
          <p style={heroTag}>VANILLE’OR</p>

          <h1 style={heroTitle}>{title}</h1>

          <p style={heroSubtitle}>{intro}</p>
        </div>
      </section>

      {/* SECTIONS */}
      <div style={container}>
        {sections.map((s) => (
          <section key={s.title} style={card}>
            <h2 style={cardTitle}>{s.title}</h2>

            <div style={cardBody}>{s.body}</div>
          </section>
        ))}

        {/* RETOUR + CTA */}
        <div style={footerNav}>
          <Link href="/confiance" style={backLink}>
            ← Retour au Centre de Confiance
          </Link>

          {cta && (
            <Link href={cta.href} style={ctaBtn}>
              {cta.label}
            </Link>
          )}
        </div>
      </div>
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
  height: "280px",
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
  paddingTop: "76px",
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
  fontSize: "34px",
  marginTop: "10px",
  marginBottom: "14px",
  fontWeight: 800,
};

const heroSubtitle: React.CSSProperties = {
  color: "#ddd",
  lineHeight: 1.7,
  maxWidth: "700px",
  margin: "0 auto",
};

const container: React.CSSProperties = {
  padding: "50px 20px 90px",
  maxWidth: "820px",
  margin: "0 auto",
};

const card: React.CSSProperties = {
  background: "white",
  borderRadius: "18px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  padding: "30px 28px",
  marginBottom: "22px",
};

const cardTitle: React.CSSProperties = {
  margin: "0 0 12px",
  fontWeight: 800,
  fontSize: "20px",
  color: "#111",
};

const cardBody: React.CSSProperties = {
  color: "#555",
  lineHeight: 1.75,
  fontSize: "15px",
};

const footerNav: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "14px",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "34px",
};

const backLink: React.CSSProperties = {
  color: "#a16207",
  fontWeight: 700,
  fontSize: "14px",
  textDecoration: "none",
};

const ctaBtn: React.CSSProperties = {
  display: "inline-block",
  background: "#a16207",
  color: "white",
  padding: "13px 24px",
  borderRadius: "14px",
  textDecoration: "none",
  fontWeight: 700,
  fontSize: "14px",
};
