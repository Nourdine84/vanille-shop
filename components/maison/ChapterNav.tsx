"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { colors } from "@/lib/design-tokens";

/**
 * Navigation "chapitre suivant" entre les pages de "La Maison Vanille'Or".
 * Distinct du MaisonCTA (qui pousse vers la boutique) : celui-ci matérialise
 * le parcours narratif d'une page à l'autre, comme les chapitres d'un livre.
 */
export default function ChapterNav({
  next,
  previous,
}: {
  next?: { label: string; href: string };
  previous?: { label: string; href: string };
}) {
  if (!next && !previous) return null;

  return (
    <section style={section}>
      <div style={row}>
        {previous ? (
          <Link href={previous.href} style={prevLink}>
            <span style={eyebrow}>← Chapitre précédent</span>
            <span style={label}>{previous.label}</span>
          </Link>
        ) : (
          <span />
        )}

        {next && (
          <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
            <Link href={next.href} style={nextLink}>
              <span style={eyebrow}>Chapitre suivant →</span>
              <span style={label}>{next.label}</span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

const section: React.CSSProperties = {
  padding: "50px 20px",
  borderTop: `1px solid ${colors.border}`,
};

const row: React.CSSProperties = {
  maxWidth: "1000px",
  margin: "0 auto",
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
};

const linkBase: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  textDecoration: "none",
};

const prevLink: React.CSSProperties = {
  ...linkBase,
  color: colors.textMuted,
  textAlign: "left",
};

const nextLink: React.CSSProperties = {
  ...linkBase,
  color: colors.ink,
  textAlign: "right",
  alignItems: "flex-end",
};

const eyebrow: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: colors.gold,
};

const label: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 800,
};
