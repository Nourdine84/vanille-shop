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

        <form
          action="/api/admin/create-product"
          method="POST"
          style={formGrid}
        >
          <input name="name" placeholder="Nom produit" style={input} required />
          <input name="slug" placeholder="Slug" style={input} required />
          <input name="description" placeholder="Description" style={input} required />
          <input name="imageUrl" placeholder="URL image" style={input} required />

          <input
            name="priceCents"
            type="number"
            min="0"
            placeholder="Prix en centimes"
            style={input}
            required
          />

          <input
            name="stock"
            type="number"
            min="0"
            placeholder="Stock"
            style={input}
            required
          />

          {/* 🔥 UNIT */}
          <select name="unit" style={input} defaultValue="g">
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="cl">cl</option>
            <option value="unit">unité</option>
          </select>

          {/* 🔥 BADGE */}
          <select name="badge" style={input}>
            <option value="">Aucun badge</option>
            <option value="BESTSELLER">🔥 Bestseller</option>
            <option value="PREMIUM">💎 Premium</option>
            <option value="NEW">🆕 Nouveau</option>
            <option value="PROMO">🏷 Promo</option>
          </select>

          <select name="category" defaultValue="vanille" style={input}>
            <option value="vanille">Vanille</option>
            <option value="epices">Épices</option>
          </select>

          <input name="subCategory" placeholder="Sous-catégorie" style={input} />

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
          products.map((product: any) => {
            const isOutOfStock = product.stock <= 0;

            return (
              <div key={product.id} style={productCard}>
                <div style={productHeader}>
                  <div>
                    <h3 style={{ margin: 0 }}>{product.name}</h3>
                    <p style={mutedText}>/product/{product.slug}</p>
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
                      <span style={{ ...statusBadge, background: "#dc2626" }}>
                        ÉPUISÉ
                      </span>
                    )}

                    {product.badge && (
                      <span style={{ ...statusBadge, background: "#f59e0b" }}>
                        {product.badge}
                      </span>
                    )}
                  </div>
                </div>

                <div style={infoRow}>
                  <span>
                    <strong>Prix :</strong>{" "}
                    {formatPrice(product.priceCents)} / {product.unit || "g"}
                  </span>
                  <span><strong>Stock :</strong> {product.stock}</span>
                  <span><strong>Catégorie :</strong> {product.category}</span>
                </div>

                <p style={description}>{product.description}</p>

                <form
                  action="/api/admin/update-product"
                  method="POST"
                  style={formGrid}
                >
                  <input type="hidden" name="id" value={product.id} />

                  <input name="name" defaultValue={product.name} style={input} />
                  <input name="slug" defaultValue={product.slug} style={input} />
                  <input name="description" defaultValue={product.description} style={input} />
                  <input name="imageUrl" defaultValue={product.imageUrl} style={input} />

                  <input name="priceCents" type="number" defaultValue={product.priceCents} style={input} />
                  <input name="stock" type="number" defaultValue={product.stock} style={input} />

                  <select name="unit" defaultValue={product.unit || "g"} style={input}>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="cl">cl</option>
                    <option value="unit">unité</option>
                  </select>

                  <select name="badge" defaultValue={product.badge || ""} style={input}>
                    <option value="">Aucun badge</option>
                    <option value="BESTSELLER">🔥 Bestseller</option>
                    <option value="PREMIUM">💎 Premium</option>
                    <option value="NEW">🆕 Nouveau</option>
                    <option value="PROMO">🏷 Promo</option>
                  </select>

                  <label style={checkboxRow}>
                    <input type="checkbox" name="isActive" defaultChecked={product.isActive} />
                    Produit actif
                  </label>

                  <button type="submit" style={primaryBtn}>
                    Sauvegarder
                  </button>
                </form>

                <form action="/api/admin/delete-product" method="POST">
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

const container = { padding: "40px", background: "#faf7f2", minHeight: "100vh" };
const title = { fontSize: "28px", marginBottom: "24px" };
const sectionTitle = { margin: "0 0 16px 0" };

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

const cardTitle = { margin: 0 };
const valueStyle = { fontSize: "24px", fontWeight: 700 };

const filterRow = { display: "flex", gap: "12px" };

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "12px",
};

const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const checkboxRow = { display: "flex", gap: "8px" };

const primaryBtn = {
  background: "#a16207",
  color: "white",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
};

const dangerBtn = {
  background: "#dc2626",
  color: "white",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
};

const listWrapper = { marginTop: "20px" };

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

const badgeRow = { display: "flex", gap: "6px" };

const statusBadge = {
  padding: "6px 10px",
  borderRadius: "999px",
  color: "white",
  fontSize: "12px",
};

const mutedText = { color: "#777", fontSize: "12px" };

const infoRow = { display: "flex", gap: "12px" };

const description = { color: "#666" };