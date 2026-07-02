import Link from "next/link";
import type { ReactNode } from "react";
import ReadingProgressBar from "./ReadingProgressBar";
import PrintButton from "./PrintButton";
import { estimateReadingTime } from "@/lib/reading-time";

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
  group?: string;
};

export default function LegalPageLayout({
  title,
  intro,
  lastUpdated,
  version = "v1.0",
  sections,
  closing,
  breadcrumbCurrent,
  relatedLinks,
  slug,
  metaDescription,
  printLabel,
}: {
  title: string;
  intro: string;
  lastUpdated: string;
  version?: string;
  sections: LegalSection[];
  closing: {
    title: string;
    paragraphs: string[];
  };
  breadcrumbCurrent: string;
  relatedLinks?: { label: string; href: string }[];
  slug: string;
  metaDescription: string;
  printLabel?: string;
}) {
  const baseUrl = "https://vanille-or.com";
  const hasGroups = sections.some((s) => s.group);
  const readingTime = estimateReadingTime(sections);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description: metaDescription,
      url: `${baseUrl}${slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Accueil",
          item: baseUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Confiance & Transparence",
          item: `${baseUrl}/confiance`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: breadcrumbCurrent,
          item: `${baseUrl}${slug}`,
        },
      ],
    },
  ];

  function renderSection(s: LegalSection, index: number) {
    const prev = sections[index - 1];
    const next = sections[index + 1];

    return (
      <section key={s.id} id={s.id} tabIndex={-1} style={section}>
        <h3 style={sectionTitle}>{s.title}</h3>

        <div style={sectionBody}>{s.content}</div>

        {(prev || next) && (
          <div style={articleNav}>
            {prev ? (
              <a href={`#${prev.id}`} style={articleNavLink}>
                ← {prev.title}
              </a>
            ) : (
              <span />
            )}

            {next && (
              <a
                href={`#${next.id}`}
                style={{
                  ...articleNavLink,
                  textAlign: "right",
                }}
              >
                {next.title} →
              </a>
            )}
          </div>
        )}
      </section>
    );
  }

  return (
    <div className="legal-page-root" style={page}>
      <style>{`
        .legal-page-root :focus-visible {
          outline: 2px solid #a16207;
          outline-offset: 3px;
        }

        .legal-toc-summary {
          cursor: pointer;
          list-style: revert;
        }

        @media (min-width: 768px) {
          .legal-toc[open] .legal-toc-summary {
            cursor: default;
          }
        }

        @media print {
          header, footer, .no-print {
            display: none !important;
          }

          body {
            background: white !important;
          }

          .legal-page-root section {
            break-inside: avoid;
          }
        }
      `}</style>

      <ReadingProgressBar />

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

          <Link href="/confiance" style={breadcrumbLink}>
            Confiance & Transparence
          </Link>

          <span style={breadcrumbSep}>/</span>

          <span
            style={breadcrumbCurrentStyle}
            aria-current="page"
          >
            {breadcrumbCurrent}
          </span>
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

      {/* META ROW */}

      <div style={container}>
        <div style={metaRow}>
          <div style={metaItem}>
            <span style={metaLabel}>Temps de lecture</span>
            <span style={metaValue}>≈ {readingTime} min</span>
          </div>

          <div style={metaItem}>
            <span style={metaLabel}>Version</span>
            <span style={metaValue}>{version}</span>
          </div>

          <div style={metaItem}>
            <span style={metaLabel}>Dernière mise à jour</span>
            <span style={metaValue}>{lastUpdated}</span>
          </div>

          <PrintButton label={printLabel || "Imprimer ce document"} />
        </div>

        {/* SOMMAIRE */}

        <details open className="legal-toc" style={toc}>
          <summary className="legal-toc-summary" style={tocTitle}>
            Sommaire
          </summary>

          {hasGroups ? (
            <div style={tocGroups}>
              {groupSections(sections).map((g) => (
                <div key={g.group}>
                  {g.group && (
                    <p style={tocGroupTitle}>{g.group}</p>
                  )}

                  <ol style={tocList}>
                    {g.items.map((s) => (
                      <li key={s.id}>
                        <a href={`#${s.id}`} style={tocLink}>
                          {s.title}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          ) : (
            <ol style={tocList}>
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} style={tocLink}>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          )}
        </details>

        {/* SECTIONS */}

        <div style={content}>
          {hasGroups
            ? groupSections(sections).map((g) => (
                <div key={g.group}>
                  {g.group && (
                    <h2 style={partieTitle}>{g.group}</h2>
                  )}

                  {g.items.map((s) =>
                    renderSection(s, sections.indexOf(s))
                  )}
                </div>
              ))
            : sections.map((s, i) => renderSection(s, i))}

          {/* BLOC PREMIUM */}

          <div style={closingBox}>
            <h3 style={closingTitle}>{closing.title}</h3>

            {closing.paragraphs.map((p, i) => (
              <p key={i} style={closingText}>
                {p}
              </p>
            ))}
          </div>

          {/* VOIR AUSSI */}

          {relatedLinks && relatedLinks.length > 0 && (
            <div style={relatedWrapper}>
              <p style={relatedTitle}>Voir aussi</p>

              <div style={relatedList}>
                {relatedLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={relatedLink}
                  >
                    {link.label} →
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* NAVIGATION */}

          <div style={backRow}>
            <Link href="/confiance" style={backLink}>
              ← Retour au Centre de Confiance
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function groupSections(sections: LegalSection[]) {
  const groups: { group: string; items: LegalSection[] }[] = [];

  for (const s of sections) {
    const key = s.group || "";
    const last = groups[groups.length - 1];

    if (last && last.group === key) {
      last.items.push(s);
    } else {
      groups.push({ group: key, items: [s] });
    }
  }

  return groups;
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

const breadcrumbCurrentStyle: React.CSSProperties = {
  color: "#a16207",
  fontWeight: 600,
};

const hero: React.CSSProperties = {
  position: "relative",
  minHeight: "260px",
  marginTop: "16px",
  backgroundImage: "url('/images/hero-vanille.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
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
  padding: "50px 20px",
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
  maxWidth: "850px",
  margin: "0 auto",
  padding: "50px 20px 90px",
};

const metaRow: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "24px",
  background: "white",
  borderRadius: "18px",
  padding: "20px 26px",
  marginBottom: "24px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const metaItem: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "2px",
};

const metaLabel: React.CSSProperties = {
  fontSize: "11px",
  color: "#999",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const metaValue: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 700,
  color: "#111",
};

const toc: React.CSSProperties = {
  background: "white",
  borderRadius: "18px",
  padding: "24px 26px",
  marginBottom: "40px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const tocTitle: React.CSSProperties = {
  margin: "0 0 12px",
  fontWeight: 800,
  color: "#a16207",
  fontSize: "13px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const tocList: React.CSSProperties = {
  margin: 0,
  paddingLeft: "20px",
  display: "grid",
  gap: "8px",
};

const tocLink: React.CSSProperties = {
  color: "#333",
  textDecoration: "none",
  fontSize: "14px",
};

const tocGroups: React.CSSProperties = {
  display: "grid",
  gap: "22px",
  marginTop: "16px",
};

const tocGroupTitle: React.CSSProperties = {
  margin: "0 0 8px",
  fontWeight: 800,
  color: "#111",
  fontSize: "14px",
};

const content: React.CSSProperties = {
  color: "#333",
  lineHeight: 1.8,
};

const partieTitle: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: 800,
  color: "#a16207",
  marginTop: "50px",
  marginBottom: "22px",
  paddingBottom: "14px",
  borderBottom: "2px solid #f0dfc0",
};

const section: React.CSSProperties = {
  marginBottom: "38px",
  scrollMarginTop: "90px",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "20px",
  fontWeight: 800,
  color: "#111",
  marginBottom: "14px",
};

const sectionBody: React.CSSProperties = {
  fontSize: "15px",
  color: "#444",
};

const articleNav: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  marginTop: "20px",
  paddingTop: "16px",
  borderTop: "1px dashed #e5ddcf",
};

const articleNavLink: React.CSSProperties = {
  color: "#a16207",
  textDecoration: "none",
  fontWeight: 600,
  fontSize: "13px",
  maxWidth: "45%",
};

const closingBox: React.CSSProperties = {
  marginTop: "40px",
  background: "linear-gradient(135deg,#fff7ed,#fdf3e2)",
  border: "1px solid #f0dfc0",
  borderRadius: "20px",
  padding: "34px 30px",
};

const closingTitle: React.CSSProperties = {
  margin: "0 0 12px",
  fontSize: "19px",
  fontWeight: 800,
  color: "#8b5e14",
};

const closingText: React.CSSProperties = {
  margin: "0 0 10px",
  color: "#5a4c39",
  fontSize: "14.5px",
  lineHeight: 1.8,
};

const relatedWrapper: React.CSSProperties = {
  marginTop: "40px",
  paddingTop: "30px",
  borderTop: "1px solid #eee",
};

const relatedTitle: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 800,
  color: "#a16207",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: "14px",
};

const relatedList: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "18px",
};

const relatedLink: React.CSSProperties = {
  color: "#333",
  textDecoration: "none",
  fontWeight: 600,
  fontSize: "14px",
};

const backRow: React.CSSProperties = {
  marginTop: "40px",
};

const backLink: React.CSSProperties = {
  color: "#a16207",
  textDecoration: "none",
  fontWeight: 700,
  fontSize: "14px",
};
