import type { Metadata } from "next";
import LegalPageLayout, {
  type LegalSection,
} from "@/components/legal/LegalPageLayout";

const description =
  "Consultez les Conditions Générales d'Utilisation du site Vanille'Or. Elles encadrent l'utilisation de notre boutique en ligne, des services proposés et de votre espace client.";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation | Vanille'Or",
  description,
  alternates: {
    canonical: "/legal/cgu",
  },
  openGraph: {
    title: "Conditions Générales d'Utilisation | Vanille'Or",
    description,
    type: "website",
  },
};

const sections: LegalSection[] = [
  {
    id: "objet",
    title: "1. Objet",
    content: (
      <p>
        Les présentes Conditions Générales d’Utilisation ont pour
        objet d’encadrer les modalités d’accès et d’utilisation du
        site Vanille’Or ainsi que des services proposés aux
        utilisateurs.
      </p>
    ),
  },
  {
    id: "acceptation",
    title: "2. Acceptation des conditions",
    content: (
      <>
        <p>
          Toute navigation sur le site implique l’acceptation pleine
          et entière des présentes Conditions Générales
          d’Utilisation.
        </p>

        <p>
          Les utilisateurs disposant d’un compte client s’engagent
          également à respecter ces conditions lors de l’utilisation
          de leur espace personnel.
        </p>
      </>
    ),
  },
  {
    id: "acces-site",
    title: "3. Accès au site",
    content: (
      <>
        <p>
          Le site est accessible gratuitement à tout utilisateur
          disposant d’un accès à Internet.
        </p>

        <p>
          Certaines fonctionnalités, notamment la commande de
          produits ou l’accès à l’espace client, nécessitent la
          création d’un compte ou la fourniture d’informations
          personnelles.
        </p>

        <p>
          Vanille’Or s’efforce d’assurer un accès continu au site
          mais ne peut garantir une disponibilité permanente.
        </p>
      </>
    ),
  },
  {
    id: "creation-compte",
    title: "4. Création d’un compte",
    content: (
      <>
        <p>L’utilisateur peut créer un compte personnel afin de :</p>

        <ul>
          <li>suivre ses commandes ;</li>
          <li>enregistrer plusieurs adresses ;</li>
          <li>accéder à son historique ;</li>
          <li>gérer ses informations personnelles ;</li>
          <li>créer une liste de souhaits ;</li>
          <li>
            recevoir des communications si son consentement est
            donné.
          </li>
        </ul>

        <p>
          L’utilisateur s’engage à fournir des informations exactes
          et à les maintenir à jour.
        </p>

        <p>
          Les identifiants de connexion sont strictement personnels
          et confidentiels.
        </p>
      </>
    ),
  },
  {
    id: "espace-client",
    title: "5. Espace client",
    content: (
      <>
        <p>
          Chaque utilisateur est responsable de l’utilisation de son
          compte.
        </p>

        <p>
          En cas d’utilisation frauduleuse ou de suspicion d’accès
          non autorisé, il appartient à l’utilisateur d’en informer
          Vanille’Or dans les meilleurs délais.
        </p>

        <p>
          Vanille’Or pourra suspendre temporairement un compte afin
          de préserver la sécurité des données et des utilisateurs.
        </p>
      </>
    ),
  },
  {
    id: "obligations-utilisateur",
    title: "6. Obligations de l’utilisateur",
    content: (
      <>
        <p>L’utilisateur s’engage notamment à :</p>

        <ul>
          <li>utiliser le site conformément à la loi ;</li>
          <li>respecter les droits de propriété intellectuelle ;</li>
          <li>ne pas perturber le fonctionnement du site ;</li>
          <li>
            ne pas tenter d’accéder frauduleusement aux systèmes
            informatiques ;
          </li>
          <li>
            ne pas diffuser de contenus illicites, diffamatoires ou
            frauduleux ;
          </li>
          <li>préserver la confidentialité de ses identifiants.</li>
        </ul>
      </>
    ),
  },
  {
    id: "propriete-intellectuelle",
    title: "7. Propriété intellectuelle",
    content: (
      <>
        <p>
          Tous les contenus présents sur le site Vanille’Or
          demeurent la propriété exclusive de KANAYA.
        </p>

        <p>
          Toute reproduction, adaptation, diffusion ou exploitation,
          totale ou partielle, sans autorisation écrite préalable est
          interdite.
        </p>
      </>
    ),
  },
  {
    id: "disponibilite-service",
    title: "8. Disponibilité du service",
    content: (
      <>
        <p>
          Vanille’Or met tout en œuvre afin d’assurer le bon
          fonctionnement du site.
        </p>

        <p>Des interruptions peuvent toutefois intervenir pour :</p>

        <ul>
          <li>maintenance ;</li>
          <li>mises à jour ;</li>
          <li>sécurité ;</li>
          <li>évolution des fonctionnalités.</li>
        </ul>

        <p>
          Ces interruptions ne pourront donner lieu à indemnisation.
        </p>
      </>
    ),
  },
  {
    id: "liens-externes",
    title: "9. Liens externes",
    content: (
      <p>
        Le site peut contenir des liens vers des services ou sites
        tiers. Vanille’Or ne peut être tenu responsable du contenu ou
        des pratiques de ces sites externes.
      </p>
    ),
  },
  {
    id: "protection-donnees",
    title: "10. Protection des données",
    content: (
      <p>
        Le traitement des données personnelles est réalisé
        conformément à la{" "}
        <a href="/legal/confidentialite">
          Politique de confidentialité
        </a>{" "}
        disponible sur le site.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "11. Cookies",
    content: (
      <p>
        L’utilisation des cookies est décrite dans notre{" "}
        <a href="/legal/cookies">Politique de cookies</a>. Les
        utilisateurs peuvent gérer leurs préférences à tout moment
        via le gestionnaire de consentement.
      </p>
    ),
  },
  {
    id: "responsabilite",
    title: "12. Responsabilité",
    content: (
      <>
        <p>
          Vanille’Or met tout en œuvre pour garantir l’exactitude des
          informations publiées.
        </p>

        <p>Toutefois :</p>

        <ul>
          <li>certaines erreurs peuvent subsister ;</li>
          <li>
            les photographies sont présentées à titre illustratif ;
          </li>
          <li>
            les produits naturels peuvent présenter des variations
            d’aspect, de taille, de couleur ou de texture sans que
            cela n’affecte leur qualité.
          </li>
        </ul>

        <p>
          Vanille’Or ne saurait être tenu responsable des dommages
          indirects liés à l’utilisation du site.
        </p>
      </>
    ),
  },
  {
    id: "modification",
    title: "13. Modification des CGU",
    content: (
      <>
        <p>
          Les présentes Conditions Générales d’Utilisation peuvent
          être modifiées à tout moment afin de tenir compte des
          évolutions :
        </p>

        <ul>
          <li>légales ;</li>
          <li>réglementaires ;</li>
          <li>techniques ;</li>
          <li>commerciales.</li>
        </ul>

        <p>
          La date de mise à jour figurera en bas de cette page.
        </p>
      </>
    ),
  },
  {
    id: "droit-applicable",
    title: "14. Droit applicable",
    content: (
      <p>
        Les présentes CGU sont régies par le droit français. Tout
        litige sera soumis aux juridictions compétentes conformément
        aux dispositions applicables.
      </p>
    ),
  },
];

export default function CguPage() {
  return (
    <LegalPageLayout
      title="Conditions Générales d’Utilisation"
      intro="Les présentes Conditions Générales d’Utilisation définissent les règles applicables à l’utilisation du site Vanille’Or, de ses services et de votre espace client. Elles ont pour objectif de garantir une expérience fiable, transparente et sécurisée pour tous les utilisateurs."
      lastUpdated="2 juillet 2026"
      sections={sections}
      breadcrumbCurrent="Conditions Générales d’Utilisation"
      slug="/legal/cgu"
      metaDescription={description}
      relatedLinks={[
        { label: "Conditions Générales de Vente", href: "/cgv" },
        {
          label: "Politique de confidentialité",
          href: "/legal/confidentialite",
        },
        { label: "Politique de cookies", href: "/legal/cookies" },
        {
          label: "Mentions légales",
          href: "/legal/mentions-legales",
        },
      ]}
      closing={{
        title: "Une expérience fondée sur la confiance",
        paragraphs: [
          "Chez Vanille’Or, nous souhaitons offrir bien plus qu’une boutique en ligne. Nos Conditions Générales d’Utilisation reflètent notre engagement en faveur d’une expérience transparente, sécurisée et respectueuse de chacun de nos visiteurs et clients.",
        ],
      }}
    />
  );
}
