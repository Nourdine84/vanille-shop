export const metadata = {
    title: "Politique de confidentialité | Vanille’Or",
    description:
      "Découvrez comment Vanille’Or collecte, utilise et protège vos données personnelles conformément au RGPD.",
  };
  
  export default function PrivacyPage() {
    return (
      <div style={container}>
        <h1>Politique de confidentialité</h1>
  
        <p>
          Chez <strong>Vanille’Or</strong>, nous accordons une importance
          particulière à la protection de vos données personnelles.
        </p>
  
        <h2>Données collectées</h2>
        <ul>
          <li>Nom et prénom</li>
          <li>Adresse email</li>
          <li>Adresse de livraison</li>
          <li>Données de commande</li>
        </ul>
  
        <h2>Utilisation des données</h2>
        <p>
          Les données sont utilisées uniquement pour :
        </p>
        <ul>
          <li>Le traitement et la livraison des commandes</li>
          <li>Le service client</li>
          <li>L’amélioration de nos services</li>
        </ul>
  
        <h2>Conservation</h2>
        <p>
          Les données sont conservées de manière sécurisée et uniquement pendant la
          durée nécessaire au traitement des services.
        </p>
  
        <h2>Partage des données</h2>
        <p>
          Aucune donnée n’est vendue. Certaines données peuvent être transmises à
          des prestataires (paiement, livraison) uniquement dans le cadre du
          service.
        </p>
  
        <h2>Sécurité</h2>
        <p>
          Nous mettons en place des mesures techniques et organisationnelles pour
          protéger vos données.
        </p>
  
        <h2>Vos droits</h2>
        <p>
          Conformément au RGPD, vous disposez d’un droit d’accès, de modification
          et de suppression de vos données.
        </p>
  
        <h2>Contact</h2>
        <p>
          Pour toute demande : <strong>contact@vanilleor.com</strong>
        </p>
      </div>
    );
  }
  
  const container = {
    padding: "40px",
    maxWidth: "900px",
    margin: "0 auto",
    lineHeight: 1.7,
  };