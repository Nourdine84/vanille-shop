import React from "react";

type Props = {
  title: string;
  subtitle?: string;
};

export default function SectionTitle({ title, subtitle }: Props) {
  return (
    <div style={{ marginBottom: "30px" }}>
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "700",
          marginBottom: subtitle ? "8px" : "0",
        }}
      >
        {title}
      </h2>

      {subtitle && (
        <p style={{ color: "#6b7280", fontSize: "14px" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}