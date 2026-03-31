"use client";

import { useEffect } from "react";

export default function Error({
  error: _error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("❌ Global error:", _error);
  }, [_error]);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Une erreur est survenue</h2>

      <button
        onClick={() => reset()}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#a16207",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Réessayer
      </button>
    </div>
  );
}