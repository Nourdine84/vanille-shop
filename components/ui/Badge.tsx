import React from "react";

type Props = {
  children: React.ReactNode;
  variant?: "success" | "error" | "info" | "default";
};

export default function Badge({ children, variant = "default" }: Props) {
  const getColor = () => {
    switch (variant) {
      case "success":
        return "#16a34a";
      case "error":
        return "#dc2626";
      case "info":
        return "#2563eb";
      default:
        return "#6b7280";
    }
  };

  return (
    <span
      style={{
        background: getColor(),
        color: "#fff",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "12px",
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}