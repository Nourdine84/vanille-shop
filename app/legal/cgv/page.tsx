import type { Metadata } from "next";
import LegalPageLayout, {
  type LegalSection,
} from "@/components/legal/LegalPageLayout";

const description =
  "Consultez les Conditions Générales de Vente de Vanille'Or applicables à toutes les commandes réalisées sur notre boutique en ligne.";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente | Vanille'Or",
  description,
  alternates: {
    canonical: "/legal/cgv",
  },
  openGraph: {
    title: "Conditions Générales de Vente | Vanille'Or",
    description,
    type: "website",
  },
};

const PARTIE_1 = "Partie I — Présentation";

const sections: LegalSection[] = [
  {
    id: "objet",
    title: "Article 1 — Objet",
    group: PARTIE_1,
    content: (
      <>
        <p>
          Les présentes Conditions Générales de Vente (CGV)
          définissent les conditions dans lesquelles Vanille’Or
          commercialise ses produits auprès de ses clients via son
          site internet.
        </p>

        <p>Elles encadrent notamment :</p>

        <ul>
          <li>la commande des produits ;</li>
          <li>leur paiement ;</li>
          <li>leur préparation ;</li>
          <li>leur expédition ;</li>
          <li>leur livraison ;</li>
          <li>les droits et obligations des parties.</li>
        </ul>

        <p>
          Toute commande implique l’acceptation sans réserve des
          présentes Conditions Générales de Vente.
        </p>
      </>
    ),
  },
  {
    id: "champ-application",
    title: "Article 2 — Champ d’application",
    group: PARTIE_1,
    content: (
      <>
        <p>
          Les présentes CGV s’appliquent à l’ensemble des ventes
          conclues sur le site Vanille’Or.
        </p>

        <p>Elles concernent notamment les produits suivants :</p>

        <ul>
          <li>Vanille Bourbon de Madagascar ;</li>
          <li>Vanille Gourmet ;</li>
          <li>Vanille Pompona ;</li>
          <li>Vanille Givrée ;</li>
          <li>Vanille en poudre ;</li>
          <li>Caviar de vanille ;</li>
          <li>Extrait de vanille ;</li>
          <li>Cannelle ;</li>
          <li>Poivres ;</li>
          <li>Girofle ;</li>
          <li>Cacao ;</li>
        </ul>

        <p>
          ainsi que tout autre produit proposé ultérieurement sur la
          boutique.
        </p>

        <p>
          Ces conditions s’appliquent à tous les consommateurs
          passant commande depuis la France ou tout autre pays
          desservi par Vanille’Or.
        </p>
      </>
    ),
  },
  {
    id: "acceptation",
    title: "Article 3 — Acceptation des CGV",
    group: PARTIE_1,
    content: (
      <>
        <p>
          Toute validation de commande vaut acceptation pleine et
          entière des présentes Conditions Générales de Vente.
        </p>

        <p>Le client reconnaît :</p>

        <ul>
          <li>avoir pris connaissance des CGV avant toute commande ;</li>
          <li>disposer de la capacité juridique nécessaire ;</li>
          <li>fournir des informations exactes ;</li>
          <li>
            agir en qualité de consommateur ou de professionnel selon
            sa situation.
          </li>
        </ul>

        <p>
          Les présentes CGV prévalent sur tout autre document sauf
          accord écrit contraire.
        </p>
      </>
    ),
  },
  {
    id: "informations-vendeur",
    title: "Article 4 — Informations sur le vendeur",
    group: PARTIE_1,
    content: (
      <>
        <p>
          Les produits commercialisés sur le présent site sont
          vendus par :
        </p>

        <p>
          <strong>KANAYA</strong>
          <br />
          Nom commercial : Vanille’Or
        </p>

        <p>
          Adresse :
          <br />
          18 rue du Pont Colbert
          <br />
          78000 Versailles
          <br />
          France
        </p>

        <p>
          SIRET : 10388315300019
          <br />
          TVA intracommunautaire : FR14103883153
        </p>

        <p>
          Service client :{" "}
          <a href="mailto:contact@vanilleor.fr">
            contact@vanilleor.fr
          </a>
          <br />
          Téléphone : <a href="tel:0646920348">06 46 92 03 48</a>
        </p>

        <p>
          Horaires :
          <br />
          Lundi au vendredi
          <br />
          10h00 à 18h00
        </p>
      </>
    ),
  },
  {
    id: "definitions",
    title: "Article 5 — Définitions",
    group: PARTIE_1,
    content: (
      <>
        <p>
          Dans les présentes Conditions Générales de Vente, les
          termes suivants désignent :
        </p>

        <p>
          <strong>Site</strong>
          <br />
          Le site internet officiel Vanille’Or.
        </p>

        <p>
          <strong>Client</strong>
          <br />
          Toute personne physique ou morale procédant à un achat sur
          le site.
        </p>

        <p>
          <strong>Compte client</strong>
          <br />
          L’espace personnel permettant au client de gérer ses
          commandes, ses adresses, son historique d’achat et ses
          préférences.
        </p>

        <p>
          <strong>Produit</strong>
          <br />
          Tout article proposé à la vente sur la boutique Vanille’Or.
        </p>

        <p>
          <strong>Commande</strong>
          <br />
          Toute validation d’achat effectuée via le site.
        </p>

        <p>
          <strong>Transporteur</strong>
          <br />
          Toute société chargée de l’acheminement des produits
          jusqu’au client.
        </p>
      </>
    ),
  },
];

export default function CgvPage() {
  return (
    <LegalPageLayout
      title="Conditions Générales de Vente"
      intro="Les présentes Conditions Générales de Vente définissent les droits et obligations entre Vanille’Or et ses clients dans le cadre de la vente en ligne de nos produits."
      lastUpdated="2 juillet 2026"
      version="v1.0"
      sections={sections}
      breadcrumbCurrent="Conditions Générales de Vente"
      slug="/legal/cgv"
      metaDescription={description}
      printLabel="Imprimer les CGV"
      relatedLinks={[
        { label: "CGU", href: "/legal/cgu" },
        {
          label: "Politique de confidentialité",
          href: "/legal/confidentialite",
        },
        { label: "Politique de cookies", href: "/legal/cookies" },
        {
          label: "Mentions légales",
          href: "/legal/mentions-legales",
        },
        { label: "Livraison (à venir)", href: "/legal/livraison" },
        { label: "Retours (à venir)", href: "/legal/retours" },
      ]}
      closing={{
        title: "Notre engagement",
        paragraphs: [
          "Chez Vanille’Or, chaque commande bénéficie du même niveau d’exigence que les produits que nous sélectionnons. Nous privilégions une information claire, transparente et accessible afin de construire une relation de confiance durable avec chacun de nos clients.",
        ],
      }}
    />
  );
}
