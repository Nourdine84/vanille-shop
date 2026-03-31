import Link from "next/link";

export const metadata = {
  title: "Devis 10kg vanille | Vanille’Or",
};

export default function Devis10kgPage() {
  return (
    <div style={container}>
      <h1 style={title}>📦 Devis spécial 10kg</h1>

      <p style={subtitle}>
        Offre dédiée aux professionnels et gros volumes.
      </p>

      <div style={card}>
        <p>✔ Tarif préférentiel</p>
        <p>✔ Livraison rapide</p>
        <p>✔ Qualité premium Madagascar</p>
      </div>

      <Link href="/devis">
        <button style={btn}>Faire une demande</button>
      </Link>
    </div>
  );
}

const container = {
  maxWidth: "700px",
  margin: "60px auto",
  padding: "20px",
};

const title = { fontSize: "30px", marginBottom: "20px" };
const subtitle = { marginBottom: "20px", color: "#666" };

const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "20px",
};

const btn = {
  background: "#a16207",
  color: "white",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
};