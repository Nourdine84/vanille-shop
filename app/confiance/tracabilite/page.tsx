import type { Metadata } from "next";
import ConfianceSubPage from "@/components/confiance/ConfianceSubPage";

const description =
  "Le parcours des produits Vanille’Or, de la récolte à Madagascar jusqu’à votre livraison, et l’état réel de notre traçabilité.";

export const metadata: Metadata = {
  title: "Traçabilité | Vanille’Or",
  description,
  alternates: {
    canonical: "/confiance/tracabilite",
  },
  openGraph: {
    title: "Traçabilité | Vanille’Or",
    description,
    type: "website",
  },
};

export default function TracabilitePage() {
  return (
    <ConfianceSubPage
      title="Traçabilité"
      intro="Le parcours de nos produits, de la récolte jusqu’à votre porte — et ce que nous savons précisément à chaque étape."
      cta={{ label: "Nous poser une question", href: "/contact" }}
      sections={[
        {
          title: "1. La récolte",
          body: (
            <p>
              Les gousses sont récoltées à Madagascar, à maturité. C’est cette
              étape qui détermine l’essentiel du potentiel aromatique&nbsp;:
              une gousse récoltée trop tôt ne développera jamais son profil
              complet, quelle que soit la préparation ultérieure.
            </p>
          ),
        },
        {
          title: "2. La préparation",
          body: (
            <p>
              Vient ensuite l’échaudage, l’étuvage puis un séchage lent,
              suivis d’une période d’affinage. C’est durant cette phase que se
              forme la vanilline et que la gousse acquiert sa souplesse et sa
              couleur sombre caractéristiques.
            </p>
          ),
        },
        {
          title: "3. La sélection Vanille’Or",
          body: (
            <p>
              Les lots nous parviennent et sont contrôlés avant mise en vente,
              selon les critères décrits dans notre page{" "}
              <a href="/confiance/qualite" style={{ color: "#a16207" }}>
                Notre qualité
              </a>
              . Les lots non retenus ne sont pas commercialisés.
            </p>
          ),
        },
        {
          title: "4. L’expédition",
          body: (
            <p>
              Votre commande est préparée puis expédiée sous 24 à 48&nbsp;heures
              après confirmation du paiement. Les modalités de livraison sont
              détaillées à l’
              <a
                href="/legal/cgv#preparation-livraison"
                style={{ color: "#a16207" }}
              >
                article 12 de nos CGV
              </a>
              .
            </p>
          ),
        },
        {
          title: "Où nous en sommes",
          body: (
            <p>
              En toute transparence&nbsp;: nous identifions l’origine de nos
              lots, mais nous ne proposons pas encore de{" "}
              <strong>traçabilité individuelle par numéro de lot</strong>{" "}
              consultable en ligne. C’est un chantier en cours. Nous préférons
              l’annoncer plutôt que de laisser croire à un niveau de suivi que
              nous n’offrons pas aujourd’hui.
            </p>
          ),
        },
      ]}
    />
  );
}
