"use client";

import { motion } from "framer-motion";
import { colors } from "@/lib/design-tokens";

export type TimelineStep = {
  title: string;
  description: string;
};

/**
 * Frise chronologique réutilisable pour les pages "La Maison Vanille'Or"
 * (Notre histoire, Notre qualité, Notre traçabilité, Nos producteurs).
 * Ligne verticale continue sur desktop, empilement simplifié sur mobile.
 */
export default function Timeline({
  eyebrow,
  title,
  steps,
}: {
  eyebrow: string;
  title: string;
  steps: TimelineStep[];
}) {
  return (
    <section style={section}>
      <div style={header}>
        <p style={eyebrowStyle}>{eyebrow}</p>
        <h2 style={titleStyle}>{title}</h2>
      </div>

      <ol style={track}>
        <div style={line} aria-hidden="true" />

        {steps.map((step, i) => (
          <motion.li
            key={step.title}
            style={stepBox}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <div style={dot} aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </div>

            <div style={stepContent}>
              <h3 style={stepTitle}>{step.title}</h3>
              <p style={stepDesc}>{step.description}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}

const section: React.CSSProperties = {
  padding: "90px 20px",
  background: colors.white,
};

const header: React.CSSProperties = {
  textAlign: "center",
  maxWidth: "700px",
  margin: "0 auto 70px",
};

const eyebrowStyle: React.CSSProperties = {
  color: colors.gold,
  fontWeight: 700,
  letterSpacing: "0.15em",
  fontSize: "12px",
  textTransform: "uppercase",
  marginBottom: "14px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "clamp(26px,4vw,38px)",
  fontWeight: 800,
  color: colors.ink,
};

const track: React.CSSProperties = {
  position: "relative",
  maxWidth: "700px",
  margin: "0 auto",
  padding: 0,
  listStyle: "none",
  display: "grid",
  gap: "50px",
};

const line: React.CSSProperties = {
  position: "absolute",
  top: 0,
  bottom: 0,
  left: "23px",
  width: "2px",
  background: colors.border,
};

const stepBox: React.CSSProperties = {
  position: "relative",
  display: "flex",
  gap: "24px",
  alignItems: "flex-start",
};

const dot: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
  flexShrink: 0,
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  background: colors.cream,
  border: `2px solid ${colors.goldLight}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "13px",
  fontWeight: 800,
  color: colors.gold,
};

const stepContent: React.CSSProperties = {
  paddingTop: "8px",
};

const stepTitle: React.CSSProperties = {
  fontSize: "18px",
  fontWeight: 800,
  color: colors.ink,
  marginBottom: "8px",
};

const stepDesc: React.CSSProperties = {
  fontSize: "15px",
  color: colors.textMuted,
  lineHeight: 1.7,
};
