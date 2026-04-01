import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { useState } from "react";

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
                { name: { contains: query, mode: "insensitive" } },
                { slug: { contains: query, mode: "insensitive" } },
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
    console.error("❌ PRISMA ERROR:", error);
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

      {/* FILTER */}
      <div style={card}>
        <form method="GET" style={filterRow}>
          <input name="q" placeholder="Recherche" defaultValue={query} style={input} />
          <select name="category" defaultValue={category} style={input}>
            <option value="">Toutes</option>
            <option value="vanille">Vanille</option>
            <option value="epices">Épices</option>
          </select>
          <button style={primaryBtn}>Filtrer</button>
        </form>
      </div>

      {/* CREATE */}
      <div style={card}>
        <h2>➕ Ajouter un produit</h2>

        <form action="/api/admin/products" method="POST" style={formGrid}>
          <input name="name" placeholder="Nom" style={input} required />
          <input name="slug" placeholder="Slug" style={input} required />
          <input name="description" placeholder="Description" style={input} required />

          <ImageUpload />

          <input name="priceCents" type="number" placeholder="Prix centimes" style={input} required />
          <input name="stock" type="number" placeholder="Stock" style={input} required />

          <select name="category" style={input}>
            <option value="vanille">Vanille</option>
            <option value="epices">Épices</option>
          </select>

          <label style={checkboxRow}>
            <input type="checkbox" name="isActive" defaultChecked />
            Actif
          </label>

          <button style={primaryBtn}>Créer</button>
        </form>
      </div>

      {/* LIST */}
      <div style={listWrapper}>
        <h2>📦 Catalogue</h2>

        {products.length === 0 ? (
          <div style={card}>Aucun produit</div>
        ) : (
          products.map((p) => (
            <div key={p.id} style={productCard}>
              <h3>{p.name}</h3>
              <p>{formatPrice(p.priceCents)}</p>
              <p>{p.category}</p>
              <p>Stock: {p.stock}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ========================= CLIENT COMPONENT ========================= */

function ImageUpload() {
  "use client";

  const [preview, setPreview] = useState<string | null>(null);

  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

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
    <div>
      <input type="file" onChange={handleUpload} />

      {preview && <img src={preview} style={{ width: 100 }} />}

      <input name="imageUrl" placeholder="URL image" style={input} required />
    </div>
  );
}

/* ========================= COMPONENTS ========================= */

function Card({ title, value }: any) {
  return (
    <div style={card}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}

/* ========================= STYLE ========================= */

const container = { padding: 40 };
const title = { fontSize: 28 };

const grid3 = { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 };

const card = { background: "#fff", padding: 20, borderRadius: 10 };

const filterRow = { display: "flex", gap: 10 };

const formGrid = { display: "grid", gap: 10 };

const input = { padding: 10, border: "1px solid #ddd" };

const checkboxRow = { display: "flex", gap: 5 };

const primaryBtn = { background: "#a16207", color: "#fff", padding: 10 };

const listWrapper = { marginTop: 20 };

const productCard = { background: "#fff", padding: 15, marginBottom: 10 };