export default function ConfidentialitePage() {
    return (
      <div style={container}>
        <h1 style={title}>Politique de confidentialité</h1>
  
        <div style={content}>
          <p>
            Les données collectées via le site sont utilisées
            uniquement dans le cadre du traitement des commandes
            et demandes clients.
          </p>
  
          <p>
            Aucune donnée personnelle n’est revendue à des tiers.
          </p>
  
          <p>
            Vous pouvez demander la suppression de vos données
            en contactant : contact@vanilleor.fr
          </p>
  
          <p>
            Les paiements sont sécurisés via Stripe.
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