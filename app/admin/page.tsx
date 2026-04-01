import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function ProductsPage() {
  const isAdmin = cookies().get("admin")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  let products: any[] = [];

  try {
    products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("❌ PRISMA PRODUCTS ERROR:", error);
  }

  return (
    <div style={container}>
      <div style={header}>
        <h1 style={title}>🛍️ Produits Vanille’Or</h1>

        <a href="/admin/products/new" style={addBtn}>
          + Ajouter produit
        </a>
      </div>

      {products.length === 0 ? (
        <div style={emptyState}>
          Aucun produit pour le moment
        </div>
      ) : (
        <div style={grid}>
          {products.map((p) => (
            <div key={p.id} style={card}>
              
              <img
                src={p.imageUrl || "/placeholder.jpg"}
                alt={p.name}
                style={image}
              />

              <h3 style={name}>{p.name}</h3>

              <p style={price}>
                {(p.priceCents / 100).toFixed(2)} €
              </p>

              <p style={category}>
                {p.category || "Non catégorisé"}
              </p>

              <div style={actions}>
                <button style={editBtn}>✏️ Modifier</button>

                <button
                  style={deleteBtn}
                  onClick={async () => {
                    await fetch("/api/admin/products", {
                      method: "DELETE",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ id: p.id }),
                    });

                    location.reload();
                  }}
                >
                  🗑 Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ========================= STYLE ========================= */

const container = {
  padding: "40px",
  background: "#f8f5f0",
  minHeight: "100vh",
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
};

const title = {
  fontSize: "28px",
  fontWeight: 700,
};

const addBtn = {
  background: "#a16207",
  color: "white",
  padding: "12px 20px",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: 600,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "20px",
};

const card = {
  background: "white",
  padding: "16px",
  borderRadius: "14px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
};

const image = {
  width: "100%",
  height: "180px",
  objectFit: "cover" as const,
  borderRadius: "10px",
  marginBottom: "10px",
};

const name = {
  fontSize: "16px",
  fontWeight: 600,
};

const price = {
  color: "#a16207",
  fontWeight: 700,
  marginTop: "5px",
};

const category = {
  fontSize: "12px",
  color: "#777",
};

const actions = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "12px",
};

const editBtn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "8px 10px",
  borderRadius: "8px",
  cursor: "pointer",
};

const deleteBtn = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "8px 10px",
  borderRadius: "8px",
  cursor: "pointer",
};

const emptyState = {
  background: "white",
  padding: "30px",
  borderRadius: "12px",
  textAlign: "center" as const,
};