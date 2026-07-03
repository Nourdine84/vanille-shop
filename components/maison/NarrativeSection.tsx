"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { colors } from "@/lib/design-tokens";

export default function NarrativeSection({
  eyebrow,
  title,
  children,
  image,
  imageAlt,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  image: string;
  imageAlt: string;
  reverse?: boolean;
}) {
  return (
    <section style={section}>
      <div
        style={{
          ...grid,
          flexDirection: reverse ? "row-reverse" : "row",
        }}
      >
        <motion.div
          style={imageBox}
          initial={{ opacity: 0, x: reverse ? 40 : -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <img src={image} alt={imageAlt} style={imgStyle} />
        </motion.div>

        <motion.div
          style={textBox}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          <p style={eyebrowStyle}>{eyebrow}</p>
          <h2 style={titleStyle}>{title}</h2>
          <div style={bodyStyle}>{children}</div>
        </motion.div>
      </div>
    </section>
  );
}

const section: React.CSSProperties = {
  padding: "90px 20px",
};

const grid: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "60px",
  alignItems: "center",
  maxWidth: "1160px",
  margin: "0 auto",
};

const imageBox: React.CSSProperties = {
  flex: "1 1 420px",
};

const imgStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "22px",
  objectFit: "cover",
  aspectRatio: "4 / 3",
  boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
};

const textBox: React.CSSProperties = {
  flex: "1 1 380px",
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
  lineHeight: 1.2,
  marginBottom: "20px",
};

const bodyStyle: React.CSSProperties = {
  color: colors.textMuted,
  fontSize: "16px",
  lineHeight: 1.8,
};
