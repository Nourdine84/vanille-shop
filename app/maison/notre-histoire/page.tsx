import type { Metadata } from "next";
import CinematicHero from "@/components/maison/CinematicHero";
import NarrativeSection from "@/components/maison/NarrativeSection";
import Timeline from "@/components/maison/Timeline";
import QuoteBlock from "@/components/maison/QuoteBlock";
import MaisonCTA from "@/components/maison/MaisonCTA";

const description =
  "Découvrez l'histoire de Vanille'Or, de la récolte à Madagascar jusqu'à votre table, et l'exigence qui anime notre sélection.";

export const metadata: Metadata = {
  title: "Notre histoire | Vanille'Or",
  description,
  alternates: {
    canonical: "/maison/notre-histoire",
  },
  openGraph: {
    title: "Notre histoire | Vanille'Or",
    description,
    type: "website",
  },
};

export default function NotreHistoirePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Notre histoire",
    description,
    url: "https://vanille-or.com/maison/notre-histoire",
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <CinematicHero
        badge="La Maison Vanille’Or"
        tag="NOTRE HISTOIRE"
        title="Un lien avec Madagascar"
        subtitle="Vanille’Or est née d’une conviction simple : les saveurs de Madagascar méritent une Maison capable de les présenter avec exigence, respect et transparence."
        image="/images/hero-vanille.jpg"
      />

      <NarrativeSection
        eyebrow="L’héritage"
        title="Un héritage rare et précieux"
        image="/images/vanille.jpg"
        imageAlt="Gousses de vanille de Madagascar liées ensemble"
      >
        <p>
          La vanille n’est pas un produit ordinaire. Avant d’arriver
          dans une cuisine, elle traverse un long cycle de patience, de
          gestes précis et de savoir-faire.
        </p>
        <p style={{ marginTop: "16px" }}>
          À Madagascar, chaque gousse raconte une origine, une récolte,
          une préparation et une sélection. Notre rôle est de préserver
          cette histoire jusqu’au client final.
        </p>
      </NarrativeSection>

      <Timeline
        eyebrow="De la récolte à votre table"
        title="Le parcours de la vanille"
        steps={[
          {
            title: "Récolte",
            description:
              "Chaque gousse est cueillie à la main au moment précis de sa maturité.",
          },
          {
            title: "Affinage",
            description:
              "Un processus lent et minutieux révèle l’intensité aromatique de la vanille.",
          },
          {
            title: "Sélection",
            description:
              "Seules les gousses répondant à nos critères d’exigence sont retenues.",
          },
          {
            title: "Conditionnement",
            description:
              "Chaque produit est préparé avec soin pour préserver ses qualités.",
          },
          {
            title: "Expédition",
            description:
              "Vos produits sont acheminés jusqu’à vous dans les meilleures conditions.",
          },
        ]}
      />

      <NarrativeSection
        eyebrow="Notre exigence"
        title="Une sélection sans compromis"
        image="/images/epices.jpg"
        imageAlt="Épices et vanille premium sélectionnées par Vanille’Or"
        reverse
      >
        <p>
          Nous ne cherchons pas à proposer le catalogue le plus large.
          Nous préférons sélectionner moins, mais mieux.
        </p>
        <p style={{ marginTop: "16px" }}>
          Chaque produit Vanille’Or doit répondre à trois exigences :
          une origine claire, une qualité visible et une utilité réelle
          pour ceux qui l’utilisent.
        </p>
      </NarrativeSection>

      <QuoteBlock
        quote="La confiance ne se promet pas. Elle se construit dans chaque détail."
        signature="La Maison Vanille’Or"
      />

      <MaisonCTA
        title="Vivez l’expérience Vanille’Or"
        text="Découvrez une sélection premium conçue pour révéler toute la richesse aromatique de Madagascar."
        primary={{ label: "Voir le catalogue", href: "/products" }}
        secondary={{
          label: "Nos engagements",
          href: "/confiance",
        }}
      />

      {/* ChapterNav retiré temporairement : /maison/nos-engagements n'existe pas
          encore. À réintroduire (avec next → nos-engagements) une fois cette page
          créée, pour éviter tout lien 404. */}
    </div>
  );
}
