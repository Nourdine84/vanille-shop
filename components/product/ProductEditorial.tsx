"use client";

import { useState } from "react";
import { colors, radii, shadows } from "@/lib/design-tokens";
import type { ProductEditorial as Editorial } from "@/lib/product-editorial";

/**
 * Couche éditoriale premium d'une fiche produit (storytelling, usages,
 * conservation, confiance, FAQ). Purement présentationnelle : ne connaît ni
 * le prix, ni le stock, ni le panier. Rendue uniquement si un contenu
 * éditorial existe pour le produit courant.
 */
export default function ProductEditorial({
  editorial,
}: {
  editorial: Editorial;
}) {
  return (
    <section style={wrapper} aria-label="Présentation du produit">
      {/* ORIGINE + PORTRAIT AROMATIQUE */}
      {(editorial.origin || editorial.aromaticProfile) && (
        <div style={block}>
          <p style={eyebrow}>L'ORIGINE</p>

          <div style={twoCol}>
            {editorial.origin && (
              <div style={originCard}>
                <span style={originLabel}>Origine</span>
                <span style={originValue}>{editorial.origin}</span>
              </div>
            )}

            {editorial.aromaticProfile && (
              <div>
                <h3 style={blockTitle}>Portrait aromatique</h3>
                <p style={paragraph}>{editorial.aromaticProfile}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* USAGES */}
      {editorial.uses && editorial.uses.length > 0 && (
        <div style={block}>
          <p style={eyebrow}>LES USAGES</p>
          <h3 style={blockTitle}>Comment l'utiliser</h3>

          <ul style={tagList}>
            {editorial.uses.map((use) => (
              <li key={use} style={tag}>
                {use}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CONSERVATION */}
      {editorial.conservation && (
        <div style={block}>
          <p style={eyebrow}>CONSERVATION</p>
          <h3 style={blockTitle}>Conseils de conservation</h3>
          <p style={paragraph}>{editorial.conservation}</p>
        </div>
      )}

      {/* BLOC CONFIANCE */}
      {editorial.trust && (
        <div style={trustBox}>
          <p style={trustEyebrow}>POURQUOI CHOISIR CETTE VANILLE</p>
          <p style={trustText}>{editorial.trust}</p>
        </div>
      )}

      {/* FAQ */}
      {editorial.faq && editorial.faq.length > 0 && (
        <div style={block}>
          <p style={eyebrow}>QUESTIONS FRÉQUENTES</p>
          <h3 style={blockTitle}>Vos questions, nos réponses</h3>

          <div style={faqList}>
            {editorial.faq.map((item, i) => (
              <FaqItem
                key={item.question}
                question={item.question}
                answer={item.answer}
                defaultOpen={i === 0}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function FaqItem({
  question,
  answer,
  defaultOpen = false,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={faqItem}>
      <button
        type="button"
        style={faqQuestion}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{question}</span>
        <span style={{ ...faqChevron, transform: open ? "rotate(45deg)" : "none" }}>
          +
        </span>
      </button>

      {open && <p style={faqAnswer}>{answer}</p>}
    </div>
  );
}

/* ================= STYLES ================= */

const wrapper: React.CSSProperties = {
  marginTop: 70,
  display: "grid",
  gap: 48,
};

const block: React.CSSProperties = {};

const eyebrow: React.CSSProperties = {
  color: colors.gold,
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.12em",
  marginBottom: 12,
};

const blockTitle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 800,
  color: colors.ink,
  margin: "0 0 14px",
};

const paragraph: React.CSSProperties = {
  color: colors.textMuted,
  lineHeight: 1.8,
  fontSize: 16,
  margin: 0,
};

const twoCol: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
  gap: 30,
  alignItems: "start",
};

const originCard: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  padding: "22px 24px",
  background: colors.goldSoft,
  borderRadius: radii.soft,
  border: `1px solid ${colors.border}`,
};

const originLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.08em",
  color: colors.gold,
  textTransform: "uppercase",
};

const originValue: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  color: colors.ink,
};

const tagList: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const tag: React.CSSProperties = {
  padding: "8px 16px",
  background: colors.white,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.pill,
  fontSize: 14,
  fontWeight: 600,
  color: colors.inkSoft,
  textTransform: "capitalize",
};

const trustBox: React.CSSProperties = {
  padding: "34px 32px",
  background: colors.cream,
  borderRadius: radii.card,
  boxShadow: shadows.card,
};

const trustEyebrow: React.CSSProperties = {
  color: colors.gold,
  fontSize: 12,
  fontWeight: 800,
  letterSpacing: "0.12em",
  marginBottom: 12,
};

const trustText: React.CSSProperties = {
  color: colors.inkSoft,
  lineHeight: 1.8,
  fontSize: 17,
  margin: 0,
};

const faqList: React.CSSProperties = {
  display: "grid",
  gap: 12,
};

const faqItem: React.CSSProperties = {
  background: colors.white,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.soft,
  overflow: "hidden",
};

const faqQuestion: React.CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  padding: "18px 20px",
  background: "transparent",
  border: "none",
  cursor: "pointer",
  textAlign: "left",
  fontSize: 16,
  fontWeight: 700,
  color: colors.ink,
};

const faqChevron: React.CSSProperties = {
  flexShrink: 0,
  fontSize: 22,
  fontWeight: 700,
  color: colors.gold,
  transition: "transform 0.2s ease",
  lineHeight: 1,
};

const faqAnswer: React.CSSProperties = {
  padding: "0 20px 20px",
  margin: 0,
  color: colors.textMuted,
  lineHeight: 1.7,
  fontSize: 15,
};
