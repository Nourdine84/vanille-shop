"use client";

import { useRouter } from "next/navigation";

type BackButtonProps = {
  label?: string;
  fallback?: string;
};

export default function BackButton({
  label = "Retour",
  fallback = "/",
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button
      onClick={handleBack}
      style={button}
      aria-label={label}
    >
      <span style={icon}>←</span>
      <span>{label}</span>
    </button>
  );
}

/* =========================
   STYLE
========================= */

const button: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",

  background: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(10px)",

  border: "1px solid rgba(0,0,0,0.06)",
  borderRadius: "999px",

  padding: "10px 18px",

  fontSize: "14px",
  fontWeight: 700,
  color: "#1a1a1a",

  cursor: "pointer",

  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",

  transition: "all 0.2s ease",
};

const icon: React.CSSProperties = {
  fontSize: "18px",
  lineHeight: 1,
};