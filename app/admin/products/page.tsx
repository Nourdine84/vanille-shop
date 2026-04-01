import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/* ========================= TYPES ========================= */

type SearchParams = {
  q?: string;
  category?: string;
};

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

/* ========================= PAGE ========================= */

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  /* ========================= AUTH ========================= */
  const isAdmin = cookies().get("admin")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  /* ========================= FILTERS ========================= */
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

  /* ========================= KPI ========================= */
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const outOfStockProducts = products.filter((p) => p.stock <= 0).length;

  /* ========================= UI ========================= */

  return (
    <div style={container}>
      <h1 style={title}>🛠 Gestion des produits</h1>

      {/* KPI */}
      <div style={grid3}>
        <Card title="Produits" value={totalProducts} />
        <Card title="Actifs" value={activeProducts} />
        <Card title="Épuisés" value={outOfStockProducts} />
      </div>

      {/* FILTER */}
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

        <form action="/api/admin/products" method="POST" style={formGrid}>
          <input name="name" placeholder="Nom produit" style={input} required />
          <input name="slug" placeholder="Slug" style={input} required />
          <input name="description" placeholder="Description" style={input} required />

          {/* IMAGE UPLOAD */}
          <ImageUpload />

          <input name="priceCents" type="number" placeholder="Prix centimes" style={input} required />
          <input name="stock" type="number" placeholder="Stock" style={input} required />

          <select name="unit" style={input} defaultValue="g">
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="cl">cl</option>
            <option value="unit">unité</option>
          </select>

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

          <button type="submit" style={primaryBtn}>
            Créer le produit
          </button>
        </form>
      </div>

      {/* LIST */}
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
                    <h3>{product.name}</h3>
                    <p style={mutedText}>/product/{product.slug}</p>
                  </div>

                  <div style={badgeRow}>
                    <Badge color={product.isActive ? "#16a34a" : "#6b7280"}>
                      {product.isActive ? "ACTIF" : "INACTIF"}
                    </Badge>

                    {isOutOfStock && (
                      <Badge color="#dc2626">ÉPUISÉ</Badge>
                    )}

                    {product.badge && (
                      <Badge color="#f59e0b">{product.badge}</Badge>
                    )}
                  </div>
                </div>

                <div style={infoRow}>
                  <span><strong>Prix :</strong> {formatPrice(product.priceCents)}</span>
                  <span><strong>Stock :</strong> {product.stock}</span>
                  <span><strong>Catégorie :</strong> {product.category}</span>
                </div>

                <p style={description}>{product.description}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ========================= CLIENT COMPONENT ========================= */

function ImageUpload() {
  "use client";

  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    const input = document.querySelector<HTMLInputElement>("input[name='imageUrl']");
    if (input) input.value = data.url;
  };

  return (
    <>
      <input type="file" accept="image/*" onChange={handleUpload} />
      <input name="imageUrl" placeholder="URL image" style={input} required />
    </>
  );
}

/* ========================= COMPONENTS ========================= */

function Card({ title, value }: any) {
  return (
    <div style={card}>
      <h3>{title}</h3>
      <p style={valueStyle}>{value}</p>
    </div>
  );
}

function Badge({ children, color }: any) {
  return (
    <span style={{ ...statusBadge, background: color }}>
      {children}
    </span>
  );
}

/* ========================= STYLE ========================= */

const container = { padding: "40px", background: "#faf7f2", minHeight: "100vh" };
const title = { fontSize: "28px", marginBottom: "24px" };
const sectionTitle = { margin: "0 0 16px 0" };

const grid3 = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" };

const card = { background: "white", padding: "20px", borderRadius: "12px" };
const valueStyle = { fontSize: "24px", fontWeight: 700 };

const filterRow = { display: "flex", gap: "12px" };

const formGrid = { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" };

const input = { padding: "10px", borderRadius: "8px", border: "1px solid #ddd" };

const checkboxRow = { display: "flex", gap: "8px" };

const primaryBtn = { background: "#a16207", color: "white", padding: "10px", borderRadius: "8px", border: "none" };

const listWrapper = { marginTop: "20px" };

const productCard = { background: "white", padding: "20px", borderRadius: "12px", marginBottom: "16px" };

const productHeader = { display: "flex", justifyContent: "space-between" };

const badgeRow = { display: "flex", gap: "6px" };

const statusBadge = { padding: "6px 10px", borderRadius: "999px", color: "white", fontSize: "12px" };

const mutedText = { color: "#777", fontSize: "12px" };

const infoRow = { display: "flex", gap: "12px" };

const description = { color: "#666" };