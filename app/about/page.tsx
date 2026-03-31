export default function AboutPage() {
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "60px 20px" }}>

      {/* HERO IMAGE */}
      <div style={{ marginBottom: "50px" }}>
        <img
          src="/images/about-vanille.jpg"
          alt="Vanille de Madagascar"
          style={{
            width: "100%",
            height: "420px",
            objectFit: "cover",
            borderRadius: "20px",
          }}
        />
      </div>

      {/* TITRE */}
      <h1 style={{
        fontSize: "36px",
        fontWeight: "bold",
        marginBottom: "30px",
        textAlign: "center"
      }}>
        L’histoire de Vanille’Or
      </h1>

      {/* TEXTE */}
      <div style={{ fontSize: "16px", lineHeight: 1.8, color: "#444" }}>

        <p style={{ marginBottom: "20px" }}>
          Vanille’Or est née d’un lien fort entre la France et Madagascar.
        </p>

        <p style={{ marginBottom: "20px" }}>
          Ancrés par des racines familiales, nous avons fait le choix d’un circuit court en collaborant directement avec un producteur local, garantissant une qualité exceptionnelle.
        </p>

        <p style={{ marginBottom: "20px" }}>
          Chaque gousse est le fruit d’un savoir-faire précieux, héritage d’une découverte majeure réalisée par Edmond Albius, qui a permis à la vanille de révéler tout son potentiel à travers le monde.
        </p>

        <p style={{ marginBottom: "20px" }}>
          Nous sélectionnons rigoureusement nos produits afin d’offrir une vanille premium accessible, adaptée aussi bien aux passionnés qu’aux professionnels.
        </p>

        <p style={{ marginBottom: "20px" }}>
          Vanille’Or s’inscrit dans une vision plus large : proposer une gamme d’ingrédients nobles — vanille, cannelle, cacao, poivre — issus de Madagascar.
        </p>

      </div>

      {/* SIGNATURE */}
      <div style={{
        marginTop: "50px",
        textAlign: "center",
        fontWeight: "600",
        fontSize: "18px"
      }}>
        Vanille’Or, l’alliance entre héritage, authenticité et excellence.
      </div>

    </div>
  );
}