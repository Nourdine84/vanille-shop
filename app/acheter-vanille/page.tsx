import Link from "next/link";

export const metadata = {
  title: "Acheter de la vanille premium | Vanille’Or",
  description:
    "Achetez de la vanille de Madagascar premium. Gousses de qualité supérieure pour particuliers et professionnels.",
};

export default function AcheterVanillePage() {
  return (
    <div style={{ maxWidth: "900px", margin: "60px auto", padding: "20px" }}>

      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
        Acheter de la vanille premium
      </h1>

      <p style={{ marginBottom: "20px", lineHeight: 1.6 }}>
        Vous cherchez à acheter de la vanille de qualité ? Chez Vanille’Or,
        nous proposons des gousses de vanille de Madagascar sélectionnées avec exigence.
      </p>

      <h2>Une vanille pour les passionnés et professionnels</h2>

      <p style={{ marginBottom: "20px" }}>
        Notre vanille est idéale pour les pâtissiers, restaurateurs et amateurs exigeants.
        Elle garantit des résultats exceptionnels en cuisine.
      </p>

      <h2>Nos engagements</h2>

      <ul style={{ marginBottom: "20px" }}>
        <li>✔ Qualité premium</li>
        <li>✔ Origine Madagascar</li>
        <li>✔ Livraison rapide</li>
      </ul>

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
        Acheter maintenant
      </Link>

    </div>
  );
}