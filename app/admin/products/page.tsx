import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

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
  const isAdmin = cookies().get("admin");

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const query = searchParams?.q?.trim() || "";
  const category = searchParams?.category?.trim() || "";

  const products = await prisma.product.findMany({
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
              equals: category,
              mode: "insensitive",
            },
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const outOfStockProducts = products.filter((p) => p.stock <= 0).length;

  return (
    <div style={container}>
      <h1 style={title}>🛠 Gestion des produits</h1>

      {/* KPI */}
      <div style={grid3}>
        <div style={card}>
          <h3 style={cardTitle}>Produits</h3>
          <p style={valueStyle}>{totalProducts}</p>
        </div>

        <div style={card}>
          <h3 style={cardTitle}>Actifs</h3>
          <p style={valueStyle}>{activeProducts}</p>
        </div>

        <div style={card}>
          <h3 style={cardTitle}>Épuisés</h3>
          <p style={valueStyle}>{outOfStockProducts}</p>
        </div>
      </div>

      {/* FILTRES */}
      <div style={card}>
        <form method="GET" style={filterRow}>
          <input
            type="text"
            name="q"
            placeholder="Rechercher nom ou slug"
            defaultValue={query}
            style={input}
          />

          <select
            name="category"
            defaultValue={category}
            style={input}
          >
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

        <form
          action="/api/admin/create-product"
          method="POST"
          style={formGrid}
        >
          <input name="name" placeholder="Nom produit" style={input} required />
          <input name="slug" placeholder="Slug (ex: vanille-gourmet-100g)" style={input} required />
          <input name="description" placeholder="Description courte" style={input} required />
          <input name="imageUrl" placeholder="URL image" style={input} required />
          <input name="priceCents" type="number" min="0" placeholder="Prix en centimes (ex: 1290)" style={input} required />
          <input name="stock" type="number" min="0" placeholder="Stock" style={input} required />

          <select name="category" defaultValue="vanille" style={input}>
            <option value="vanille">Vanille</option>
            <option value="epices">Épices</option>
          </select>

          <input
            name="subCategory"
            placeholder="Sous-catégorie (optionnel)"
            style={input}
          />

          <label style={checkboxRow}>
            <input type="checkbox" name="isActive" defaultChecked />
            Produit actif
          </label>

          <div style={{ gridColumn: "1 / -1" }}>
            <button type="submit" style={primaryBtn}>
              Créer le produit
            </button>
          </div>
        </form>
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
                    <p style={mutedText}>
                      /product/{product.slug}
                    </p>
                  </div>

                  <div style={badgeRow}>
                    <span
                      style={{
                        ...statusBadge,
                        background: product.isActive ? "#16a34a" : "#6b7280",
                      }}
                    >
                      {product.isActive ? "ACTIF" : "INACTIF"}
                    </span>

                    {isOutOfStock && (
                      <span
                        style={{
                          ...statusBadge,
                          background: "#dc2626",
                        }}
                      >
                        ÉPUISÉ
                      </span>
                    )}
                  </div>
                </div>

                <div style={infoRow}>
                  <span><strong>Prix :</strong> {formatPrice(product.priceCents)}</span>
                  <span><strong>Stock :</strong> {product.stock}</span>
                  <span><strong>Catégorie :</strong> {product.category}</span>
                  <span><strong>Sous-catégorie :</strong> {product.subCategory || "—"}</span>
                </div>

                <p style={description}>{product.description}</p>

                <form
                  action="/api/admin/update-product"
                  method="POST"
                  style={formGrid}
                >
                  <input type="hidden" name="id" value={product.id} />

                  <input
                    name="name"
                    defaultValue={product.name}
                    style={input}
                    required
                  />

                  <input
                    name="slug"
                    defaultValue={product.slug}
                    style={input}
                    required
                  />

                  <input
                    name="description"
                    defaultValue={product.description}
                    style={input}
                    required
                  />

                  <input
                    name="imageUrl"
                    defaultValue={product.imageUrl}
                    style={input}
                    required
                  />

                  <input
                    name="priceCents"
                    type="number"
                    min="0"
                    defaultValue={product.priceCents}
                    style={input}
                    required
                  />

                  <input
                    name="stock"
                    type="number"
                    min="0"
                    defaultValue={product.stock}
                    style={input}
                    required
                  />

                  <select
                    name="category"
                    defaultValue={product.category}
                    style={input}
                  >
                    <option value="vanille">Vanille</option>
                    <option value="epices">Épices</option>
                  </select>

                  <input
                    name="subCategory"
                    defaultValue={product.subCategory || ""}
                    placeholder="Sous-catégorie"
                    style={input}
                  />

                  <label style={checkboxRow}>
                    <input
                      type="checkbox"
                      name="isActive"
                      defaultChecked={product.isActive}
                    />
                    Produit actif
                  </label>

                  <div style={actionRow}>
                    <button type="submit" style={primaryBtn}>
                      Sauvegarder
                    </button>
                  </div>
                </form>

                <form
                  action="/api/admin/delete-product"
                  method="POST"
                  style={{ marginTop: "12px" }}
                >
                  <input type="hidden" name="id" value={product.id} />
                  <button type="submit" style={dangerBtn}>
                    Supprimer
                  </button>
                </form>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* STYLES */

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
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
};

const cardTitle = {
  margin: 0,
  fontSize: "16px",
};

const valueStyle = {
  fontSize: "24px",
  fontWeight: 700,
  marginTop: "10px",
};

const filterRow = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  flexWrap: "wrap" as const,
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "12px",
};

const input = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  background: "white",
};

const checkboxRow = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 0",
};

const primaryBtn = {
  background: "#a16207",
  color: "white",
  border: "none",
  borderRadius: "10px",
  padding: "12px 16px",
  cursor: "pointer",
  fontWeight: 700,
};

const dangerBtn = {
  background: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "10px",
  padding: "12px 16px",
  cursor: "pointer",
  fontWeight: 700,
};

const listWrapper = {
  marginTop: "20px",
};

const productCard = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "16px",
  boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
};

const productHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
  marginBottom: "12px",
};

const badgeRow = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap" as const,
};

const statusBadge = {
  color: "white",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "12px",
  fontWeight: 700,
};

const mutedText = {
  color: "#777",
  fontSize: "12px",
  margin: "4px 0 0 0",
};

const infoRow = {
  display: "flex",
  gap: "16px",
  flexWrap: "wrap" as const,
  marginBottom: "12px",
  color: "#444",
};

const description = {
  color: "#666",
  marginBottom: "16px",
};

const actionRow = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
};