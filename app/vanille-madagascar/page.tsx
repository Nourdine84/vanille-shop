import Link from "next/link";

export const metadata = {
  title: "Vanille de Madagascar Premium | Vanille’Or",
  description:
    "Découvrez la vanille de Madagascar premium Vanille’Or. Gousses charnues, arômes intenses, qualité professionnelle.",
};

export default function VanilleMadagascarPage() {
  return (
    <div style={{ maxWidth: "900px", margin: "60px auto", padding: "20px" }}>

      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
        Vanille de Madagascar Premium
      </h1>

      <p style={{ marginBottom: "20px", lineHeight: 1.6 }}>
        La vanille de Madagascar est reconnue comme la meilleure vanille au monde.
        Grâce à un climat unique et un savoir-faire artisanal, elle offre des arômes
        riches et intenses, parfaits pour la pâtisserie et la gastronomie.
      </p>

      <h2>Pourquoi choisir notre vanille ?</h2>

      <ul style={{ marginBottom: "20px" }}>
        <li>✔ Gousses charnues et fraîches</li>
        <li>✔ Arômes puissants et naturels</li>
        <li>✔ Sélection premium directement à Madagascar</li>
      </ul>

      <h2>Utilisation en cuisine</h2>

      <p style={{ marginBottom: "20px" }}>
        Idéale pour vos desserts, crèmes, pâtisseries et préparations haut de gamme,
        la vanille de Madagascar sublime vos créations avec une intensité unique.
      </p>

      <Link
        href="/products"
        style={{
          display: "inline-block",
          background: "#a16207",
          color: "white",
          padding: "12px 20px",
          borderRadius: "10px",
          textDecoration: "none",
          fontWeight: "600",
        }}
      >
        Voir nos produits
      </Link>

    </div>
  );
}