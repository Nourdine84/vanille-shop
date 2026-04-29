"use client";

export default function ProductCard({ product }: any) {
  const isOut = product.stock <= 0;

  /* =========================
     IMAGE SAFE
  ========================= */
  const imageSrc =
    product.imageUrl && product.imageUrl !== ""
      ? product.imageUrl
      : "/products/default.jpg";

  /* =========================
     BADGE LOGIC (🔥 PRO)
  ========================= */
  function getBadge() {
    if (isOut) {
      return { label: "Épuisé", color: "#dc2626" };
    }

    if (product.badge) {
      return { label: product.badge, color: "#a16207" };
    }

    if (product.isBestSeller) {
      return { label: "Best Seller", color: "#16a34a" };
    }

    if (product.isNew) {
      return { label: "Nouveau", color: "#2563eb" };
    }

    if (product.isPromo) {
      return { label: "Promo", color: "#f59e0b" };
    }

    return null;
  }

  const badge = getBadge();

  return (
    <div
      style={{
        ...card,
        opacity: isOut ? 0.85 : 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow =
          "0 16px 32px rgba(0,0,0,0.18)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 4px 12px rgba(0,0,0,0.06)";
      }}
    >
      <div style={imageWrapper}>
        <img
          src={imageSrc}
          style={{
            ...productImage,
            filter: isOut ? "grayscale(60%)" : "none",
          }}
          alt={product.name}
          onError={(e) => {
            const target = e.currentTarget;
            target.src = "/products/default.jpg";
          }}
        />

        {/* ================= BADGE ================= */}
        {badge && (
          <div
            style={{
              ...badgeOverlay,
              background: badge.color,
              boxShadow:
                badge.label === "Promo"
                  ? "0 0 12px rgba(245,158,11,0.6)"
                  : "none",
            }}
          >
            {badge.label}
          </div>
        )}
      </div>

      <div style={content}>
        <h3 style={name}>{product.name}</h3>

        <p style={categoryText}>{product.category}</p>

        <p style={price}>
          {(product.priceCents / 100).toFixed(2)} €
        </p>

        {/* ================= STATUS ================= */}
        <div style={statusRow}>
          <span
            style={{
              ...dot,
              background: product.isActive ? "#16a34a" : "#6b7280",
            }}
          />
          {product.isActive ? "Actif" : "Inactif"}
        </div>

        {/* ================= STOCK ================= */}
        <p
          style={{
            color: isOut ? "#dc2626" : "#16a34a",
            fontWeight: "bold",
          }}
        >
          {isOut ? "Rupture de stock" : `Stock: ${product.stock}`}
        </p>

        {/* ================= ACTION ================= */}
        <a
          href={`/admin/products/${product.id}`}
          style={{
            ...editBtn,
            opacity: isOut ? 0.7 : 1,
          }}
        >
          ✏️ Modifier
        </a>
      </div>
    </div>
  );
}

/* ================= STYLE ================= */

const card = {
  background: "white",
  borderRadius: 16,
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

const badgeOverlay = {
  position: "absolute" as const,
  top: 12,
  left: 12,
  color: "white",
  padding: "6px 12px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.3px",
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