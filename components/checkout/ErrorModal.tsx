"use client";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ErrorModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2 style={title}>❌ Paiement échoué</h2>

        <p style={text}>
          Une erreur est survenue lors du paiement.  
          Vérifiez vos informations ou réessayez.
        </p>

        <button style={primaryBtn} onClick={onClose}>
          Réessayer
        </button>

        <button style={secondaryBtn} onClick={onClose}>
          Continuer mes achats
        </button>
      </div>
    </div>
  );
}

/* 🎨 STYLE ISO */

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2000,
};

const modal = {
  background: "white",
  padding: "30px",
  borderRadius: "16px",
  width: "320px",
  textAlign: "center" as const,
  boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
};

const title = {
  marginBottom: "10px",
};

const text = {
  fontSize: "14px",
  color: "#666",
  marginBottom: "20px",
};

const primaryBtn = {
  width: "100%",
  padding: "12px",
  background: "#a16207",
  color: "white",
  borderRadius: "10px",
  border: "none",
  marginBottom: "10px",
  cursor: "pointer",
};

const secondaryBtn = {
  width: "100%",
  padding: "10px",
  background: "#f3f4f6",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
};