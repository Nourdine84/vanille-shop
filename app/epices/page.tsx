import Link from "next/link";

async function getProducts() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  if (!res.ok) return [];

  const data = await res.json();

  // filtre épices
  return data.filter((p: any) =>
    ["cannelle", "poivre", "cacao", "girofle"].some((k) =>
      p.name.toLowerCase().includes(k)
    )
  );
}

export default async function EpicesPage() {
  const products = await getProducts();

  return (
    <div style={{ padding: "60px 20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>
        Épices premium
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "30px",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        {products.map((product: any) => (
          <div
            key={product.id}
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "16px",
              textAlign: "center",
              boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
            }}
          >
            <img
              src={product.imageUrl || "/images/product-vanille.jpg"}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "12px",
                marginBottom: "12px",
              }}
            />

            <h3>{product.name}</h3>

            <Link href={`/product/${product.slug}`}>
              Voir →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}