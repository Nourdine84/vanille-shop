import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SearchParams = {
  q?: string;
  category?: string;
  success?: string;
  error?: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceCents: number;
  imageUrl: string;
  stock: number;
  isActive: boolean;
  category: string;
  subCategory?: string | null;
  badge?: string | null;
};

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

function getImageUrl(imageUrl?: string | null) {
  if (!imageUrl) return "/products/default.jpg";
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  if (imageUrl.startsWith("/")) return imageUrl;
  return `/products/${imageUrl}`;
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
  const success = searchParams?.success;
  const error = searchParams?.error;

  let products: Product[] = [];

  try {
    products = await prisma.product.findMany({
      where: {
        ...(query
          ? {
              OR: [
                {
                  name: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  slug: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
        ...(category
          ? {
              category: {
                equals: category.toLowerCase(),
                mode: "insensitive",
              },
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("❌ PRISMA PRODUCTS ERROR:", e);
    products = [];
  }

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const outOfStockProducts = products.filter((p) => p.stock <= 0).length;

  return (
    <div style={container}>
      <h1 style={title}>🛠 Gestion des produits</h1>

      {success && (
        <div style={successPopup}>
          {success === "delete"
            ? "✅ Produit supprimé avec succès"
            : "✅ Opération réussie"}
        </div>
      )}

      {error && (
        <div style={errorPopup}>
          {error === "delete"
            ? "❌ Impossible de supprimer ce produit"
            : "❌ Une erreur est survenue"}
        </div>
      )}

      <div style={grid3}>
        <StatCard title="Produits" value={totalProducts} />
        <StatCard title="Actifs" value={activeProducts} />
        <StatCard title="Épuisés" value={outOfStockProducts} />
      </div>

      <div style={card}>
        <form method="GET" style={filterRow}>
          <input
            name="q"
            placeholder="Rechercher"
            defaultValue={query}
            style={input}
          />

          <select name="category" defaultValue={category} style={input}>
            <option value="">Toutes</option>
            <option value="vanille">Vanille</option>
            <option value="epices">Épices</option>
          </select>

          <button type="submit" style={primaryBtn}>
            Filtrer
          </button>
        </form>
      </div>

      <div style={card}>
        <h2 style={sectionTitle}>➕ Ajouter un produit</h2>
        <ProductForm />
      </div>

      <div style={listWrapper}>
        <h2 style={sectionTitle}>📦 Catalogue</h2>

        {products.length === 0 ? (
          <div style={card}>Aucun produit</div>
        ) : (
          <div style={productGrid}>
            {products.map((product) => {
              const imageSrc = getImageUrl(product.imageUrl);
              const isOutOfStock = product.stock <= 0;

              return (
                <div key={product.id} style={productCard}>
                  <div style={imageWrap}>
                    <img
                      src={imageSrc}
                      alt={product.name}
                      style={productImage}
                    />

                    <div
                      style={{
                        ...statusBadge,
                        background: product.isActive ? "#16a34a" : "#6b7280",
                      }}
                    >
                      {product.isActive ? "Actif" : "Inactif"}
                    </div>
                  </div>

                  <div style={productContent}>
                    <div style={topRow}>
                      <div>
                        <h3 style={productName}>{product.name}</h3>
                        <p style={productSlug}>/{product.slug}</p>
                      </div>

                      {product.badge ? (
                        <span style={smallBadge}>{product.badge}</span>
                      ) : null}
                    </div>

                    <p style={productCategory}>
                      {product.category}
                      {product.subCategory ? ` · ${product.subCategory}` : ""}
                    </p>

                    <p style={productDescription}>
                      {product.description || "Description non renseignée."}
                    </p>

                    <div style={metaBox}>
                      <div style={metaItem}>
                        <span style={metaLabel}>Prix</span>
                        <strong>{formatPrice(product.priceCents)}</strong>
                      </div>

                      <div style={metaItem}>
                        <span style={metaLabel}>Stock</span>
                        <strong style={{ color: isOutOfStock ? "#dc2626" : "#111" }}>
                          {product.stock}
                        </strong>
                      </div>
                    </div>

                    <div style={actionsRow}>
                      <a
                        href={`/admin/products/${product.id}`}
                        style={editBtn}
                      >
                        Modifier
                      </a>

                      <a
                        href={`/products/${product.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        style={previewBtn}
                      >
                        Voir
                      </a>

                      <DeleteProductButton
                        productId={product.id}
                        productName={product.name}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div style={card}>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={valueStyle}>{value}</p>
    </div>
  );
}

const container = {
  padding: 30,
};

const title = {
  fontSize: 28,
  marginBottom: 20,
};

const successPopup = {
  background: "#16a34a",
  color: "white",
  padding: 12,
  borderRadius: 10,
  marginBottom: 16,
};

const errorPopup = {
  background: "#dc2626",
  color: "white",
  padding: 12,
  borderRadius: 10,
  marginBottom: 16,
};

const grid3 = {
  display: "grid",
  gridTemplateColumns: "repeat(3,1fr)",
  gap: 20,
  marginBottom: 20,
};

const card = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
};

const valueStyle = {
  fontSize: 22,
  fontWeight: 700,
};

const filterRow = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap" as const,
};

const input = {
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ddd",
};

const primaryBtn = {
  background: "#a16207",
  color: "white",
  padding: 10,
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
};

const listWrapper = {
  marginTop: 20,
};

const sectionTitle = {
  marginBottom: 15,
};

const productGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))",
  gap: 20,
};

const productCard = {
  background: "white",
  borderRadius: 16,
  overflow: "hidden" as const,
  boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
  border: "1px solid #eee",
};

const imageWrap = {
  position: "relative" as const,
  height: 220,
  background: "#f8f5ef",
};

const productImage = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
  display: "block",
};

const statusBadge = {
  position: "absolute" as const,
  top: 12,
  right: 12,
  color: "white",
  padding: "6px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
};

const productContent = {
  padding: 18,
};

const topRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 10,
};

const productName = {
  margin: 0,
  fontSize: 18,
};

const productSlug = {
  margin: "4px 0 0",
  fontSize: 12,
  color: "#777",
};

const smallBadge = {
  background: "#fef3c7",
  color: "#7c4a03",
  padding: "6px 10px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
};

const productCategory = {
  margin: "12px 0 8px",
  color: "#a16207",
  fontWeight: 600,
  textTransform: "capitalize" as const,
};

const productDescription = {
  color: "#555",
  fontSize: 14,
  lineHeight: 1.5,
  minHeight: 42,
};

const metaBox = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
  marginTop: 16,
  marginBottom: 18,
};

const metaItem = {
  background: "#fafafa",
  border: "1px solid #eee",
  borderRadius: 10,
  padding: 12,
};

const metaLabel = {
  display: "block",
  fontSize: 12,
  color: "#777",
  marginBottom: 6,
};

const actionsRow = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap" as const,
};

const editBtn = {
  flex: 1,
  minWidth: 90,
  textAlign: "center" as const,
  textDecoration: "none",
  background: "#111",
  color: "white",
  padding: "10px 12px",
  borderRadius: 10,
  fontWeight: 600,
};

const previewBtn = {
  flex: 1,
  minWidth: 90,
  textAlign: "center" as const,
  textDecoration: "none",
  background: "#f3f4f6",
  color: "#111",
  padding: "10px 12px",
  borderRadius: 10,
  fontWeight: 600,
};