"use client";

import { useState } from "react";

export default function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    try {
      setLoading(true);

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Suppression impossible");
      }

      window.location.href = "/admin/products?success=delete";
    } catch (error) {
      console.error("❌ DELETE PRODUCT ERROR:", error);
      window.location.href = "/admin/products?error=delete";
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={deleteBtn}
      >
        Supprimer
      </button>

      {open && (
        <div style={overlay} onClick={() => setOpen(false)}>
          <div style={modal} onClick={(e) => e.stopPropagation()}>
            <div style={iconWrap}>🗑️</div>

            <h3 style={modalTitle}>Confirmer la suppression</h3>

            <p style={modalText}>
              Voulez-vous vraiment supprimer le produit{" "}
              <strong>{productName}</strong> ?
            </p>

            <div style={actions}>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={cancelBtn}
                disabled={loading}
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleDelete}
                style={confirmBtn}
                disabled={loading}
              >
                {loading ? "Suppression..." : "Oui, supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const deleteBtn = {
  flex: 1,
  minWidth: 110,
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "10px 12px",
  borderRadius: 10,
  fontWeight: 700,
  cursor: "pointer",
};

const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  padding: 16,
};

const modal = {
  background: "white",
  borderRadius: 18,
  padding: 24,
  width: "100%",
  maxWidth: 420,
  boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
  textAlign: "center" as const,
};

const iconWrap = {
  fontSize: 30,
  marginBottom: 12,
};

const modalTitle = {
  margin: "0 0 10px",
  fontSize: 22,
};

const modalText = {
  margin: "0 0 22px",
  color: "#555",
  lineHeight: 1.6,
};

const actions = {
  display: "flex",
  gap: 10,
  justifyContent: "center",
};

const cancelBtn = {
  flex: 1,
  background: "#f3f4f6",
  color: "#111",
  border: "1px solid #e5e7eb",
  padding: "12px 14px",
  borderRadius: 12,
  fontWeight: 600,
  cursor: "pointer",
};

const confirmBtn = {
  flex: 1,
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "12px 14px",
  borderRadius: 12,
  fontWeight: 700,
  cursor: "pointer",
};