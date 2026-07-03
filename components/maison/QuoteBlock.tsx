"use client";

import { motion } from "framer-motion";
import { colors } from "@/lib/design-tokens";

export default function QuoteBlock({
  quote,
  signature,
}: {
  quote: string;
  signature?: string;
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
        <p style={mark} aria-hidden="true">
          “
        </p>
        <p style={text}>{quote}</p>
        {signature && <p style={sign}>{signature}</p>}
      </motion.div>
    </section>
  );
}

const section: React.CSSProperties = {
  padding: "80px 20px",
  background: colors.goldSoft,
};

const box: React.CSSProperties = {
  maxWidth: "760px",
  margin: "0 auto",
  textAlign: "center",
};

const mark: React.CSSProperties = {
  fontSize: "60px",
  color: colors.goldLight,
  lineHeight: 1,
  marginBottom: "0",
};

const text: React.CSSProperties = {
  fontSize: "clamp(20px,3vw,28px)",
  fontWeight: 600,
  color: colors.ink,
  lineHeight: 1.5,
  fontStyle: "italic",
};

const sign: React.CSSProperties = {
  marginTop: "22px",
  color: colors.gold,
  fontWeight: 700,
  fontSize: "14px",
};
