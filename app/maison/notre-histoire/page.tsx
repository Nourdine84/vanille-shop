import type { Metadata } from "next";
import CinematicHero from "@/components/maison/CinematicHero";
import NarrativeSection from "@/components/maison/NarrativeSection";
import Timeline from "@/components/maison/Timeline";
import StatBand from "@/components/maison/StatBand";
import QuoteBlock from "@/components/maison/QuoteBlock";
import ChapterNav from "@/components/maison/ChapterNav";
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

const PLACEHOLDER = "[À RÉDIGER — contenu à compléter ensemble]";

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
        subtitle="Née d’un attachement profond à la terre malgache, Vanille’Or est avant tout une histoire d’exigence et d’authenticité."
        image="/images/hero-vanille.jpg"
      />

      <NarrativeSection
        eyebrow="L’héritage"
        title="Un héritage rare et précieux"
        image="/images/vanille.jpg"
        imageAlt="Gousses de vanille de Madagascar liées ensemble"
      >
        <p>
          Vanille’Or est née d’un lien familial fort avec Madagascar et
          d’une volonté simple : proposer des produits premium
          accessibles, sélectionnés directement auprès de producteurs
          locaux.
        </p>
        <p style={{ marginTop: "16px" }}>{PLACEHOLDER}</p>
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

      <StatBand
        stats={[
          { value: "[X]", label: "ans d’exigence" },
          { value: "[X]", label: "producteurs partenaires" },
          { value: "[X]", label: "pays livrés" },
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
          Notre vanille est issue d’un savoir-faire artisanal unique
          transmis depuis des générations. Chaque gousse est récoltée,
          affinée et préparée avec précision afin d’obtenir une
          intensité aromatique exceptionnelle.
        </p>
        <p style={{ marginTop: "16px" }}>{PLACEHOLDER}</p>
      </NarrativeSection>

      <QuoteBlock
        quote={PLACEHOLDER}
        signature="— Fondateur·rice, Vanille’Or [à compléter]"
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

      <ChapterNav
        next={{
          label: "Nos engagements",
          href: "/maison/nos-engagements",
        }}
      />
    </div>
  );
}
