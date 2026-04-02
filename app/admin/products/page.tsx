import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SearchParams = {
  q?: string;
  category?: string;
};

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const isAdmin = cookies().get("admin")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const query = searchParams?.q?.trim() || "";
  const category = searchParams?.category?.trim() || "";

  let products: any[] = [];

  try {
    products = await prisma.product.findMany({
      where: {
        ...(query
          ? {
              OR: [
                {
                  name: { contains: query, mode: "insensitive" },
                },
                {
                  slug: { contains: query, mode: "insensitive" },
                },
              ],
            }
          : {}),
        ...(category
          ? {
              category: {
                equals: category,
                mode: "insensitive",
              },
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("❌ PRISMA PRODUCTS ERROR:", error);
  }

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const outOfStockProducts = products.filter((p) => p.stock <= 0).length;

  return (
    <div style={container}>
      <h1 style={title}>🛠 Gestion des produits</h1>

      {/* KPI */}
      <div style={grid3}>
        <Card title="Produits" value={totalProducts} />
        <Card title="Actifs" value={activeProducts} />
        <Card title="Épuisés" value={outOfStockProducts} />
      </div>

      {/* FILTRES */}
      <div style={card}>
        <form method="GET" style={filterRow}>
          <input
            name="q"
            placeholder="Rechercher nom ou slug"
            defaultValue={query}
            style={input}
          />

          <select name="category" defaultValue={category} style={input}>
            <option value="">Toutes les catégories</option>
            <option value="vanille">Vanille</option>
            <option value="epices">Épices</option>
          </select>

          <button type="submit" style={primaryBtn}>
            Filtrer
          </button>
        </form>
      </div>

      {/* CREATE */}
      <div style={card}>
        <h2 style={sectionTitle}>➕ Ajouter un produit</h2>

        {/* ✅ CLIENT COMPONENT */}
        <ProductForm />
      </div>

      {/* LISTE */}
      <div style={listWrapper}>
        <h2 style={sectionTitle}>📦 Catalogue</h2>

        {products.length === 0 ? (
          <div style={card}>Aucun produit trouvé.</div>
        ) : (
          products.map((product) => {
            const isOutOfStock = product.stock <= 0;

            return (
              <div key={product.id} style={productCard}>
                <div style={productHeader}>
                  <div>
                    <h3 style={{ margin: 0 }}>{product.name}</h3>
                    <p style={mutedText}>/product/{product.slug}</p>
                  </div>

                  <div style={badgeRow}>
                    <Badge color={product.isActive ? "#16a34a" : "#6b7280"}>
                      {product.isActive ? "ACTIF" : "INACTIF"}
                    </Badge>

                    {isOutOfStock && (
                      <Badge color="#dc2626">ÉPUISÉ</Badge>
                    )}
                  </div>
                </div>

                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={productImage}
                  />
                ) : null}

                <div style={infoRow}>
                  <span>
                    <strong>Prix :</strong> {formatPrice(product.priceCents)}
                  </span>
                  <span>
                    <strong>Stock :</strong> {product.stock}
                  </span>
                  <span>
                    <strong>Catégorie :</strong> {product.category}
                  </span>
                </div>

                <p style={description}>{product.description}</p>

                <div style={actionButtons}>
                  <a href={`/admin/products/${product.id}`} style={editBtn}>
                    ✏️ Modifier
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div style={card}>
      <h3 style={cardTitle}>{title}</h3>
      <p style={valueStyle}>{value}</p>
    </div>
  );
}

function Badge({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <span style={{ ...statusBadge, background: color }}>
      {children}
    </span>
  );
}

/* ================= STYLES ================= */

const container = {
  padding: "40px",
  background: "#faf7f2",
  minHeight: "100vh",
};

const title = {
  fontSize: "28px",
  marginBottom: "24px",
};

const sectionTitle = {
  margin: "0 0 16px 0",
};

const grid3 = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "20px",
  marginBottom: "20px",
};

const card = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
};

const cardTitle = {
  margin: 0,
};

const valueStyle = {
  fontSize: "24px",
  fontWeight: 700,
};

const filterRow = {
  display: "flex",
  gap: "12px",
};

const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const primaryBtn = {
  background: "#a16207",
  color: "white",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
};

const listWrapper = {
  marginTop: "20px",
};

const productCard = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "16px",
};

const productHeader = {
  display: "flex",
  justifyContent: "space-between",
};

const badgeRow = {
  display: "flex",
  gap: "6px",
};

const statusBadge = {
  padding: "6px 10px",
  borderRadius: "999px",
  color: "white",
  fontSize: "12px",
};

const mutedText = {
  color: "#777",
  fontSize: "12px",
};

const infoRow = {
  display: "flex",
  gap: "12px",
  marginTop: "12px",
  flexWrap: "wrap" as const,
};

const description = {
  color: "#666",
  marginTop: "12px",
};

const productImage = {
  width: "100%",
  maxWidth: "220px",
  borderRadius: "10px",
  marginTop: "12px",
};

const actionButtons = {
  marginTop: "16px",
};

const editBtn = {
  display: "inline-block",
  background: "#2563eb",
  color: "white",
  padding: "10px 14px",
  borderRadius: "8px",
  textDecoration: "none",
};