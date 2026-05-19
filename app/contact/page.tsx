import BackButton from "@/components/ui/BackButton";

export default function ContactPage() {
    return (
      <div style={container}>
        <div style={card}>
          <p style={tag}>CONTACT</p>

          <BackButton
            label="Retour accueil"
            fallback="/"
            />
  
          <h1 style={title}>
            Une question ?
          </h1>
  
          <p style={text}>
            Notre équipe vous répond rapidement concernant
            vos commandes, demandes professionnelles,
            partenariats ou informations produits.
          </p>
  
          <div style={infoBox}>
            <div style={infoItem}>
              <strong>Email</strong>
              <p>contact@vanilleor.fr</p>
            </div>
  
            <div style={infoItem}>
              <strong>Professionnels</strong>
              <p>B2B • Restaurants • Revendeurs</p>
            </div>
  
            <div style={infoItem}>
              <strong>Expédition</strong>
              <p>France & Europe</p>
            </div>
          </div>
  
          <a href="/b2b" style={cta}>
            Demande professionnelle
          </a>
        </div>
      </div>
    );
  }
  
  const container = {
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    background: "#f8f5ef",
  };
  
  const card = {
    width: "100%",
    maxWidth: "700px",
    background: "white",
    borderRadius: "24px",
    padding: "50px 30px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
    textAlign: "center" as const,
  };
  
  const tag = {
    color: "#a16207",
    fontWeight: 800,
    letterSpacing: "0.15em",
    marginBottom: "12px",
  };
  
  const title = {
    fontSize: "42px",
    marginBottom: "20px",
  };
  
  const text = {
    color: "#666",
    lineHeight: 1.8,
    marginBottom: "35px",
  };
  
  const infoBox = {
    display: "grid",
    gap: "18px",
    marginBottom: "35px",
  };
  
  const infoItem = {
    background: "#faf7f2",
    borderRadius: "16px",
    padding: "18px",
  };
  
  const cta = {
    display: "inline-block",
    background: "#a16207",
    color: "white",
    padding: "14px 24px",
    borderRadius: "14px",
    textDecoration: "none",
    fontWeight: 700,
  };