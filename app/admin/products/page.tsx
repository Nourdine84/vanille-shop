import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import { getImageUrl } from "@/lib/image";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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

function normalizeSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default async function AdminProductsPage() {
  const isAdmin = cookies().get("admin")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  let products: Product[] = [];

  try {
    products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch (e) {
    console.error("❌ PRISMA ERROR:", e);
  }

  return (
    <div style={container}>
      <h1 style={title}>🛠 Admin Produits</h1>

      <div style={card}>
        <h2>➕ Ajouter un produit</h2>
        <ProductForm />
      </div>

      <div style={grid}>
        {products.map((p) => {
          const img = getImageUrl(p.imageUrl);
          const previewSlug = normalizeSlug(p.slug || p.name);

          return (
            <div key={p.id} style={productCard}>
              <img src={img} alt={p.name} style={image} />

              <div style={content}>
                <h3>{p.name}</h3>
                <p style={slug}>/{previewSlug}</p>

                {p.badge && <span style={badge}>{p.badge}</span>}

                <p style={price}>{formatPrice(p.priceCents)}</p>

                <p style={{ fontSize: 13, color: "#444" }}>Stock : {p.stock}</p>

                <div style={actions}>
                  <a href={`/admin/products/${p.id}`} style={editBtn}>
                    ✏️ Modifier
                  </a>

                  <a
                    href={`/products/${previewSlug}`}
                    target="_blank"
                    rel="noreferrer"
                    style={previewBtn}
                  >
                    👁 Voir
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

const container = { padding: 30 };

const title = { fontSize: 28, marginBottom: 20 };

const card = {
  background: "white",
  padding: 20,
  borderRadius: 12,
  marginBottom: 20,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
  gap: 20,
};

const productCard = {
  background: "white",
  borderRadius: 14,
  overflow: "hidden" as const,
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const image = {
  width: "100%",
  height: 200,
  objectFit: "cover" as const,
};

const content = { padding: 15 };

const slug = { fontSize: 12, color: "#777" };

const price = { fontWeight: 700 };

const badge = {
  display: "inline-block",
  background: "#f59e0b",
  color: "white",
  padding: "4px 8px",
  borderRadius: 6,
  fontSize: 12,
  marginBottom: 10,
};

const actions = {
  display: "flex",
  gap: 10,
  marginTop: 10,
  flexWrap: "wrap" as const,
};

const editBtn = {
  flex: 1,
  background: "#111",
  color: "white",
  padding: 8,
  borderRadius: 8,
  textAlign: "center" as const,
  textDecoration: "none",
};

const previewBtn = {
  flex: 1,
  background: "#eee",
  padding: 8,
  borderRadius: 8,
  textAlign: "center" as const,
  textDecoration: "none",
  color: "#111",
};