"use client";

import { useRouter } from "next/navigation";

type Props = {
  label?: string;
  fallback?: string;
};

export default function AdminBackButton({
  label = "Retour",
  fallback = "/admin",
}: Props) {
  const router = useRouter();

  function handleBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  }

  return (
    <button
      onClick={handleBack}
      style={button}
    >
      <span style={arrow}>
        ←
      </span>

      <span>{label}</span>
    </button>
  );
}

/* =========================
   STYLES
========================= */

const button: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,

  background: "white",
  color: "#111",

  border: "1px solid #e5e7eb",
  borderRadius: 999,

  padding: "12px 18px",

  fontWeight: 700,
  fontSize: 14,

  cursor: "pointer",

  boxShadow: "0 6px 20px rgba(0,0,0,0.05)",

  transition: "all 0.2s ease",
};

const arrow: React.CSSProperties = {
  fontSize: 18,
  lineHeight: 1,
};