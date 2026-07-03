"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { colors, gradients } from "@/lib/design-tokens";

export default function CinematicHero({
  tag,
  title,
  subtitle,
  image,
  badge,
  cta,
}: {
  tag: string;
  title: string;
  subtitle: string;
  image: string;
  badge?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <section style={hero}>
      <div
        style={{
          ...bg,
          backgroundImage: `url('${image}')`,
        }}
      />
      <div style={overlay} />

      <motion.div
        style={content}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {badge && <span style={badgeStyle}>{badge}</span>}

        <p style={tagStyle}>{tag}</p>
        <h1 style={titleStyle}>{title}</h1>
        <p style={subtitleStyle}>{subtitle}</p>

        {cta && (
          <Link href={cta.href} style={ctaStyle}>
            {cta.label}
          </Link>
        )}
      </motion.div>

      <motion.div
        style={scrollCue}
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        aria-hidden="true"
      >
        ↓
      </motion.div>
    </section>
  );
}

const hero: React.CSSProperties = {
  position: "relative",
  minHeight: "92vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const bg: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const overlay: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: gradients.heroOverlay,
};

const content: React.CSSProperties = {
  position: "relative",
  textAlign: "center",
  color: colors.white,
  maxWidth: "820px",
  padding: "0 24px",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-block",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.3)",
  borderRadius: "999px",
  padding: "6px 16px",
  fontSize: "12px",
  fontWeight: 700,
  marginBottom: "20px",
};

const ctaStyle: React.CSSProperties = {
  display: "inline-block",
  marginTop: "30px",
  background: colors.goldLight,
  color: "#1a1400",
  padding: "15px 30px",
  borderRadius: "14px",
  textDecoration: "none",
  fontWeight: 700,
};

const tagStyle: React.CSSProperties = {
  color: colors.goldLight,
  letterSpacing: "0.3em",
  fontWeight: 800,
  fontSize: "13px",
  marginBottom: "18px",
};

const titleStyle: React.CSSProperties = {
  fontSize: "clamp(34px,6vw,58px)",
  fontWeight: 800,
  lineHeight: 1.15,
  marginBottom: "22px",
};

const subtitleStyle: React.CSSProperties = {
  fontSize: "18px",
  lineHeight: 1.7,
  color: "#ddd",
  maxWidth: "640px",
  margin: "0 auto",
};

const scrollCue: React.CSSProperties = {
  position: "absolute",
  bottom: "28px",
  left: "50%",
  transform: "translateX(-50%)",
  color: "white",
  fontSize: "20px",
  opacity: 0.7,
};
