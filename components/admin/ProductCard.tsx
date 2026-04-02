"use client";

export default function ProductCard({ product }: any) {
  const isOut = product.stock <= 0;

  return (
    <div
      style={card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow =
          "0 12px 28px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 4px 12px rgba(0,0,0,0.06)";
      }}
    >
      <div style={imageWrapper}>
        {product.imageUrl ? (
          <img src={product.imageUrl} style={productImage} />
        ) : (
          <div style={noImage}>No image</div>
        )}

        {product.badge && (
          <div style={badgeOverlay}>{product.badge}</div>
        )}
      </div>

      <div style={content}>
        <h3 style={name}>{product.name}</h3>

        <p style={categoryText}>{product.category}</p>

        <p style={price}>
          {(product.priceCents / 100).toFixed(2)} €
        </p>

        <div style={statusRow}>
          <span
            style={{
              ...dot,
              background: product.isActive ? "#16a34a" : "#6b7280",
            }}
          />
          {product.isActive ? "Actif" : "Inactif"}
        </div>

        <p
          style={{
            color: isOut ? "#dc2626" : "#16a34a",
            fontWeight: "bold",
          }}
        >
          {isOut ? "Rupture" : `Stock: ${product.stock}`}
        </p>

        <a href={`/admin/products/${product.id}`} style={editBtn}>
          ✏️ Modifier
        </a>
      </div>
    </div>
  );
}

/* STYLE */

const card = {
  background: "white",
  borderRadius: 14,
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  transition: "all 0.25s ease",
  cursor: "pointer",
};

const imageWrapper = { position: "relative" as const };

const productImage = {
  width: "100%",
  height: 180,
  objectFit: "cover" as const,
};

const noImage = {
  height: 180,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#eee",
};

const badgeOverlay = {
  position: "absolute" as const,
  top: 10,
  left: 10,
  background: "#f59e0b",
  color: "white",
  padding: "6px 10px",
  borderRadius: 999,
  fontSize: 12,
};

const content = { padding: 15 };

const name = { margin: "0 0 5px 0" };

const categoryText = {
  color: "#777",
  fontSize: 12,
  marginBottom: 10,
};

const price = {
  fontWeight: "bold",
  marginBottom: 10,
};

const statusRow = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  marginBottom: 8,
};

const dot = {
  width: 8,
  height: 8,
  borderRadius: "50%",
};

const editBtn = {
  display: "inline-block",
  marginTop: 10,
  background: "#2563eb",
  color: "white",
  padding: "8px 10px",
  borderRadius: 8,
  textDecoration: "none",
};