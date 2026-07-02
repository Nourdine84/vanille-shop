import type { Metadata } from "next";
import LegalPageLayout, {
  type LegalSection,
} from "@/components/legal/LegalPageLayout";

const description =
  "Découvrez comment Vanille'Or utilise les cookies afin d'améliorer votre expérience, mesurer l'audience du site et sécuriser votre navigation.";

export const metadata: Metadata = {
  title: "Politique de cookies | Vanille'Or",
  description,
  alternates: {
    canonical: "/legal/cookies",
  },
  openGraph: {
    title: "Politique de cookies | Vanille'Or",
    description,
    type: "website",
  },
};

const sections: LegalSection[] = [
  {
    id: "quest-ce-quun-cookie",
    title: "1. Qu’est-ce qu’un cookie ?",
    content: (
      <>
        <p>
          Un cookie est un petit fichier texte enregistré sur votre
          appareil lorsque vous consultez un site internet.
        </p>

        <p>
          Il permet notamment de mémoriser certaines informations
          afin de faciliter votre navigation, sécuriser votre
          session ou améliorer les performances du site.
        </p>
      </>
    ),
  },
  {
    id: "pourquoi-cookies",
    title: "2. Pourquoi utilisons-nous des cookies ?",
    content: (
      <>
        <p>Vanille’Or utilise certains cookies pour :</p>

        <ul>
          <li>assurer le fonctionnement du site ;</li>
          <li>sécuriser votre navigation ;</li>
          <li>mémoriser vos préférences ;</li>
          <li>conserver votre panier ;</li>
          <li>améliorer les performances ;</li>
          <li>mesurer l’audience du site ;</li>
          <li>optimiser l’expérience utilisateur.</li>
        </ul>
      </>
    ),
  },
  {
    id: "cookies-necessaires",
    title: "3. Les cookies strictement nécessaires",
    content: (
      <>
        <p>Ces cookies sont indispensables au fonctionnement du site.</p>

        <p>Ils permettent notamment :</p>

        <ul>
          <li>l’authentification ;</li>
          <li>la gestion du panier ;</li>
          <li>la sécurité ;</li>
          <li>la protection contre certaines attaques ;</li>
          <li>le maintien de la session utilisateur.</li>
        </ul>

        <p>Ils ne peuvent pas être désactivés.</p>
      </>
    ),
  },
  {
    id: "cookies-audience",
    title: "4. Les cookies de mesure d’audience",
    content: (
      <>
        <p>
          Sous réserve de votre consentement, Vanille’Or peut
          utiliser des outils de mesure d’audience tels que Google
          Analytics afin de comprendre :
        </p>

        <ul>
          <li>le nombre de visiteurs ;</li>
          <li>les pages consultées ;</li>
          <li>le temps passé sur le site ;</li>
          <li>les parcours de navigation ;</li>
          <li>les performances générales.</li>
        </ul>

        <p>
          Ces données sont utilisées uniquement à des fins
          statistiques.
        </p>
      </>
    ),
  },
  {
    id: "cookies-paiement",
    title: "5. Les cookies liés au paiement",
    content: (
      <>
        <p>
          Lors du paiement sécurisé, certains cookies peuvent être
          déposés par notre partenaire Stripe.
        </p>

        <p>Ils permettent notamment :</p>

        <ul>
          <li>de sécuriser la transaction ;</li>
          <li>de prévenir la fraude ;</li>
          <li>d’assurer le bon déroulement du paiement.</li>
        </ul>

        <p>Vanille’Or ne stocke jamais les données bancaires.</p>
      </>
    ),
  },
  {
    id: "cookies-preferences",
    title: "6. Les cookies de préférences",
    content: (
      <>
        <p>Ces cookies permettent notamment :</p>

        <ul>
          <li>de mémoriser votre langue ;</li>
          <li>certaines préférences d’affichage ;</li>
          <li>votre consentement relatif aux cookies.</li>
        </ul>
      </>
    ),
  },
  {
    id: "cookies-tiers",
    title: "7. Les cookies tiers",
    content: (
      <>
        <p>
          Certaines fonctionnalités peuvent faire intervenir des
          services tiers.
        </p>

        <p>
          Selon les fonctionnalités activées, il peut notamment
          s’agir de :
        </p>

        <ul>
          <li>Stripe</li>
          <li>Google Analytics</li>
          <li>Google Fonts</li>
        </ul>

        <p>
          Ces services disposent de leurs propres politiques de
          confidentialité.
        </p>
      </>
    ),
  },
  {
    id: "duree-conservation",
    title: "8. Durée de conservation",
    content: (
      <>
        <p>
          Les cookies sont conservés uniquement pendant la durée
          nécessaire à leur finalité.
        </p>

        <p>La durée peut varier selon leur nature.</p>

        <p>
          Les cookies de consentement sont conservés conformément à
          la réglementation applicable.
        </p>
      </>
    ),
  },
  {
    id: "gestion-consentement",
    title: "9. Gestion du consentement",
    content: (
      <>
        <p>Lors de votre première visite, un bandeau vous permet :</p>

        <ul>
          <li>d’accepter tous les cookies ;</li>
          <li>de les refuser ;</li>
          <li>de personnaliser votre choix.</li>
        </ul>

        <p>Vous pouvez modifier votre consentement à tout moment.</p>
      </>
    ),
  },
  {
    id: "supprimer-cookies",
    title: "10. Comment supprimer les cookies ?",
    content: (
      <>
        <p>La plupart des navigateurs permettent :</p>

        <ul>
          <li>de consulter les cookies enregistrés ;</li>
          <li>de les supprimer ;</li>
          <li>de bloquer certains cookies.</li>
        </ul>

        <p>Le paramétrage dépend de votre navigateur.</p>
      </>
    ),
  },
  {
    id: "vos-droits",
    title: "11. Vos droits",
    content: (
      <p>
        Vous pouvez exercer vos droits concernant vos données
        personnelles conformément au RGPD. Consultez également notre{" "}
        <a href="/legal/confidentialite">
          Politique de confidentialité
        </a>
        .
      </p>
    ),
  },
  {
    id: "modification",
    title: "12. Modification de cette politique",
    content: (
      <>
        <p>Cette politique peut évoluer afin de tenir compte :</p>

        <ul>
          <li>des évolutions réglementaires ;</li>
          <li>des évolutions techniques ;</li>
          <li>des nouveaux services proposés.</li>
        </ul>
      </>
    ),
  },
];

export default function CookiesPage() {
  return (
    <LegalPageLayout
      title="Politique de cookies"
      intro="Chez Vanille’Or, nous utilisons des cookies afin d’assurer le bon fonctionnement du site, d’améliorer votre expérience utilisateur et, avec votre consentement, de mesurer l’audience de notre boutique."
      lastUpdated="2 juillet 2026"
      sections={sections}
      breadcrumbCurrent="Politique de cookies"
      slug="/legal/cookies"
      metaDescription={description}
      relatedLinks={[
        {
          label: "Politique de confidentialité",
          href: "/legal/confidentialite",
        },
        { label: "CGV", href: "/cgv" },
        { label: "CGU", href: "/legal/cgu" },
        {
          label: "Mentions légales",
          href: "/legal/mentions-legales",
        },
      ]}
      closing={{
        title: "Votre choix vous appartient",
        paragraphs: [
          "Chez Vanille’Or, nous privilégions une utilisation responsable des cookies.",
          "Nous ne déposons que les cookies strictement nécessaires au fonctionnement du site sans votre consentement.",
          "Les autres cookies sont activés uniquement avec votre accord afin de respecter votre vie privée.",
        ],
      }}
    />
  );
}
