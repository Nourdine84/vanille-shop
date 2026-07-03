"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { colors, gradients } from "@/lib/design-tokens";

export default function MaisonCTA({
  title,
  text,
  primary,
  secondary,
}: {
  title: string;
  text: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section style={section}>
      <motion.div
        style={box}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 style={titleStyle}>{title}</h2>
        <p style={textStyle}>{text}</p>

        <div style={actions}>
          <Link href={primary.href} style={primaryBtn}>
            {primary.label}
          </Link>

          {secondary && (
            <Link href={secondary.href} style={secondaryBtn}>
              {secondary.label}
            </Link>
          )}
        </div>
      </motion.div>
    </section>
  );
}

const section: React.CSSProperties = {
  padding: "100px 20px",
  textAlign: "center",
};

const box: React.CSSProperties = {
  maxWidth: "640px",
  margin: "0 auto",
};

const titleStyle: React.CSSProperties = {
  fontSize: "clamp(28px,4vw,40px)",
  fontWeight: 800,
  color: colors.ink,
  marginBottom: "18px",
};

const textStyle: React.CSSProperties = {
  color: colors.textMuted,
  lineHeight: 1.8,
  marginBottom: "34px",
};

const actions: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "14px",
};

const primaryBtn: React.CSSProperties = {
  background: gradients.gold,
  color: colors.white,
  padding: "16px 28px",
  borderRadius: "14px",
  textDecoration: "none",
  fontWeight: 700,
};

const secondaryBtn: React.CSSProperties = {
  background: "transparent",
  color: colors.ink,
  padding: "16px 28px",
  borderRadius: "14px",
  textDecoration: "none",
  fontWeight: 700,
  border: `1px solid ${colors.border}`,
};
