import type { Metadata } from "next";
import ConfianceSubPage from "@/components/confiance/ConfianceSubPage";

const description =
  "Les engagements de Vanille’Or envers ses clients : sélection exigeante, transparence tarifaire, paiement sécurisé et service client disponible.";

export const metadata: Metadata = {
  title: "Notre engagement | Vanille’Or",
  description,
  alternates: {
    canonical: "/confiance/engagement",
  },
  openGraph: {
    title: "Notre engagement | Vanille’Or",
    description,
    type: "website",
  },
};

export default function EngagementPage() {
  return (
    <ConfianceSubPage
      title="Notre engagement"
      intro="Ce que Vanille’Or s’engage à tenir, à chaque commande. Ni plus, ni moins."
      cta={{ label: "Découvrir nos produits", href: "/products" }}
      sections={[
        {
          title: "Une sélection exigeante",
          body: (
            <p>
              Nous ne mettons en vente que des produits que nous avons
              nous-mêmes sélectionnés. Notre vanille provient de Madagascar,
              et chaque référence est retenue sur des critères d’aspect, de
              souplesse et de parfum. Lorsqu’un lot ne répond pas à nos
              attentes, il n’est pas commercialisé.
            </p>
          ),
        },
        {
          title: "Une transparence tarifaire",
          body: (
            <p>
              Le prix affiché est le prix payé. Les frais de livraison sont
              annoncés avant le paiement&nbsp;: <strong>4,90&nbsp;€</strong>,
              et <strong>offerts dès 50&nbsp;€ d’achat</strong>. Aucun frais
              n’est ajouté à l’étape finale du paiement.
            </p>
          ),
        },
        {
          title: "Un achat sécurisé",
          body: (
            <p>
              Les paiements sont traités par <strong>Stripe</strong>, sur une
              page de paiement hébergée par leurs soins. Vos coordonnées
              bancaires ne transitent pas par nos serveurs et ne sont jamais
              conservées par Vanille’Or.
            </p>
          ),
        },
        {
          title: "Un service client joignable",
          body: (
            <p>
              Notre équipe reste disponible du lundi au vendredi, de 10h à
              18h. Toute réclamation est enregistrée et suivie. Vous pouvez
              nous écrire à tout moment via notre{" "}
              <a href="/reclamation" style={{ color: "#a16207" }}>
                formulaire de réclamation
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
