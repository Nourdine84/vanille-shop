"use client";

export default function ProductPreviewModal({
  product,
  onClose,
}: any) {
  if (!product) return null;

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        
        {/* IMAGE */}
        {product.imageUrl && (
          <img src={product.imageUrl} style={image} />
        )}

        {/* CONTENT */}
        <h2>{product.name}</h2>

        {product.badge && (
          <span style={badge}>{product.badge}</span>
        )}

        <p style={price}>
          {(product.priceCents / 100).toFixed(2)} €
        </p>

        <p style={desc}>{product.description}</p>

        <a
          href={`/admin/products/${product.id}`}
          style={btn}
        >
          ✏️ Modifier
        </a>
      </div>
    </div>
  );
}

/* STYLE */

const overlay = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modal = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  maxWidth: 400,
  width: "90%",
};

const image = {
  width: "100%",
  borderRadius: 10,
  marginBottom: 10,
};

const badge = {
  display: "inline-block",
  background: "#f59e0b",
  color: "white",
  padding: "4px 8px",
  borderRadius: 8,
  fontSize: 12,
  marginBottom: 10,
};

const price = {
  fontWeight: "bold",
  marginBottom: 10,
};

const desc = {
  color: "#666",
  marginBottom: 15,
};

const btn = {
  display: "inline-block",
  background: "#2563eb",
  color: "white",
  padding: "8px 12px",
  borderRadius: 8,
  textDecoration: "none",
};