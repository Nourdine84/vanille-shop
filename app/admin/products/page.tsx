import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import ProductToggle from "@/components/admin/ProductToggle";
import { getImageUrl } from "@/lib/image";
import type { CSSProperties } from "react";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/* ================= TYPES ================= */

type Product = {
  id: string;
  name: string;
  priceCents: number;
  imageUrl: string;
  stock: number;
  isActive: boolean;
  badge?: string | null;
  isPack: boolean;
  packItems?: string | null;
};

/* ================= UTILS ================= */

function formatPrice(priceCents: number) {
  const safe = Number(priceCents) || 0;
  return (safe / 100).toFixed(2).replace(".", ",") + " €";
}

/* ================= PAGE ================= */

export default async function AdminProductsPage() {
  const isAdmin = cookies().get("admin")?.value === "true";

  if (!isAdmin) redirect("/admin/login");

  let products: Product[] = [];

  try {
    products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch (e) {
    console.error("❌ ADMIN PRODUCTS ERROR:", e);
  }

  const total = products.length;
  const active = products.filter((p) => p.isActive).length;
  const out = products.filter((p) => p.stock <= 0).length;
  const packs = products.filter((p) => p.isPack).length;

  return (
    <div style={container} data-testid="admin-products-page">
      <h1 style={title}>🛠 Admin Produits</h1>

      <div style={kpiGrid}>
        <Kpi label="Produits" value={total} />
        <Kpi label="Actifs" value={active} />
        <Kpi label="Rupture" value={out} />
        <Kpi label="Packs" value={packs} />
      </div>

      <div style={card} data-testid="admin-products-create">
        <h2>➕ Ajouter un produit</h2>
        <ProductForm />
      </div>

      <div style={grid} data-testid="admin-products-list">
        {products.map((p) => {
          const img = getImageUrl(p.imageUrl);

          return (
            <div key={p.id} style={productCard} data-testid="admin-product-card">
              <div style={imageWrapper}>
                <img src={img} alt={p.name} style={image} />

                {p.isPack && <span style={packBadge}>PACK</span>}
                {p.badge && <span style={badge}>{p.badge}</span>}
              </div>

              <div style={content}>
                <h3 style={name}>{p.name}</h3>

                {p.packItems && <p style={packDesc}>{p.packItems}</p>}

                <p style={price}>{formatPrice(p.priceCents)}</p>

                <p style={stock}>
                  Stock :{" "}
                  <strong>{p.stock <= 0 ? "Rupture" : p.stock}</strong>
                </p>

                <ProductToggle
                  productId={p.id}
                  initialState={p.isActive}
                />

                <div style={actions}>
                  <a
                    href={`/admin/products/${p.id}`}
                    style={editBtn}
                    data-testid="admin-product-edit"
                  >
                    ✏️ Modifier
                  </a>

                  <DeleteProductButton
                    productId={p.id}
                    productName={p.name}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Kpi({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div style={kpiCard}>
      <p style={kpiLabel}>{label}</p>
      <h3>{value}</h3>
    </div>
  );
}

/* ================= STYLES ================= */

const container: CSSProperties = {
  padding: 30,
};

const title: CSSProperties = {
  fontSize: 28,
  marginBottom: 20,
};

const kpiGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
  gap: 20,
  marginBottom: 20,
};

const kpiCard: CSSProperties = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  textAlign: "center",
};

const kpiLabel: CSSProperties = {
  fontSize: 12,
  color: "#777",
};

const card: CSSProperties = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  marginBottom: 20,
};

const grid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: 20,
};

const productCard: CSSProperties = {
  background: "white",
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: "0 8px 25px rgba(0,0,0,0.05)",
};

const imageWrapper: CSSProperties = {
  position: "relative",
};

const image: CSSProperties = {
  width: "100%",
  height: 180,
  objectFit: "cover",
};

const packBadge: CSSProperties = {
  position: "absolute",
  top: 10,
  left: 10,
  background: "#a16207",
  color: "white",
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 700,
};

const badge: CSSProperties = {
  position: "absolute",
  top: 10,
  right: 10,
  background: "#f59e0b",
  color: "white",
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 11,
};

const content: CSSProperties = {
  padding: 15,
};

const name: CSSProperties = {
  marginBottom: 6,
};

const price: CSSProperties = {
  fontWeight: 700,
  color: "#a16207",
};

const stock: CSSProperties = {
  fontSize: 13,
};

const packDesc: CSSProperties = {
  fontSize: 12,
  color: "#666",
  marginBottom: 6,
};

const actions: CSSProperties = {
  display: "flex",
  gap: 10,
  marginTop: 10,
};

const editBtn: CSSProperties = {
  flex: 1,
  background: "#111",
  color: "white",
  padding: 8,
  borderRadius: 8,
  textAlign: "center",
  textDecoration: "none",
};