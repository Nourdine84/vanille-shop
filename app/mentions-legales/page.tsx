export default function MentionsLegalesPage() {
    return (
      <div style={container}>
        <h1 style={title}>Mentions légales</h1>
  
        <div style={content}>
          <p>
            <strong>Éditeur :</strong> Vanille’Or
          </p>
  
          <p>
            <strong>Activité :</strong> Vente de vanille et épices premium.
          </p>
  
          <p>
            <strong>Email :</strong> contact@vanilleor.fr
          </p>
  
          <p>
            <strong>Hébergement :</strong> Vercel Inc.
          </p>
  
          <p>
            <strong>Développement :</strong> AKM.Consulting
          </p>
        </div>
      </div>
    );
  }
  
  const container = {
    maxWidth: "900px",
    margin: "60px auto",
    padding: "20px",
  };
  
  const title = {
    fontSize: "36px",
    marginBottom: "30px",
  };
  
  const content = {
    lineHeight: 1.9,
    color: "#555",
  };