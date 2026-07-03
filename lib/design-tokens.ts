/**
 * Design tokens partagés pour l'univers "La Maison Vanille'Or".
 * Formalise la charte déjà utilisée ailleurs sur le site (accueil,
 * Centre de Confiance) sans rien modifier de l'existant.
 */

export const colors = {
  cream: "#f8f5ef",
  white: "#ffffff",
  ink: "#111111",
  inkSoft: "#333333",
  textMuted: "#666666",
  gold: "#a16207",
  goldLight: "#d4af37",
  goldSoft: "#fff7ed",
  border: "#e7dfd3",
};

export const gradients = {
  heroOverlay: "linear-gradient(135deg,#000000cc,#2a2117cc)",
  heroOverlaySoft: "linear-gradient(135deg,#000000a6,#2a2117a6)",
  gold: "linear-gradient(135deg,#b7791f,#8b5e14)",
};

export const radii = {
  card: "22px",
  pill: "999px",
  soft: "14px",
};

export const shadows = {
  card: "0 10px 30px rgba(0,0,0,0.05)",
  lifted: "0 20px 50px rgba(0,0,0,0.12)",
};

export const spacing = {
  sectionY: "110px",
  sectionYMobile: "60px",
};

export const motionDefaults = {
  viewport: { once: true, margin: "-15% 0px" },
  transition: { duration: 0.6, ease: "easeOut" },
};
