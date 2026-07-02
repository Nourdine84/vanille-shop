import type { Metadata } from "next";
import LegalPageLayout, {
  type LegalSection,
} from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Mentions légales | Vanille'Or – Informations légales",
  description:
    "Retrouvez l'ensemble des informations légales concernant l'exploitation du site Vanille'Or, éditeur, hébergement, propriété intellectuelle et responsabilités.",
  alternates: {
    canonical: "/legal/mentions-legales",
  },
  openGraph: {
    title: "Mentions légales | Vanille'Or – Informations légales",
    description:
      "Retrouvez l'ensemble des informations légales concernant l'exploitation du site Vanille'Or, éditeur, hébergement, propriété intellectuelle et responsabilités.",
    type: "website",
  },
};

const sections: LegalSection[] = [
  {
    id: "editeur",
    title: "1. Éditeur du site",
    content: (
      <>
        <p>Vanille’Or est une marque commerciale exploitée par :</p>

        <p>
          <strong>KANAYA</strong>
          <br />
          Micro-entreprise
          <br />
          SIRET : 103 883 153 00019
          <br />
          TVA intracommunautaire : FR14103883153
        </p>

        <p>
          Siège social :
          <br />
          18 rue du Pont Colbert
          <br />
          78000 Versailles
          <br />
          France
        </p>

        <p>
          Service client :
          <br />
          📧{" "}
          <a href="mailto:contact@vanilleor.fr">
            contact@vanilleor.fr
          </a>
          <br />
          📞 <a href="tel:0646920348">06 46 92 03 48</a>
        </p>

        <p>
          Horaires :
          <br />
          Du lundi au vendredi
          <br />
          10h00 – 18h00
        </p>
      </>
    ),
  },
  {
    id: "directeur-publication",
    title: "2. Directeur de publication",
    content: (
      <>
        <p>Le directeur de publication du site est :</p>

        <p>
          Mathy Leclercq
          <br />
          Téléphone : <a href="tel:0612400608">06 12 40 06 08</a>
        </p>
      </>
    ),
  },
  {
    id: "hebergement",
    title: "3. Hébergement",
    content: (
      <>
        <p>Le site Vanille’Or est hébergé par :</p>

        <p>
          Vercel Inc.
          <br />
          440 N Barranca Avenue #4133
          <br />
          Covina, California 91723
          <br />
          États-Unis
        </p>

        <p>Le nom de domaine est enregistré auprès de :</p>

        <p>
          OVHcloud
          <br />
          2 rue Kellermann
          <br />
          59100 Roubaix
          <br />
          France
        </p>
      </>
    ),
  },
  {
    id: "acces-site",
    title: "4. Accès au site",
    content: (
      <>
        <p>Le site est accessible 24h/24 et 7j/7.</p>

        <p>
          Des interruptions temporaires peuvent toutefois être
          nécessaires afin d’assurer :
        </p>

        <ul>
          <li>la maintenance du site ;</li>
          <li>les mises à jour de sécurité ;</li>
          <li>les améliorations techniques ;</li>
          <li>les évolutions fonctionnelles.</li>
        </ul>

        <p>
          Vanille’Or s’efforce de limiter au maximum la durée de ces
          interruptions.
        </p>
      </>
    ),
  },
  {
    id: "propriete-intellectuelle",
    title: "5. Propriété intellectuelle",
    content: (
      <>
        <p>
          L’ensemble des éléments présents sur le site Vanille’Or est
          protégé par le Code de la propriété intellectuelle.
        </p>

        <p>Cela comprend notamment :</p>

        <ul>
          <li>le logo Vanille’Or ;</li>
          <li>l’identité visuelle ;</li>
          <li>les photographies ;</li>
          <li>les illustrations ;</li>
          <li>les textes ;</li>
          <li>les descriptions produits ;</li>
          <li>les vidéos ;</li>
          <li>les icônes ;</li>
          <li>les éléments graphiques ;</li>
          <li>la structure du site.</li>
        </ul>

        <p>
          Toute reproduction, représentation, diffusion, modification
          ou exploitation, totale ou partielle, sans autorisation
          écrite préalable est strictement interdite.
        </p>
      </>
    ),
  },
  {
    id: "utilisation-site",
    title: "6. Utilisation du site",
    content: (
      <>
        <p>
          L’utilisateur s’engage à utiliser le site conformément aux
          lois françaises en vigueur.
        </p>

        <p>Il lui est notamment interdit :</p>

        <ul>
          <li>de perturber le fonctionnement du site ;</li>
          <li>d’utiliser les contenus à des fins illicites ;</li>
          <li>
            de tenter d’accéder aux systèmes informatiques sans
            autorisation ;
          </li>
          <li>
            de porter atteinte aux droits de Vanille’Or ou de tiers.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "responsabilite",
    title: "7. Responsabilité",
    content: (
      <>
        <p>
          Vanille’Or met tout en œuvre afin d’assurer l’exactitude
          des informations publiées.
        </p>

        <p>
          Malgré toute l’attention apportée à leur rédaction,
          certaines informations peuvent évoluer ou contenir des
          erreurs involontaires.
        </p>

        <p>
          Les photographies sont présentées à titre illustratif. Les
          produits naturels pouvant présenter des variations de
          taille, de couleur ou d’aspect, les visuels ne sont pas
          contractuels.
        </p>
      </>
    ),
  },
  {
    id: "liens-externes",
    title: "8. Liens externes",
    content: (
      <p>
        Le site peut contenir des liens vers des sites internet
        tiers. Vanille’Or ne saurait être tenu responsable du
        contenu, des services ou des politiques appliquées par ces
        sites.
      </p>
    ),
  },
  {
    id: "donnees-personnelles",
    title: "9. Données personnelles",
    content: (
      <p>
        Les traitements de données personnelles sont détaillés dans
        notre{" "}
        <a href="/legal/confidentialite">
          Politique de confidentialité
        </a>
        ,
        accessible depuis le{" "}
        <a href="/confiance">Centre de Confiance</a>.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "10. Cookies",
    content: (
      <p>
        Le site utilise des cookies nécessaires à son fonctionnement
        ainsi que, sous réserve de votre consentement, des cookies
        destinés à améliorer votre expérience et à mesurer
        l’audience. Le détail est disponible dans notre{" "}
        <a href="/legal/cookies">Politique de cookies</a>.
      </p>
    ),
  },
  {
    id: "droit-applicable",
    title: "11. Droit applicable",
    content: (
      <p>
        Les présentes mentions légales sont régies par le droit
        français. Tout litige sera soumis aux juridictions françaises
        territorialement compétentes, sous réserve des dispositions
        protectrices applicables aux consommateurs.
      </p>
    ),
  },
];

export default function MentionsLegalesPage() {
  return (
    <LegalPageLayout
      title="Mentions légales"
      intro="La transparence fait partie de notre engagement. Les présentes mentions légales ont pour objet d’informer les utilisateurs sur l’identité de l’éditeur du site, les conditions de son exploitation ainsi que les droits et responsabilités applicables à son utilisation."
      lastUpdated="2 juillet 2026"
      sections={sections}
      breadcrumbCurrent="Mentions légales"
      slug="/legal/mentions-legales"
      metaDescription="Retrouvez l'ensemble des informations légales concernant l'exploitation du site Vanille'Or, éditeur, hébergement, propriété intellectuelle et responsabilités."
      relatedLinks={[
        {
          label: "Politique de confidentialité",
          href: "/legal/confidentialite",
        },
        { label: "Politique de cookies", href: "/legal/cookies" },
        { label: "CGV", href: "/cgv" },
        { label: "CGU", href: "/legal/cgu" },
      ]}
      closing={{
        title: "Notre engagement",
        paragraphs: [
          "Chez Vanille’Or, nous attachons autant d’importance à la qualité de nos produits qu’à la transparence de notre activité.",
          "Nous mettons un point d’honneur à fournir des informations claires, accessibles et conformes à la réglementation afin de construire une relation de confiance durable avec chacun de nos clients.",
        ],
      }}
    />
  );
}
