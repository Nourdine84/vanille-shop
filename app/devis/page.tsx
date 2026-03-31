import Link from "next/link";

export const metadata = {
  title: "Demander un devis | Vanille’Or",
  description: "Obtenez un devis personnalisé pour vos achats de vanille premium en gros ou semi-gros.",
};

export default function DevisPage() {
  return (
    <div style={container}>
      <h1 style={title}>📩 Demander un devis</h1>

      <p style={subtitle}>
        Vous souhaitez acheter de la vanille en quantité ?  
        Contactez-nous pour une offre personnalisée.
      </p>

      <form style={form}>
        <input placeholder="Nom / Entreprise" style={input} required />
        <input placeholder="Email" type="email" style={input} required />
        <input placeholder="Téléphone (optionnel)" style={input} />

        <select style={input}>
          <option>Type de produit</option>
          <option>Vanille gourmet</option>
          <option>Caviar de vanille</option>
          <option>Épices</option>
        </select>

        <input placeholder="Quantité souhaitée (ex: 2kg)" style={input} />

        <textarea
          placeholder="Message / besoin spécifique"
          style={{ ...input, height: "120px" }}
        />

        <button style={btn}>Envoyer la demande</button>
      </form>

      <Link href="/products" style={link}>
        ← Retour aux produits
      </Link>
    </div>
  );
}

/* STYLE */
const container = {
  maxWidth: "700px",
  margin: "60px auto",
  padding: "20px",
};

const title = {
  fontSize: "32px",
  marginBottom: "20px",
};

const subtitle = {
  color: "#666",
  marginBottom: "30px",
};

const form = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "12px",
};

const input = {
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #ddd",
};

const btn = {
  background: "#a16207",
  color: "white",
  padding: "14px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  fontWeight: "600",
};

const link = {
  display: "block",
  marginTop: "20px",
  textDecoration: "none",
  color: "#a16207",
};