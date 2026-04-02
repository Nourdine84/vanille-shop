import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import ProductCard from "@/components/admin/ProductCard";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type SearchParams = {
  q?: string;
  category?: string;
  success?: string;
  error?: string;
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
  const success = searchParams?.success;
  const error = searchParams?.error;

  let products: any[] = [];

  try {
    products = await prisma.product.findMany({
      where: {
        ...(query && {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
          ],
        }),
        ...(category && {
          category: { equals: category, mode: "insensitive" },
        }),
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

      {success && <div style={successPopup}>✅ Opération réussie</div>}
      {error && <div style={errorPopup}>❌ Une erreur est survenue</div>}

      <div style={grid3}>
        <Card title="Produits" value={totalProducts} />
        <Card title="Actifs" value={activeProducts} />
        <Card title="Épuisés" value={outOfStockProducts} />
      </div>

      <div style={card}>
        <form method="GET" style={filterRow}>
          <input name="q" placeholder="Rechercher" defaultValue={query} style={input} />

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
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div style={card}>
      <h3>{title}</h3>
      <p style={{ fontSize: 22, fontWeight: 700 }}>{value}</p>
    </div>
  );
}

/* STYLES */

const container = { padding: 30 };
const title = { fontSize: 28, marginBottom: 20 };

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
};

const filterRow = {
  display: "flex",
  gap: 10,
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
};

const listWrapper = { marginTop: 20 };
const sectionTitle = { marginBottom: 15 };

const productGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))",
  gap: 20,
};