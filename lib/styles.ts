import type { CSSProperties } from "react";

export const styles: Record<string, CSSProperties> = {
  image: {
    width: "100%",
    height: 180,
    objectFit: "cover",
  },

  editBtn: {
    flex: 1,
    background: "#111",
    color: "white",
    padding: 8,
    borderRadius: 8,
    textAlign: "center",
    textDecoration: "none",
  },

  productCard: {
    background: "white",
    borderRadius: 14,
    overflow: "hidden",
  },
};