import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import ProductToggle from "@/components/admin/ProductToggle";
import { getImageUrl } from "@/lib/image";
import type { CSSProperties } from "react";
import { styles } from "@/lib/styles";
import ProductInlineEdit from "@/components/admin/ProductInlineEdit";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default async function AdminProductsPage() {
  const isAdmin = cookies().get("admin")?.value === "true";

  if (!isAdmin) redirect("/admin/login");

  let products: any[] = [];

  try {
    products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch (e) {
    console.error(e);
  }

  /* KPI */
  const total = products.length;
  const active = products.filter((p) => p.isActive).length;
  const out = products.filter((p) => p.stock <= 0).length;

  return (
    <div style={container}>
      <h1 style={title}>🛠 Produits</h1>

      {/* KPI */}
      <div style={kpiGrid}>
        <Kpi label="Produits" value={total} />
        <Kpi label="Actifs" value={active} />
        <Kpi label="Rupture" value={out} />
      </div>

      {/* CREATE */}
      <div style={card}>
        <h2>➕ Ajouter un produit</h2>
        <ProductForm />
      </div>

      {/* LIST */}
      <div style={grid}>
        {products.map((p) => {
          const img = getImageUrl(p.imageUrl);

          return (
            <div key={p.id} style={productCard}>
              <img src={img} style={image} />

              <div style={content}>
                <h3>{p.name}</h3>

                {p.badge && <span style={badge}>{p.badge}</span>}

                <p style={price}>{formatPrice(p.priceCents)}</p>

                <p style={stock}>
                  Stock :{" "}
                  <strong>
                    {p.stock <= 0 ? "Rupture" : p.stock}
                  </strong>
                </p>

                {/* 🔥 TOGGLE LIVE */}
                <ProductToggle
                  productId={p.id}
                  initialState={p.isActive}
                />

                <div style={actions}>
                  <a href={`/admin/products/${p.id}`} style={editBtn}>
                    ✏️
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

function Kpi({ label, value }: any) {
  return (
    <div style={kpiCard}>
      <p style={kpiLabel}>{label}</p>
      <h3>{value}</h3>
    </div>
  );
}

/* ================= STYLE ================= */

const container = { padding: 30 };

const title = { fontSize: 28, marginBottom: 20 };

const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: 20,
  marginBottom: 20,
};

const kpiCard = {
  background: "white",
  padding: 20,
  borderRadius: 12,
};

const kpiLabel = { fontSize: 12, color: "#777" };

const card = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  marginBottom: 20,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: 20,
};

const productCard = {
  background: "white",
  borderRadius: 14,
  overflow: "hidden",
};

const image: CSSProperties = {
  width: "100%",
  height: 180,
  objectFit: "cover",
};

const content = { padding: 15 };

const price = { fontWeight: 700 };

const stock = { fontSize: 13 };

const badge = {
  background: "#f59e0b",
  color: "white",
  padding: "4px 8px",
  borderRadius: 6,
  fontSize: 12,
};

const actions = {
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