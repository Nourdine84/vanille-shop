import Link from "next/link";

export const metadata = {
  title: "Vanille pour pâtisserie | Vanille’Or",
  description:
    "Utilisez la vanille de Madagascar pour vos pâtisseries. Arômes intenses, qualité premium pour desserts et créations.",
};

export default function VanillePatisseriePage() {
  return (
    <div style={{ maxWidth: "900px", margin: "60px auto", padding: "20px" }}>

      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
        Vanille pour pâtisserie : sublimez vos créations
      </h1>

      <p style={{ marginBottom: "20px", lineHeight: 1.6 }}>
        La vanille est un ingrédient incontournable en pâtisserie. Grâce à ses arômes
        riches et naturels, elle apporte une profondeur unique à vos desserts.
      </p>

      <h2>Pourquoi utiliser la vanille de Madagascar ?</h2>

      <ul style={{ marginBottom: "20px" }}>
        <li>✔ Arôme intense et naturel</li>
        <li>✔ Parfaite pour crèmes, gâteaux, biscuits</li>
        <li>✔ Qualité professionnelle</li>
      </ul>

      <h2>Des résultats exceptionnels</h2>

      <p style={{ marginBottom: "20px" }}>
        Que vous soyez pâtissier amateur ou professionnel, notre vanille vous garantit
        des résultats dignes des meilleures créations.
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