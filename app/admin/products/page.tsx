import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import ProductToggle from "@/components/admin/ProductToggle";
import { getImageUrl } from "@/lib/image";
import type { CSSProperties } from "react";
import AdminBackButton from "@/components/admin/AdminBackButton";

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
  category?: string;
};

type SearchParams = {
  search?: string;
  category?: string;
  status?: string;
};

/* ================= UTILS ================= */

function formatPrice(priceCents: number) {
  const safe = Number(priceCents) || 0;

  return (safe / 100)
    .toFixed(2)
    .replace(".", ",") + " €";
}

/* ================= PAGE ================= */

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const isAdmin =
    cookies().get("admin")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const search =
    searchParams?.search?.trim() || "";

  const category =
    searchParams?.category?.trim() || "";

  const status =
    searchParams?.status?.trim() || "";

  let products: Product[] = [];

  try {
    const where: any = {};

    /* ================= SEARCH ================= */

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          slug: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    /* ================= CATEGORY ================= */

    if (category && category !== "all") {
      where.category = category;
    }

    /* ================= STATUS ================= */

    if (status === "active") {
      where.isActive = true;
    }

    if (status === "inactive") {
      where.isActive = false;
    }

    if (status === "out") {
      where.stock = {
        lte: 0,
      };
    }

    products = await prisma.product.findMany({
      where,

      orderBy: {
        createdAt: "desc",
      },

      take: 100,
    });

    console.log(
      "📦 ADMIN PRODUCTS:",
      products.length
    );

  } catch (e) {
    console.error(
      "❌ ADMIN PRODUCTS ERROR:",
      e
    );
  }

  const total = products.length;

  const active = products.filter(
    (p) => p.isActive
  ).length;

  const inactive = products.filter(
    (p) => !p.isActive
  ).length;

  const out = products.filter(
    (p) => p.stock <= 0
  ).length;

  const lowStock = products.filter(
    (p) => p.stock > 0 && p.stock <= 5
  ).length;

  return (
    <div
      style={container}
      data-testid="admin-products-page"
    >
      <AdminBackButton
        label="Retour dashboard"
        fallback="/admin"
      />

      <br />
      <br />
      {/* HERO */}
      <div style={hero}>
        <div>
          <p style={heroTag}>
            VANILLE’OR ADMIN
          </p>

          <h1 style={title}>
            Gestion des produits
          </h1>

          <p style={heroText}>
            Gérez votre catalogue premium,
            vos stocks et vos produits.
          </p>
        </div>

        <div style={heroBadge}>
          {total} produits
        </div>
      </div>

      {/* KPI */}
      <div style={kpiGrid}>
        <Kpi
          label="Produits"
          value={total}
        />

        <Kpi
          label="Actifs"
          value={active}
        />

        <Kpi
          label="Inactifs"
          value={inactive}
        />

        <Kpi
          label="Rupture"
          value={out}
          danger
        />

        <Kpi
          label="Stock faible"
          value={lowStock}
          warning
        />
      </div>

      {/* FILTERS */}
      <div style={filterCard}>
        <form
          method="GET"
          style={filtersRow}
        >
          <input
            type="text"
            name="search"
            placeholder="Rechercher un produit..."
            defaultValue={search}
            style={searchInput}
          />

          <select
            name="category"
            defaultValue={category}
            style={input}
          >
            <option value="all">
              Toutes catégories
            </option>

            <option value="vanille">
              Vanille
            </option>

            <option value="epices">
              Épices
            </option>

            <option value="pack">
              Packs
            </option>
          </select>

          <select
            name="status"
            defaultValue={status}
            style={input}
          >
            <option value="">
              Tous statuts
            </option>

            <option value="active">
              Actifs
            </option>

            <option value="inactive">
              Inactifs
            </option>

            <option value="out">
              Rupture
            </option>
          </select>

          <button
            type="submit"
            style={filterBtn}
          >
            Filtrer
          </button>
        </form>
      </div>

      {/* CREATE */}
      <div
        style={createCard}
        data-testid="admin-products-create"
      >
        <div style={createHeader}>
          <div>
            <h2 style={createTitle}>
              ➕ Ajouter un produit
            </h2>

            <p style={createText}>
              Créez un nouveau produit
              premium Vanille’Or.
            </p>
          </div>
        </div>

        <ProductForm />
      </div>

      {/* PRODUCTS */}
      <div
        style={grid}
        data-testid="admin-products-list"
      >
        {products.map((p) => {
          const img = getImageUrl(
            p.imageUrl
          );

          const isOut =
            Number(p.stock) <= 0;

          const isLow =
            Number(p.stock) > 0 &&
            Number(p.stock) <= 5;

          return (
            <div
              key={p.id}
              style={productCard}
              data-testid="admin-product-card"
            >
              {/* IMAGE */}
              <div style={imageWrapper}>
                <img
                  src={img}
                  alt={p.name}
                  style={image}
                />

                {p.isPack && (
                  <span style={packBadge}>
                    PACK
                  </span>
                )}

                {p.badge && (
                  <span style={badge}>
                    {p.badge}
                  </span>
                )}

                {!p.isActive && (
                  <span style={inactiveBadge}>
                    INACTIF
                  </span>
                )}
              </div>

              {/* CONTENT */}
              <div style={content}>
                <div style={topRow}>
                  <h3 style={name}>
                    {p.name}
                  </h3>

                  <span style={categoryBadge}>
                    {p.category ||
                      "Produit"}
                  </span>
                </div>

                {p.packItems && (
                  <p style={packDesc}>
                    {p.packItems}
                  </p>
                )}

                <p style={price}>
                  {formatPrice(
                    p.priceCents
                  )}
                </p>

                {/* STOCK */}
                <div
                  style={{
                    ...stockBox,

                    background: isOut
                      ? "#fee2e2"
                      : isLow
                      ? "#fff7ed"
                      : "#f3f4f6",

                    color: isOut
                      ? "#991b1b"
                      : isLow
                      ? "#9a3412"
                      : "#111827",
                  }}
                >
                  {isOut
                    ? "❌ Rupture de stock"
                    : isLow
                    ? `⚠️ Stock faible (${p.stock})`
                    : `✅ Stock : ${p.stock}`}
                </div>

                {/* TOGGLE */}
                <div style={toggleRow}>
                  <ProductToggle
                    productId={p.id}
                    initialState={
                      p.isActive
                    }
                  />
                </div>

                {/* ACTIONS */}
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
  danger,
  warning,
}: {
  label: string;
  value: number;
  danger?: boolean;
  warning?: boolean;
}) {
  return (
    <div
      style={{
        ...kpiCard,

        border: danger
          ? "1px solid #fecaca"
          : warning
          ? "1px solid #fed7aa"
          : "1px solid #eee",
      }}
    >
      <p style={kpiLabel}>
        {label}
      </p>

      <h3
        style={{
          margin: 0,

          color: danger
            ? "#dc2626"
            : warning
            ? "#c2410c"
            : "#111",
        }}
      >
        {value}
      </h3>
    </div>
  );
}

/* ================= STYLES ================= */

const container: CSSProperties = {
  padding: 30,
  background: "#f8f5ef",
  minHeight: "100vh",
};

const hero: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 20,
  flexWrap: "wrap",
  marginBottom: 30,
};

const heroTag: CSSProperties = {
  color: "#a16207",
  fontWeight: 800,
  fontSize: 12,
  letterSpacing: "0.08em",
  marginBottom: 10,
};

const heroText: CSSProperties = {
  color: "#666",
  marginTop: 10,
};

const heroBadge: CSSProperties = {
  background: "#111",
  color: "white",
  padding: "12px 18px",
  borderRadius: 999,
  fontWeight: 800,
};

const title: CSSProperties = {
  fontSize: 36,
  margin: 0,
};

const kpiGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(180px,1fr))",
  gap: 20,
  marginBottom: 24,
};

const kpiCard: CSSProperties = {
  background: "white",
  padding: 24,
  borderRadius: 20,
};

const kpiLabel: CSSProperties = {
  color: "#777",
  fontSize: 13,
  marginBottom: 12,
};

const filterCard: CSSProperties = {
  background: "white",
  padding: 20,
  borderRadius: 20,
  marginBottom: 24,
};

const filtersRow: CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
};

const searchInput: CSSProperties = {
  flex: 1,
  minWidth: 260,
  padding: 14,
  borderRadius: 12,
  border: "1px solid #ddd",
};

const input: CSSProperties = {
  padding: 14,
  borderRadius: 12,
  border: "1px solid #ddd",
};

const filterBtn: CSSProperties = {
  background:
    "linear-gradient(135deg,#b7791f,#8b5e14)",
  color: "white",
  border: "none",
  borderRadius: 12,
  padding: "14px 18px",
  fontWeight: 800,
  cursor: "pointer",
};

const createCard: CSSProperties = {
  background: "white",
  padding: 24,
  borderRadius: 24,
  marginBottom: 30,
};

const createHeader: CSSProperties = {
  marginBottom: 20,
};

const createTitle: CSSProperties = {
  margin: 0,
};

const createText: CSSProperties = {
  color: "#666",
  marginTop: 8,
};

const grid: CSSProperties = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(300px,1fr))",
  gap: 24,
};

const productCard: CSSProperties = {
  background: "white",
  borderRadius: 24,
  overflow: "hidden",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.06)",
};

const imageWrapper: CSSProperties = {
  position: "relative",
};

const image: CSSProperties = {
  width: "100%",
  height: 220,
  objectFit: "cover",
};

const packBadge: CSSProperties = {
  position: "absolute",
  top: 14,
  left: 14,
  background: "#a16207",
  color: "white",
  padding: "6px 12px",
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 800,
};

const inactiveBadge: CSSProperties = {
  position: "absolute",
  bottom: 14,
  left: 14,
  background: "#111",
  color: "white",
  padding: "6px 12px",
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 800,
};

const badge: CSSProperties = {
  position: "absolute",
  top: 14,
  right: 14,
  background: "#f59e0b",
  color: "white",
  padding: "6px 12px",
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 700,
};

const content: CSSProperties = {
  padding: 22,
};

const topRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "flex-start",
};

const categoryBadge: CSSProperties = {
  background: "#f3f4f6",
  padding: "6px 10px",
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 700,
};

const name: CSSProperties = {
  margin: 0,
  fontSize: 20,
};

const price: CSSProperties = {
  fontWeight: 800,
  color: "#a16207",
  fontSize: 22,
  marginTop: 14,
  marginBottom: 16,
};

const stockBox: CSSProperties = {
  padding: 12,
  borderRadius: 14,
  fontWeight: 700,
  fontSize: 13,
  marginBottom: 16,
};

const packDesc: CSSProperties = {
  color: "#666",
  fontSize: 13,
  marginTop: 10,
};

const toggleRow: CSSProperties = {
  marginBottom: 18,
};

const actions: CSSProperties = {
  display: "flex",
  gap: 12,
};

const editBtn: CSSProperties = {
  flex: 1,
  background: "#111",
  color: "white",
  padding: 12,
  borderRadius: 12,
  textAlign: "center",
  textDecoration: "none",
  fontWeight: 700,
};