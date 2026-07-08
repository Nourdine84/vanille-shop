import type { Metadata } from "next";
import ConfianceSubPage from "@/components/confiance/ConfianceSubPage";

const description =
  "Questions fréquentes Vanille’Or : frais et délais de livraison, moyens de paiement, suivi de commande, rétractation, retours et service client.";

export const metadata: Metadata = {
  title: "FAQ | Vanille’Or",
  description,
  alternates: {
    canonical: "/support/faq",
  },
  openGraph: {
    title: "FAQ | Vanille’Or",
    description,
    type: "website",
  },
};

const gold = { color: "#a16207" };

export default function FaqPage() {
  return (
    <ConfianceSubPage
      title="Questions fréquentes"
      intro="Les réponses aux questions les plus courantes. En cas de doute, les CGV font foi."
      cta={{ label: "Contacter le service client", href: "/support" }}
      sections={[
        {
          title: "Quels sont les frais de livraison ?",
          body: (
            <p>
              La livraison coûte <strong>4,90&nbsp;€</strong>. Elle est{" "}
              <strong>offerte à partir de 50&nbsp;€ d’achat</strong> (montant
              du panier hors frais de port). Le montant exact est affiché avant
              la validation du paiement.
            </p>
          ),
        },
        {
          title: "Sous quel délai ma commande est-elle expédiée ?",
          body: (
            <p>
              Votre commande est préparée et expédiée sous{" "}
              <strong>24 à 48&nbsp;heures</strong> après confirmation du
              paiement. Le délai d’acheminement dépend ensuite du transporteur
              et de la destination. Voir l’
              <a href="/legal/cgv#preparation-livraison" style={gold}>
                article 12 des CGV
              </a>
              .
            </p>
          ),
        },
        {
          title: "Où livrez-vous ?",
          body: (
            <p>
              Nous livrons en <strong>France et en Europe</strong>. Les zones,
              transporteurs et modalités sont précisés à l’
              <a href="/legal/cgv#preparation-livraison" style={gold}>
                article 12 des CGV
              </a>
              .
            </p>
          ),
        },
        {
          title: "Quels moyens de paiement acceptez-vous ?",
          body: (
            <p>
              Le paiement s’effectue par carte bancaire, via une page de
              paiement sécurisée hébergée par <strong>Stripe</strong>. Vos
              coordonnées bancaires ne transitent jamais par nos serveurs et ne
              sont pas conservées par Vanille’Or. Voir l’
              <a href="/legal/cgv#paiement" style={gold}>
                article 11 des CGV
              </a>
              .
            </p>
          ),
        },
        {
          title: "Comment suivre ma commande ?",
          body: (
            <p>
              Retrouvez l’historique et le statut de vos commandes dans votre{" "}
              <a href="/account/orders" style={gold}>
                espace client
              </a>
              . Un email de confirmation vous est également envoyé après
              chaque paiement validé.
            </p>
          ),
        },
        {
          title: "Puis-je changer d’avis après ma commande ?",
          body: (
            <p>
              Vous disposez d’un droit de rétractation de{" "}
              <strong>quatorze (14) jours</strong>. Certaines exceptions
              s’appliquent aux denrées alimentaires descellées. Consultez les
              articles{" "}
              <a href="/legal/cgv#droit-retractation" style={gold}>
                17
              </a>{" "}
              et{" "}
              <a href="/legal/cgv#exceptions-retractation" style={gold}>
                18
              </a>{" "}
              des CGV.
            </p>
          ),
        },
        {
          title: "Comment effectuer un retour ou un remboursement ?",
          body: (
            <p>
              Les modalités de retour sont décrites à l’
              <a href="/legal/cgv#retours" style={gold}>
                article 19
              </a>{" "}
              et les conditions de remboursement à l’
              <a href="/legal/cgv#remboursements" style={gold}>
                article 20
              </a>{" "}
              des CGV.
            </p>
          ),
        },
        {
          title: "Un problème avec ma commande ?",
          body: (
            <p>
              Ouvrez une demande via notre{" "}
              <a href="/reclamation" style={gold}>
                formulaire de réclamation
              </a>
              . Chaque demande est enregistrée et suivie. Notre équipe est
              disponible du lundi au vendredi, de 10h à 18h.
            </p>
          ),
        },
      ]}
    />
  );
}
