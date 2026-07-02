import type { Metadata } from "next";
import LegalPageLayout, {
  type LegalSection,
} from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Politique de confidentialité | Vanille'Or",
  description:
    "Découvrez comment Vanille'Or collecte, utilise et protège vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD).",
  alternates: {
    canonical: "/legal/confidentialite",
  },
  openGraph: {
    title: "Politique de confidentialité | Vanille'Or",
    description:
      "Découvrez comment Vanille'Or collecte, utilise et protège vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD).",
    type: "website",
  },
};

const sections: LegalSection[] = [
  {
    id: "responsable-traitement",
    title: "1. Responsable du traitement",
    content: (
      <>
        <p>
          Le responsable du traitement des données personnelles est :
        </p>

        <p>
          <strong>KANAYA</strong>
          <br />
          Nom commercial : Vanille’Or
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
          <a href="mailto:contact@vanilleor.fr">
            contact@vanilleor.fr
          </a>
          <br />
          Téléphone :{" "}
          <a href="tel:0646920348">06 46 92 03 48</a>
        </p>
      </>
    ),
  },
  {
    id: "donnees-collectees",
    title: "2. Les données que nous collectons",
    content: (
      <>
        <p>
          Selon votre utilisation du site, nous pouvons collecter les
          informations suivantes :
        </p>

        <p>
          <strong>Informations d’identification</strong>
        </p>
        <ul>
          <li>Nom</li>
          <li>Prénom</li>
        </ul>

        <p>
          <strong>Coordonnées</strong>
        </p>
        <ul>
          <li>Adresse e-mail</li>
          <li>Numéro de téléphone</li>
          <li>Adresse postale</li>
          <li>Adresse de livraison</li>
          <li>Adresse de facturation</li>
        </ul>

        <p>
          <strong>Informations de commande</strong>
        </p>
        <ul>
          <li>Produits commandés</li>
          <li>Montant</li>
          <li>Numéro de commande</li>
          <li>Historique des achats</li>
          <li>Statut de la commande</li>
        </ul>

        <p>
          <strong>Informations de paiement</strong>
          <br />
          Les paiements sont traités exclusivement par notre
          prestataire sécurisé Stripe. Vanille’Or ne stocke jamais
          les numéros de carte bancaire.
        </p>
      </>
    ),
  },
  {
    id: "donnees-automatiques",
    title: "3. Données collectées automatiquement",
    content: (
      <>
        <p>
          Lors de votre navigation, certaines informations techniques
          peuvent être recueillies :
        </p>

        <ul>
          <li>Adresse IP</li>
          <li>Type d’appareil</li>
          <li>Navigateur</li>
          <li>Système d’exploitation</li>
          <li>Pages consultées</li>
          <li>Temps passé sur le site</li>
          <li>Provenance de la visite</li>
          <li>Cookies</li>
        </ul>
      </>
    ),
  },
  {
    id: "pourquoi-collecte",
    title: "4. Pourquoi collectons-nous ces données ?",
    content: (
      <>
        <p>Vos données sont utilisées afin de :</p>

        <ul>
          <li>traiter vos commandes ;</li>
          <li>assurer leur livraison ;</li>
          <li>répondre à vos demandes ;</li>
          <li>gérer votre compte client ;</li>
          <li>améliorer le fonctionnement du site ;</li>
          <li>mesurer les performances du site ;</li>
          <li>prévenir les fraudes ;</li>
          <li>respecter nos obligations légales.</li>
        </ul>

        <p>Nous ne revendons jamais vos données personnelles.</p>
      </>
    ),
  },
  {
    id: "base-legale",
    title: "5. Base légale des traitements",
    content: (
      <>
        <p>Les traitements reposent notamment sur :</p>

        <ul>
          <li>
            l’exécution du contrat lorsque vous passez une commande ;
          </li>
          <li>
            votre consentement pour les cookies et la newsletter ;
          </li>
          <li>
            notre intérêt légitime pour améliorer nos services et
            assurer la sécurité du site ;
          </li>
          <li>
            nos obligations légales, notamment comptables et
            fiscales.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "destinataires",
    title: "6. Destinataires des données",
    content: (
      <>
        <p>
          Vos données peuvent être transmises uniquement aux
          prestataires nécessaires au fonctionnement du service,
          notamment :
        </p>

        <ul>
          <li>Stripe (paiement sécurisé) ;</li>
          <li>transporteurs pour la livraison ;</li>
          <li>Vercel (hébergement de l’application) ;</li>
          <li>
            Google Analytics (mesure d’audience, selon votre
            consentement) ;
          </li>
          <li>OVHcloud (gestion du nom de domaine).</li>
        </ul>

        <p>
          Ces prestataires traitent les données uniquement dans le
          cadre des services qu’ils fournissent.
        </p>
      </>
    ),
  },
  {
    id: "duree-conservation",
    title: "7. Durée de conservation",
    content: (
      <>
        <p>
          Les données sont conservées uniquement pendant la durée
          nécessaire aux finalités prévues et dans le respect de la
          réglementation.
        </p>

        <p>À titre indicatif :</p>

        <ul>
          <li>
            données de compte client : pendant la durée de vie du
            compte ;
          </li>
          <li>
            commandes : conformément aux obligations comptables et
            fiscales ;
          </li>
          <li>
            données de prospection : jusqu’au retrait du consentement
            ou selon les délais légaux applicables.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "securite",
    title: "8. Sécurité",
    content: (
      <>
        <p>
          Vanille’Or met en œuvre des mesures techniques et
          organisationnelles destinées à protéger vos données contre
          :
        </p>

        <ul>
          <li>la perte ;</li>
          <li>l’altération ;</li>
          <li>l’accès non autorisé ;</li>
          <li>la divulgation.</li>
        </ul>

        <p>
          Toutes les communications avec notre site sont sécurisées
          par le protocole HTTPS.
        </p>
      </>
    ),
  },
  {
    id: "vos-droits",
    title: "9. Vos droits",
    content: (
      <>
        <p>
          Conformément au RGPD, vous disposez notamment des droits
          suivants :
        </p>

        <ul>
          <li>droit d’accès ;</li>
          <li>droit de rectification ;</li>
          <li>droit d’effacement ;</li>
          <li>droit à la limitation du traitement ;</li>
          <li>droit d’opposition ;</li>
          <li>droit à la portabilité des données ;</li>
          <li>
            droit de retirer votre consentement lorsque le traitement
            est fondé sur celui-ci.
          </li>
        </ul>

        <p>
          Pour exercer vos droits, vous pouvez nous contacter à :{" "}
          <a href="mailto:contact@vanilleor.fr">
            contact@vanilleor.fr
          </a>
        </p>

        <p>
          Une réponse vous sera apportée dans les meilleurs délais et
          au plus tard dans le délai prévu par la réglementation.
        </p>
      </>
    ),
  },
  {
    id: "newsletter",
    title: "10. Newsletter",
    content: (
      <>
        <p>
          Si vous choisissez de vous inscrire à notre newsletter,
          votre adresse e-mail sera utilisée uniquement pour vous
          envoyer des informations relatives à Vanille’Or
          (nouveautés, conseils, offres, actualités).
        </p>

        <p>
          Vous pouvez vous désinscrire à tout moment grâce au lien
          présent dans chaque e-mail.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "11. Cookies",
    content: (
      <>
        <p>Le site utilise :</p>

        <ul>
          <li>
            des cookies strictement nécessaires au fonctionnement du
            site ;
          </li>
          <li>
            des cookies de mesure d’audience (avec votre
            consentement) ;
          </li>
          <li>
            des cookies liés au paiement sécurisé et à certaines
            fonctionnalités.
          </li>
        </ul>

        <p>
          Le détail est disponible dans notre{" "}
          <a href="/legal/cookies">Politique de cookies</a>.
        </p>
      </>
    ),
  },
  {
    id: "transfert-donnees",
    title: "12. Transfert des données",
    content: (
      <p>
        Certains de nos prestataires peuvent être situés en dehors de
        l’Union européenne. Dans ce cas, les transferts sont
        encadrés conformément à la réglementation applicable afin
        d’assurer un niveau de protection adéquat.
      </p>
    ),
  },
  {
    id: "reclamation",
    title: "13. Réclamation",
    content: (
      <p>
        Si vous estimez que vos droits ne sont pas respectés, vous
        pouvez introduire une réclamation auprès de l’autorité de
        contrôle compétente. En France, il s’agit de la Commission
        Nationale de l’Informatique et des Libertés (CNIL).
      </p>
    ),
  },
  {
    id: "mise-a-jour",
    title: "14. Mise à jour",
    content: (
      <p>
        La présente politique peut être modifiée afin de tenir
        compte des évolutions légales, réglementaires ou techniques.
        La date de dernière mise à jour figure en bas de cette page.
      </p>
    ),
  },
];

export default function ConfidentialitePage() {
  return (
    <LegalPageLayout
      title="Politique de confidentialité"
      intro="Votre confiance est au cœur de notre démarche. Chez Vanille’Or, nous accordons une importance particulière à la protection de vos données personnelles. Cette politique vous explique de manière claire quelles informations nous collectons, pourquoi nous les utilisons et quels sont vos droits."
      lastUpdated="2 juillet 2026"
      sections={sections}
      breadcrumbCurrent="Politique de confidentialité"
      slug="/legal/confidentialite"
      metaDescription="Découvrez comment Vanille'Or collecte, utilise et protège vos données personnelles conformément au Règlement Général sur la Protection des Données (RGPD)."
      relatedLinks={[
        { label: "Politique de cookies", href: "/legal/cookies" },
        { label: "CGV", href: "/cgv" },
        { label: "CGU", href: "/legal/cgu" },
        {
          label: "Mentions légales",
          href: "/legal/mentions-legales",
        },
      ]}
      closing={{
        title: "Votre confiance est précieuse",
        paragraphs: [
          "Chez Vanille’Or, protéger vos données personnelles est une responsabilité que nous prenons au sérieux. Nous nous engageons à traiter vos informations avec transparence, confidentialité et dans le respect de la réglementation en vigueur, afin que votre expérience d’achat soit aussi sereine que la qualité des produits que nous sélectionnons.",
        ],
      }}
    />
  );
}
