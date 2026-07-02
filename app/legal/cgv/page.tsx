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

// TODO: Supprimer l'ancienne page /cgv et créer une redirection 301
// vers /legal/cgv lorsque l'ensemble du Centre de Confiance sera
// finalisé.

const PARTIE_1 = "Partie I — Présentation";
const PARTIE_2 = "Partie II — Les produits";
const PARTIE_3 = "Partie III — Paiement et exécution de la commande";
const PARTIE_4 = "Partie IV — Après la livraison";
const PARTIE_5 = "Partie V — Cadre juridique";
const PARTIE_6 = "Partie VI — Dispositions finales";

function VersionHistoryTable() {
  // Ajouter une ligne ici à chaque nouvelle version publiée des CGV.
  const rows = [
    {
      version: "v1.0",
      date: "02 juillet 2026",
      author: "Vanille’Or",
      change: "Création initiale des Conditions Générales de Vente.",
    },
  ];

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "12px",
        fontSize: "14px",
      }}
    >
      <thead>
        <tr>
          {["Version", "Date", "Auteur", "Évolution"].map((h) => (
            <th
              key={h}
              scope="col"
              style={{
                textAlign: "left",
                padding: "10px 12px",
                background: "#f8f5ef",
                borderBottom: "2px solid #e7dfd3",
                fontWeight: 800,
                color: "#111",
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((r) => (
          <tr key={r.version}>
            <td
              style={{
                padding: "10px 12px",
                borderBottom: "1px solid #eee",
                fontWeight: 700,
                color: "#a16207",
              }}
            >
              {r.version}
            </td>
            <td
              style={{
                padding: "10px 12px",
                borderBottom: "1px solid #eee",
                color: "#444",
              }}
            >
              {r.date}
            </td>
            <td
              style={{
                padding: "10px 12px",
                borderBottom: "1px solid #eee",
                color: "#444",
              }}
            >
              {r.author}
            </td>
            <td
              style={{
                padding: "10px 12px",
                borderBottom: "1px solid #eee",
                color: "#444",
              }}
            >
              {r.change}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MediatorPlaceholder() {
  return (
    <div
      style={{
        marginTop: "20px",
        background: "#fff3e0",
        border: "2px solid #f59e0b",
        borderRadius: "14px",
        padding: "20px 22px",
      }}
    >
      <p
        style={{
          margin: "0 0 12px",
          fontWeight: 800,
          fontSize: "13px",
          color: "#b45309",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <span aria-hidden="true">⚠️</span>
        À compléter avant mise en production
      </p>

      <div
        style={{
          display: "grid",
          gap: "6px",
          fontSize: "14px",
          color: "#78350f",
        }}
      >
        <p style={{ margin: 0 }}>
          <strong>Nom du médiateur :</strong> —
        </p>
        <p style={{ margin: 0 }}>
          <strong>Adresse :</strong> —
        </p>
        <p style={{ margin: 0 }}>
          <strong>Site internet :</strong> —
        </p>
        <p style={{ margin: 0 }}>
          <strong>Coordonnées :</strong> —
        </p>
        <p style={{ margin: 0 }}>
          <strong>Numéro de référencement :</strong> —
        </p>
      </div>
    </div>
  );
}

function InfoBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        marginTop: "20px",
        background: "#fff7ed",
        border: "1px solid #f0dfc0",
        borderRadius: "14px",
        padding: "18px 20px",
      }}
    >
      <p
        style={{
          margin: "0 0 6px",
          fontWeight: 800,
          fontSize: "13px",
          color: "#8b5e14",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {title}
      </p>

      <p
        style={{
          margin: 0,
          fontSize: "14px",
          color: "#5a4c39",
          lineHeight: 1.7,
        }}
      >
        {children}
      </p>
    </div>
  );
}

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
  {
    id: "caracteristiques-produits",
    title: "Article 6 — Caractéristiques des produits",
    group: PARTIE_2,
    content: (
      <>
        <p>
          Vanille’Or sélectionne avec soin des produits naturels
          provenant principalement de producteurs partenaires à
          Madagascar.
        </p>

        <p>
          Chaque fiche produit présente les caractéristiques
          essentielles permettant au client d’effectuer son choix en
          toute connaissance de cause.
        </p>

        <p>
          Les descriptions, conseils d’utilisation, dimensions,
          poids ou conditionnements sont fournis avec le plus grand
          soin.
        </p>

        <p>
          Les produits commercialisés étant d’origine naturelle, de
          légères variations peuvent exister sans constituer un
          défaut de conformité.
        </p>

        <p>Ces variations peuvent notamment concerner :</p>

        <ul>
          <li>la longueur des gousses ;</li>
          <li>leur diamètre ;</li>
          <li>leur couleur ;</li>
          <li>leur souplesse ;</li>
          <li>leur teneur en humidité ;</li>
          <li>leur poids ;</li>
          <li>
            l’apparition naturelle de cristaux de vanilline sur
            certaines gousses.
          </li>
        </ul>

        <p>
          Ces caractéristiques témoignent du caractère authentique
          du produit et ne constituent pas un défaut.
        </p>

        <InfoBox title="Produits naturels">
          Les produits Vanille’Or sont issus de matières premières
          naturelles. Chaque récolte est unique et peut présenter des
          caractéristiques propres sans altérer les qualités
          gustatives, aromatiques ou la qualité du produit.
        </InfoBox>
      </>
    ),
  },
  {
    id: "disponibilite",
    title: "Article 7 — Disponibilité",
    group: PARTIE_2,
    content: (
      <>
        <p>
          Les produits sont proposés dans la limite des stocks
          disponibles.
        </p>

        <p>
          Malgré une mise à jour régulière du catalogue, une
          indisponibilité exceptionnelle peut survenir.
        </p>

        <p>
          En cas d’indisponibilité après validation de la commande,
          Vanille’Or informera le client dans les meilleurs délais.
        </p>

        <p>Le client pourra alors :</p>

        <ul>
          <li>accepter un nouveau délai ;</li>
          <li>
            choisir un produit équivalent lorsque cela est possible ;
          </li>
          <li>
            demander le remboursement des sommes versées pour le
            produit indisponible.
          </li>
        </ul>

        <p>
          Aucun frais supplémentaire ne sera appliqué dans ce cas.
        </p>
      </>
    ),
  },
  {
    id: "photographies",
    title: "Article 8 — Photographies et représentation",
    group: PARTIE_2,
    content: (
      <>
        <p>
          Les photographies présentées sur le site ont pour objectif
          d’illustrer les produits proposés à la vente.
        </p>

        <p>
          En raison du caractère artisanal et naturel des produits
          commercialisés, les visuels ne peuvent garantir une
          reproduction parfaitement identique du produit livré.
        </p>

        <p>
          Les différences éventuelles de couleur, de texture, de
          taille ou d’aspect liées à la nature même du produit ne
          peuvent engager la responsabilité de Vanille’Or.
        </p>

        <p>
          Les photographies ne présentent aucun caractère
          contractuel.
        </p>
      </>
    ),
  },
  {
    id: "prix",
    title: "Article 9 — Prix",
    group: PARTIE_2,
    content: (
      <>
        <p>
          Les prix affichés sur le site sont exprimés en euros (€).
        </p>

        <p>
          Ils sont affichés toutes taxes comprises (TTC) lorsque la
          réglementation applicable le prévoit.
        </p>

        <p>
          Les frais de livraison sont indiqués séparément avant la
          validation définitive de la commande.
        </p>

        <p>
          Vanille’Or se réserve le droit de modifier ses prix à tout
          moment.
        </p>

        <p>
          Toutefois, les produits sont facturés sur la base du tarif
          en vigueur au moment de la validation de la commande.
        </p>

        <p>
          Les offres promotionnelles, codes promotionnels ou remises
          ponctuelles ne sont valables que pendant leur période de
          validité et dans les conditions indiquées lors de leur
          diffusion.
        </p>

        <p>
          Sauf mention contraire, les offres promotionnelles ne sont
          pas cumulables.
        </p>
      </>
    ),
  },
  {
    id: "commande",
    title: "Article 10 — Commande",
    group: PARTIE_2,
    content: (
      <>
        <p>
          Toute commande est réalisée via le site officiel
          Vanille’Or.
        </p>

        <p>Le processus comprend notamment les étapes suivantes :</p>

        <ul>
          <li>sélection des produits ;</li>
          <li>ajout au panier ;</li>
          <li>identification ou création d’un compte si nécessaire ;</li>
          <li>choix du mode de livraison ;</li>
          <li>sélection du moyen de paiement ;</li>
          <li>vérification du récapitulatif de commande ;</li>
          <li>validation définitive de la commande.</li>
        </ul>

        <p>
          La commande n’est considérée comme définitivement acceptée
          qu’après :
        </p>

        <ul>
          <li>validation du paiement ;</li>
          <li>émission de la confirmation de commande.</li>
        </ul>

        <p>
          Vanille’Or se réserve le droit de refuser ou d’annuler une
          commande en cas notamment :
        </p>

        <ul>
          <li>d’informations manifestement erronées ;</li>
          <li>de suspicion de fraude ;</li>
          <li>de non-respect des présentes CGV ;</li>
          <li>d’incident de paiement antérieur.</li>
        </ul>
      </>
    ),
  },
  {
    id: "paiement",
    title: "Article 11 — Paiement",
    group: PARTIE_3,
    content: (
      <>
        <p>
          Les commandes sont payables au comptant lors de leur
          validation.
        </p>

        <p>
          Vanille’Or propose plusieurs moyens de paiement sécurisés
          selon les options disponibles sur le site, notamment :
        </p>

        <ul>
          <li>Carte bancaire (Visa, Mastercard)</li>
          <li>Apple Pay</li>
          <li>Google Pay</li>
          <li>PayPal</li>
          <li>Virement bancaire lorsque cette option est proposée</li>
        </ul>

        <p>
          Les paiements sont sécurisés par notre partenaire Stripe ou
          tout autre prestataire de paiement indiqué lors de la
          commande.
        </p>

        <p>
          Vanille’Or n’a jamais accès aux données bancaires complètes
          du client et ne les conserve pas.
        </p>

        <p>
          En cas de refus d’autorisation par l’établissement bancaire
          ou le prestataire de paiement, la commande sera
          automatiquement annulée.
        </p>
      </>
    ),
  },
  {
    id: "preparation-livraison",
    title: "Article 12 — Préparation et livraison",
    group: PARTIE_3,
    content: (
      <>
        <p>
          Chaque commande fait l’objet d’une préparation attentive
          afin de préserver la qualité des produits.
        </p>

        <p>
          Les commandes sont généralement expédiées dans un délai
          compris entre 48 heures et 5 jours ouvrés, sauf indication
          différente affichée lors de la commande.
        </p>

        <p>
          Les livraisons peuvent être assurées notamment par :
        </p>

        <ul>
          <li>Colissimo</li>
          <li>Chronopost</li>
          <li>Mondial Relay</li>
        </ul>

        <p>
          Selon la destination ou les options proposées, d’autres
          transporteurs peuvent être utilisés.
        </p>

        <p>
          Les délais communiqués sont donnés à titre indicatif. Un
          retard raisonnable imputable au transporteur ne saurait
          justifier l’annulation automatique de la commande ni donner
          lieu à une indemnisation.
        </p>

        <p>
          La livraison est offerte à partir du montant indiqué sur le
          site au moment de la commande.
        </p>

        <InfoBox title="Une expédition préparée avec soin">
          Chaque commande est préparée avec une attention
          particulière afin de préserver les qualités aromatiques de
          nos produits. Les emballages sont sélectionnés pour limiter
          les variations liées au transport et garantir une réception
          dans les meilleures conditions possibles.
        </InfoBox>
      </>
    ),
  },
  {
    id: "transfert-risques",
    title: "Article 13 — Transfert des risques",
    group: PARTIE_3,
    content: (
      <>
        <p>
          Les risques liés au transport sont transférés au client au
          moment où celui-ci, ou un tiers désigné par lui, prend
          physiquement possession des produits.
        </p>

        <p>
          En cas de colis endommagé ou manifestement détérioré à la
          livraison, le client est invité à :
        </p>

        <ul>
          <li>vérifier immédiatement l’état du colis ;</li>
          <li>émettre toute réserve utile auprès du transporteur ;</li>
          <li>
            contacter le service client de Vanille’Or dans les
            meilleurs délais en joignant, si possible, des
            photographies.
          </li>
        </ul>

        <p>
          Cette démarche facilitera le traitement rapide de la
          réclamation.
        </p>
      </>
    ),
  },
  {
    id: "responsabilite",
    title: "Article 14 — Responsabilité",
    group: PARTIE_3,
    content: (
      <>
        <p>
          Vanille’Or s’engage à apporter le plus grand soin à la
          sélection, au conditionnement et à l’expédition de ses
          produits.
        </p>

        <p>
          Sa responsabilité ne pourra toutefois être engagée en cas
          notamment :
        </p>

        <ul>
          <li>
            d’une mauvaise conservation des produits après leur
            livraison ;
          </li>
          <li>
            d’une utilisation non conforme aux conseils fournis ;
          </li>
          <li>
            d’informations erronées communiquées par le client ;
          </li>
          <li>d’un retard imputable au transporteur ;</li>
          <li>d’un événement de force majeure.</li>
        </ul>

        <p>
          Les limitations ci-dessus ne s’appliquent pas lorsqu’elles
          sont contraires aux dispositions impératives du droit de la
          consommation.
        </p>
      </>
    ),
  },
  {
    id: "force-majeure",
    title: "Article 15 — Force majeure",
    group: PARTIE_3,
    content: (
      <>
        <p>
          Vanille’Or ne pourra être tenu responsable de l’inexécution
          ou du retard dans l’exécution de ses obligations lorsqu’ils
          résultent d’un événement imprévisible, irrésistible et
          extérieur au sens du droit français.
        </p>

        <p>Peuvent notamment être concernés :</p>

        <ul>
          <li>catastrophes naturelles ;</li>
          <li>incendies ;</li>
          <li>grèves généralisées ;</li>
          <li>conflits armés ;</li>
          <li>pandémies ;</li>
          <li>interruption durable des transports ;</li>
          <li>
            décisions administratives empêchant temporairement
            l’exécution des commandes.
          </li>
        </ul>

        <p>
          Dans une telle situation, Vanille’Or informera les clients
          concernés dans les meilleurs délais et recherchera une
          solution adaptée.
        </p>
      </>
    ),
  },
  {
    id: "reception-produits",
    title: "Article 16 — Réception des produits",
    group: PARTIE_4,
    content: (
      <>
        <p>
          À la réception de sa commande, le client est invité à
          vérifier l’état du colis ainsi que la conformité des
          produits livrés.
        </p>

        <p>
          Toute anomalie apparente (colis endommagé, produit
          manquant ou erreur de préparation) doit être signalée au
          service client dans les meilleurs délais afin de faciliter
          son traitement.
        </p>

        <p>
          Cette vérification rapide permet à Vanille’Or de proposer
          une solution adaptée dans les meilleurs délais.
        </p>
      </>
    ),
  },
  {
    id: "droit-retractation",
    title: "Article 17 — Droit de rétractation",
    group: PARTIE_4,
    content: (
      <>
        <p>
          Conformément aux dispositions du Code de la consommation,
          le client consommateur bénéficie d’un délai de quatorze
          (14) jours à compter de la réception de sa commande pour
          exercer son droit de rétractation lorsque celui-ci est
          applicable.
        </p>

        <p>
          Le client peut notifier sa décision par tout moyen
          permettant d’exprimer clairement sa volonté.
        </p>

        <p>
          Les modalités pratiques de retour sont précisées dans la
          Politique de retour et remboursement disponible sur le
          site.
        </p>
      </>
    ),
  },
  {
    id: "exceptions-retractation",
    title: "Article 18 — Exceptions au droit de rétractation",
    group: PARTIE_4,
    content: (
      <>
        <p>
          Conformément aux dispositions légales applicables,
          certains produits ne peuvent faire l’objet d’un droit de
          rétractation.
        </p>

        <p>
          S’agissant de produits alimentaires, aucun retour ne
          pourra être accepté lorsque :
        </p>

        <ul>
          <li>l’emballage a été ouvert ;</li>
          <li>le produit a été descellé ;</li>
          <li>
            les conditions de conservation ne peuvent plus être
            garanties.
          </li>
        </ul>

        <p>
          Cette limitation vise à préserver la qualité sanitaire des
          produits proposés.
        </p>
      </>
    ),
  },
  {
    id: "retours",
    title: "Article 19 — Retours",
    group: PARTIE_4,
    content: (
      <>
        <p>
          Sous réserve des dispositions légales applicables, les
          demandes de retour doivent être effectuées dans un délai de
          sept (7) jours suivant la réception de la commande.
        </p>

        <p>Les produits retournés doivent être :</p>

        <ul>
          <li>non ouverts ;</li>
          <li>non utilisés ;</li>
          <li>conservés dans leur emballage d’origine ;</li>
          <li>
            accompagnés des éléments permettant d’identifier la
            commande.
          </li>
        </ul>

        <p>
          Sauf erreur imputable à Vanille’Or ou disposition légale
          contraire, les frais de retour demeurent à la charge du
          client.
        </p>
      </>
    ),
  },
  {
    id: "remboursements",
    title: "Article 20 — Remboursements",
    group: PARTIE_4,
    content: (
      <>
        <p>
          Lorsque le remboursement est accepté, celui-ci est
          effectué par le même moyen de paiement que celui utilisé
          lors de la commande, sauf accord différent entre les
          parties.
        </p>

        <p>
          Le remboursement intervient dans les meilleurs délais et
          conformément aux dispositions légales applicables, après
          réception et vérification des produits retournés lorsque
          cette vérification est nécessaire.
        </p>
      </>
    ),
  },
  {
    id: "garanties-legales",
    title: "Article 21 — Garanties légales",
    group: PARTIE_4,
    content: (
      <>
        <p>
          Les produits vendus par Vanille’Or bénéficient des
          garanties légales prévues par le droit français, notamment
          :
        </p>

        <ul>
          <li>la garantie légale de conformité ;</li>
          <li>la garantie contre les vices cachés.</li>
        </ul>

        <p>
          Ces garanties s’appliquent conformément aux dispositions du
          Code de la consommation et du Code civil.
        </p>

        <p>Elles ne privent pas le consommateur de ses droits légaux.</p>
      </>
    ),
  },
  {
    id: "service-client",
    title: "Article 22 — Service client",
    group: PARTIE_4,
    content: (
      <>
        <p>
          Le service client Vanille’Or accompagne les clients avant,
          pendant et après leur commande.
        </p>

        <p>
          Pour toute question, demande d’information ou réclamation,
          le client peut contacter :
        </p>

        <p>
          E-mail :{" "}
          <a href="mailto:contact@vanilleor.fr">
            contact@vanilleor.fr
          </a>
          <br />
          Téléphone : <a href="tel:0646920348">06 46 92 03 48</a>
        </p>

        <p>
          Horaires :
          <br />
          Du lundi au vendredi
          <br />
          10h00 à 18h00
        </p>

        <p>
          Vanille’Or s’efforce d’apporter une réponse dans les
          meilleurs délais.
        </p>

        <InfoBox title="Votre satisfaction est notre priorité">
          En cas de difficulté concernant votre commande, nous vous
          invitons à contacter notre service client avant toute
          démarche. Une solution amiable permet dans la majorité des
          cas de résoudre rapidement la situation.
        </InfoBox>
      </>
    ),
  },
  {
    id: "protection-donnees",
    title: "Article 23 — Protection des données personnelles",
    group: PARTIE_5,
    content: (
      <>
        <p>
          Les données personnelles collectées lors des commandes sont
          traitées conformément à la{" "}
          <a href="/legal/confidentialite">
            Politique de confidentialité
          </a>{" "}
          disponible sur le site.
        </p>

        <p>Ces traitements permettent notamment :</p>

        <ul>
          <li>la gestion des commandes ;</li>
          <li>la livraison ;</li>
          <li>la relation client ;</li>
          <li>le service après-vente ;</li>
          <li>le respect des obligations légales.</li>
        </ul>

        <p>
          Les droits des utilisateurs sont détaillés dans la
          Politique de confidentialité.
        </p>
      </>
    ),
  },
  {
    id: "propriete-intellectuelle-cgv",
    title: "Article 24 — Propriété intellectuelle",
    group: PARTIE_5,
    content: (
      <>
        <p>
          Tous les contenus présents sur le site Vanille’Or demeurent
          la propriété exclusive de KANAYA.
        </p>

        <p>Cela comprend notamment :</p>

        <ul>
          <li>le logo ;</li>
          <li>les photographies ;</li>
          <li>les fiches produits ;</li>
          <li>les textes ;</li>
          <li>les illustrations ;</li>
          <li>les éléments graphiques ;</li>
          <li>l’identité visuelle.</li>
        </ul>

        <p>
          Toute reproduction, représentation ou exploitation sans
          autorisation préalable est interdite.
        </p>
      </>
    ),
  },
  {
    id: "archivage-contrats",
    title: "Article 25 — Archivage des contrats",
    group: PARTIE_5,
    content: (
      <>
        <p>
          Les commandes font l’objet d’un enregistrement informatique
          permettant d’assurer leur suivi.
        </p>

        <p>
          Les documents contractuels et les factures sont conservés
          conformément aux obligations légales applicables.
        </p>

        <p>
          Le client peut retrouver l’historique de ses commandes
          depuis son espace client lorsqu’il dispose d’un compte.
        </p>
      </>
    ),
  },
  {
    id: "preuve",
    title: "Article 26 — Preuve",
    group: PARTIE_5,
    content: (
      <p>
        Les registres informatiques de Vanille’Or, ainsi que ceux de
        ses prestataires techniques et de paiement, constituent des
        éléments de preuve recevables concernant les commandes,
        paiements et échanges intervenus avec le client, dans les
        conditions prévues par la réglementation applicable.
      </p>
    ),
  },
  {
    id: "mediation-consommation",
    title: "Article 27 — Médiation de la consommation",
    group: PARTIE_5,
    content: (
      <>
        <p>
          Conformément aux dispositions du Code de la consommation,
          tout consommateur a le droit de recourir gratuitement à un
          médiateur de la consommation en vue de la résolution
          amiable d’un litige.
        </p>

        <MediatorPlaceholder />
      </>
    ),
  },
  {
    id: "reglement-litiges",
    title: "Article 28 — Règlement des litiges",
    group: PARTIE_5,
    content: (
      <>
        <p>
          Vanille’Or privilégie toujours une résolution amiable des
          différends.
        </p>

        <p>
          En cas de désaccord persistant, le client est invité à
          contacter en priorité le service client afin de rechercher
          une solution satisfaisante.
        </p>

        <p>
          À défaut d’accord amiable, le litige pourra être porté
          devant les juridictions compétentes conformément au droit
          applicable.
        </p>

        <InfoBox title="Une résolution amiable avant tout">
          Notre priorité est de trouver une solution rapide et
          équitable avec chacun de nos clients. Avant toute
          procédure, notre équipe reste disponible afin d’étudier
          chaque situation avec attention.
        </InfoBox>
      </>
    ),
  },
  {
    id: "droit-applicable-cgv",
    title: "Article 29 — Droit applicable",
    group: PARTIE_5,
    content: (
      <>
        <p>
          Les présentes Conditions Générales de Vente sont régies par
          le droit français.
        </p>

        <p>
          Sous réserve des dispositions impératives protégeant les
          consommateurs, tout litige relatif à leur interprétation ou
          à leur exécution relève des juridictions françaises
          compétentes.
        </p>
      </>
    ),
  },
  {
    id: "modification-cgv",
    title: "Article 30 — Modification des CGV",
    group: PARTIE_6,
    content: (
      <>
        <p>
          Vanille’Or se réserve la possibilité de modifier les
          présentes Conditions Générales de Vente afin de tenir
          compte des évolutions légales, réglementaires, techniques
          ou commerciales.
        </p>

        <p>
          Les nouvelles Conditions Générales de Vente entreront en
          vigueur dès leur publication sur le site.
        </p>

        <p>
          Toute commande reste soumise à la version des CGV en
          vigueur au moment de sa validation.
        </p>
      </>
    ),
  },
  {
    id: "nullite-partielle",
    title: "Article 31 — Nullité partielle",
    group: PARTIE_6,
    content: (
      <>
        <p>
          Si une disposition des présentes Conditions Générales de
          Vente devait être déclarée nulle, invalide ou inapplicable
          par une juridiction compétente, les autres dispositions
          conserveraient leur plein effet.
        </p>

        <p>
          Les parties conviennent de remplacer, dans la mesure du
          possible, la disposition concernée par une disposition
          poursuivant un objectif équivalent et conforme au droit
          applicable.
        </p>
      </>
    ),
  },
  {
    id: "renonciation",
    title: "Article 32 — Renonciation",
    group: PARTIE_6,
    content: (
      <p>
        Le fait pour Vanille’Or de ne pas se prévaloir, à un moment
        donné, d’une disposition des présentes Conditions Générales
        de Vente ne saurait être interprété comme une renonciation à
        s’en prévaloir ultérieurement.
      </p>
    ),
  },
  {
    id: "langue-contrat",
    title: "Article 33 — Langue du contrat",
    group: PARTIE_6,
    content: (
      <>
        <p>
          Les présentes Conditions Générales de Vente sont rédigées
          en langue française.
        </p>

        <p>
          En cas de traduction dans une autre langue, seule la
          version française fera foi en cas de divergence
          d’interprétation, sauf disposition légale impérative
          contraire.
        </p>
      </>
    ),
  },
  {
    id: "entree-vigueur",
    title: "Article 34 — Entrée en vigueur",
    group: PARTIE_6,
    content: (
      <>
        <p>
          Les présentes Conditions Générales de Vente sont
          applicables à compter de leur date de publication sur le
          site Vanille’Or.
        </p>

        <p>
          Elles demeurent applicables jusqu’à leur remplacement par
          une version ultérieure.
        </p>
      </>
    ),
  },
  {
    id: "version-applicable",
    title: "Article 35 — Version applicable",
    group: PARTIE_6,
    content: (
      <>
        <p>
          Le client reconnaît que la version applicable des
          Conditions Générales de Vente est celle disponible sur le
          site au jour de la validation de sa commande.
        </p>

        <p>
          La date de dernière mise à jour ainsi que le numéro de
          version figurent en en-tête du document afin de garantir
          une parfaite transparence.
        </p>
      </>
    ),
  },
  {
    id: "historique-versions",
    title: "Historique des versions",
    content: (
      <>
        <p>
          Ce tableau recense les évolutions successives des
          présentes Conditions Générales de Vente.
        </p>

        <VersionHistoryTable />
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
      officialBadge
      officialNote="Ce document constitue la version officielle des Conditions Générales de Vente de Vanille’Or."
      relatedLinks={[
        {
          label: "Conditions Générales d’Utilisation",
          href: "/legal/cgu",
        },
        {
          label: "Politique de confidentialité",
          href: "/legal/confidentialite",
        },
        { label: "Politique de cookies", href: "/legal/cookies" },
        {
          label: "Mentions légales",
          href: "/legal/mentions-legales",
        },
        {
          label: "Politique de livraison (à venir)",
          href: "/legal/livraison",
        },
        {
          label: "Politique de retour et remboursement (à venir)",
          href: "/legal/retours",
        },
        { label: "FAQ (à venir)", href: "/support/faq" },
        {
          label: "Service après-vente (à venir)",
          href: "/support/sav",
        },
      ]}
      closing={{
        title: "Notre engagement",
        paragraphs: [
          "Chez Vanille’Or, nous considérons que la confiance ne se limite pas à la qualité de nos produits.",
          "Elle repose également sur une information claire, transparente et accessible.",
          "Ces Conditions Générales de Vente traduisent notre volonté d’établir une relation durable avec chacun de nos clients, fondée sur le respect, la qualité de service et la transparence.",
        ],
      }}
    />
  );
}
