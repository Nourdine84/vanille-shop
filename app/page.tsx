import Link from "next/link";

async function getProducts() {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  });

  if (!res.ok) return [];

  return res.json();
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div>

      {/* HERO */}
<section
  style={{
    height: "80vh",
    position: "relative",
  }}
>
  <img
    src="/images/hero-vanille.jpg"
    alt="Vanille Madagascar premium"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      filter: "brightness(0.6)",
    }}
  />

  <div
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
      color: "white",
      width: "90%",
      maxWidth: "700px",
      padding: "0 10px",
    }}
  >
    <h1
      style={{
        fontSize: "clamp(28px, 6vw, 42px)",
        lineHeight: 1.2,
        marginBottom: "12px",
      }}
    >
      L’excellence de la vanille de Madagascar
    </h1>

    <p
      style={{
        fontSize: "clamp(14px, 3.5vw, 18px)",
        marginBottom: "20px",
        lineHeight: 1.5,
      }}
    >
      Une qualité premium sélectionnée pour sublimer vos pâtisseries et créations.
    </p>

    <Link
      href="/products"
      style={{
        display: "inline-block",
        background: "#a16207",
        padding: "12px 20px",
        borderRadius: "10px",
        color: "white",
        textDecoration: "none",
        fontWeight: "600",
        fontSize: "clamp(14px, 3vw, 16px)",
      }}
    >
      Découvrir nos produits
    </Link>
  </div>
</section>
      {/* USP BAR */}
      <section
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "20px",
          borderBottom: "1px solid #eee",
          textAlign: "center",
          fontSize: "14px",
        }}
      >
        <div>
          🌿 <strong>Qualité Premium</strong>
          <p>Vanille sélectionnée à Madagascar</p>
        </div>

        <div>
          🚚 <strong>Livraison rapide</strong>
          <p>2-4 jours en France et Europe</p>
        </div>

        <div>
          🔒 <strong>Paiement sécurisé</strong>
          <p>Transactions 100% sécurisées</p>
        </div>
      </section>

      {/* UNIVERS */}
<section style={{ padding: "60px 20px", textAlign: "center" }}>
  <h2 style={{ marginBottom: "40px" }}>Nos univers</h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "20px",
      maxWidth: "900px",
      margin: "0 auto",
    }}
  >

    {/* VANILLE */}
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "16px",
        textAlign: "center",
        boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
      }}
    >
      <img
        src="/images/vanille.jpg"
        alt="Vanille premium"
        style={{
          width: "100%",
          height: "160px",
          objectFit: "cover",
          borderRadius: "12px",
          marginBottom: "10px",
        }}
      />

      <h3>Vanille</h3>

      <p style={{ fontSize: "14px", color: "#666" }}>
        Gousses, poudre, caviar
      </p>

      <Link
        href="/vanille"
        style={{
          display: "inline-block",
          marginTop: "10px",
          color: "#a16207",
          fontWeight: "600",
          textDecoration: "none",
        }}
      >
        Voir →
      </Link>
    </div>

    {/* ÉPICES */}
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "16px",
        textAlign: "center",
        boxShadow: "0 5px 20px rgba(0,0,0,0.05)",
      }}
    >
      <img
        src="/images/epices.jpg"
        alt="Épices premium"
        style={{
          width: "100%",
          height: "160px",
          objectFit: "cover",
          borderRadius: "12px",
          marginBottom: "10px",
        }}
      />

      <h3>Épices</h3>

      <p style={{ fontSize: "14px", color: "#666" }}>
        Cannelle, cacao, poivre, girofle
      </p>

      <Link
        href="/epices"
        style={{
          display: "inline-block",
          marginTop: "10px",
          color: "#a16207",
          fontWeight: "600",
          textDecoration: "none",
        }}
      >
        Voir →
      </Link>
    </div>

  </div>
</section>

      {/* SEO TEXT */}
      <section
        style={{
          maxWidth: "900px",
          margin: "40px auto",
          textAlign: "center",
          padding: "0 20px",
        }}
      >
        <h2>Vanille de Madagascar Premium</h2>
        <p style={{ color: "#666" }}>
          Découvrez une vanille de Madagascar haut de gamme, idéale pour la pâtisserie
          et la gastronomie. Gousses sélectionnées avec exigence pour une qualité exceptionnelle.
        </p>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link href="/vanille-madagascar">Vanille Madagascar</Link> |{" "}
          <Link href="/acheter-vanille">Acheter vanille</Link> |{" "}
          <Link href="/vanille-patisserie">Vanille pâtisserie</Link>
          <Link href="/vanille-madagascar">Vanille Madagascar premium</Link>
        </div>
        
      </section>

      {/* PRODUITS */}
      <section style={{ padding: "60px 20px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "40px" }}>
          Nos produits
        </h2>

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
                alt={`${product.name} vanille Madagascar premium`}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginBottom: "12px",
                }}
              />

              <h3>{product.name}</h3>

              <p style={{ fontSize: "14px", color: "#666" }}>
                {product.description}
              </p>

              <Link
                href={`/product/${product.slug}`}
                style={{
                  display: "inline-block",
                  marginTop: "10px",
                  color: "#a16207",
                  fontWeight: "600",
                  textDecoration: "none",
                }}
              >
                Voir →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background: "#a16207",
          color: "white",
          padding: "40px 20px",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          Sublimez vos créations dès aujourd’hui
        </h2>

        <Link
          href="/products"
          style={{
            background: "white",
            color: "#a16207",
            padding: "12px 20px",
            borderRadius: "10px",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          Commander maintenant
        </Link>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          textAlign: "center",
          padding: "20px",
          fontSize: "14px",
          color: "#666",
        }}
      >
        © {new Date().getFullYear()} Vanille’Or — Développé par AKM.Consulting
      </footer>

    </div>
  );
}