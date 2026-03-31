export const metadata = {
    title: "Conditions Générales de Vente | Vanille’Or",
    description:
      "Consultez les conditions générales de vente de Vanille’Or pour l’achat de vanille et épices premium.",
  };
  
  export default function CGVPage() {
    return (
      <div style={container}>
        <h1>Conditions Générales de Vente</h1>
  
        <p>
          Les présentes Conditions Générales de Vente (CGV) régissent les ventes
          réalisées sur le site <strong>Vanille’Or</strong>.
        </p>
  
        <h2>1. Produits</h2>
        <p>
          Les produits proposés sont des produits alimentaires (vanille, épices)
          issus de Madagascar.
        </p>
  
        <h2>2. Prix</h2>
        <p>
          Les prix sont indiqués en euros (€) toutes taxes comprises (TTC).
        </p>
  
        <h2>3. Commande</h2>
        <p>
          Toute commande validée implique l’acceptation des présentes CGV.
        </p>
  
        <h2>4. Paiement</h2>
        <p>
          Le paiement est sécurisé via Stripe. Aucune donnée bancaire n’est
          stockée par Vanille’Or.
        </p>
  
        <h2>5. Livraison</h2>
        <p>
          Les livraisons sont effectuées en France et en Europe. Les délais sont
          indicatifs et peuvent varier.
        </p>
  
        <h2>6. Droit de rétractation</h2>
        <p>
          Conformément à la législation, les produits alimentaires ne sont pas
          soumis au droit de rétractation une fois ouverts.
        </p>
  
        <h2>7. Responsabilité</h2>
        <p>
          Vanille’Or ne saurait être tenue responsable en cas de mauvaise
          utilisation des produits.
        </p>
  
        <h2>8. Contact</h2>
        <p>Email : contact@vanilleor.com</p>
      </div>
    );
  }
  
  const container = {
    padding: "40px",
    maxWidth: "900px",
    margin: "0 auto",
    lineHeight: 1.7,
  };