"use client";

import { motion } from "framer-motion";
import { colors } from "@/lib/design-tokens";

export type Stat = {
  value: string;
  label: string;
};

export default function StatBand({ stats }: { stats: Stat[] }) {
  return (
    <section style={section}>
      <div style={grid}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            style={item}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <p style={value}>{stat.value}</p>
            <p style={label}>{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const section: React.CSSProperties = {
  padding: "70px 20px",
  background: colors.ink,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))",
  gap: "30px",
  maxWidth: "1000px",
  margin: "0 auto",
  textAlign: "center",
};

const item: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const value: React.CSSProperties = {
  fontSize: "clamp(30px,4vw,44px)",
  fontWeight: 800,
  color: colors.goldLight,
};

const label: React.CSSProperties = {
  fontSize: "13px",
  color: "#ddd",
  letterSpacing: "0.04em",
};
