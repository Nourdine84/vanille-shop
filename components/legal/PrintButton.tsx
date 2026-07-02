"use client";

export default function PrintButton({
  label = "Imprimer ce document",
}: {
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print"
      aria-label={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        background: "white",
        color: "#a16207",
        border: "1px solid #e7dfd3",
        borderRadius: "12px",
        padding: "10px 18px",
        fontWeight: 700,
        fontSize: "13px",
        cursor: "pointer",
      }}
    >
      🖨️ {label}
    </button>
  );
}
