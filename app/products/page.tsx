import Link from "next/link";

async function getProducts() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erreur chargement produits");
  }

  return res.json();
}

function formatPrice(priceCents: number) {
  return (priceCents / 100).toFixed(2).replace(".", ",") + " €";
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="max-w-7xl mx-auto py-20 px-6">
      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <p
          style={{
            fontSize: "12px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#a16207",
            marginBottom: "12px",
            fontWeight: 700,
          }}
        >
          Vanille Or
        </p>

        <h1 style={{ fontSize: "46px", fontWeight: 800, marginBottom: "14px" }}>
          Nos produits
        </h1>

        <p
          style={{
            color: "#6b7280",
            maxWidth: "680px",
            margin: "0 auto",
            lineHeight: 1.8,
          }}
        >
          Découvrez une sélection de produits premium soigneusement choisis
          pour sublimer vos créations.
        </p>
      </div>

      {/* EMPTY STATE */}
      {products.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "50px",
            border: "1px dashed #d6d3d1",
            borderRadius: "18px",
            background: "#fafaf9",
          }}
        >
          <p style={{ color: "#6b7280" }}>
            Aucun produit disponible pour le moment.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product: any) => {
            // 🔒 SECURITÉ IMAGE
            const imageSrc =
              product.imageUrl &&
              product.imageUrl.startsWith("/images/")
                ? product.imageUrl
                : "/images/product-vanille.jpg";

            return (
              <div
                key={product.id}
                style={{
                  border: "1px solid #ece7df",
                  borderRadius: "22px",
                  padding: "18px",
                  background: "#ffffff",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s ease",
                }}
              >
                {/* IMAGE */}
                <div
                  style={{
                    overflow: "hidden",
                    borderRadius: "16px",
                    marginBottom: "18px",
                  }}
                >
                  <img
                    src={imageSrc}
                    alt={product.name || "Produit Vanille Or"}
                    style={{
                      width: "100%",
                      height: "270px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>

                {/* NOM */}
                <h2
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    marginBottom: "10px",
                  }}
                >
                  {product.name}
                </h2>

                {/* DESCRIPTION */}
                <p
                  style={{
                    color: "#6b7280",
                    marginBottom: "18px",
                    lineHeight: 1.7,
                    minHeight: "72px",
                  }}
                >
                  {product.description || "Produit premium Vanille Or"}
                </p>

                {/* PRIX */}
                <p
                  style={{
                    fontSize: "20px",
                    fontWeight: 800,
                    marginBottom: "18px",
                  }}
                >
                  {formatPrice(product.priceCents || 0)}
                </p>

                {/* CTA */}
                <Link
                  href={`/product/${product.slug}`}
                  style={{
                    display: "block",
                    textAlign: "center",
                    background: "#a16207",
                    color: "white",
                    padding: "12px 16px",
                    borderRadius: "14px",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  Voir le produit
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}