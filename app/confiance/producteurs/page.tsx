import type { Metadata } from "next";
import ConfianceSubPage from "@/components/confiance/ConfianceSubPage";

const description =
  "Le lien de Vanille’Or avec les producteurs de Madagascar : relations directes, durée, et transparence sur nos limites actuelles.";

export const metadata: Metadata = {
  title: "Producteurs partenaires | Vanille’Or",
  description,
  alternates: {
    canonical: "/confiance/producteurs",
  },
  openGraph: {
    title: "Producteurs partenaires | Vanille’Or",
    description,
    type: "website",
  },
};

export default function ProducteursPage() {
  return (
    <ConfianceSubPage
      title="Producteurs partenaires"
      intro="Notre lien avec les producteurs de Madagascar, décrit tel qu’il est aujourd’hui."
      cta={{ label: "Échanger avec nous", href: "/contact" }}
      sections={[
        {
          title: "Une filière exigeante",
          body: (
            <p>
              La vanille est l’une des cultures les plus exigeantes au monde.
              Chaque fleur est pollinisée à la main, et près de neuf mois
              séparent la pollinisation de la récolte. Derrière chaque gousse,
              il y a un travail long, minutieux, et difficilement mécanisable.
            </p>
          ),
        },
        {
          title: "Des relations directes",
          body: (
            <p>
              Nous privilégions des relations directes et durables avec nos
              partenaires à Madagascar, en limitant le nombre
              d’intermédiaires. Cette proximité nous permet de mieux
              comprendre l’origine de ce que nous vendons, et de construire
              une collaboration dans la durée plutôt qu’au coup par coup.
            </p>
          ),
        },
        {
          title: "Notre position sur la rémunération",
          body: (
            <p>
              Nous considérons qu’un produit d’exception ne peut reposer sur
              une rémunération insuffisante de ceux qui le cultivent. C’est un
              principe qui guide nos décisions d’achat.
            </p>
          ),
        },
        {
          title: "Ce que nous ne revendiquons pas",
          body: (
            <p>
              Vanille’Or ne détient <strong>aucune certification de commerce
              équitable</strong> et ne s’en réclame pas. Nous ne publions pas
              non plus le détail de nos accords commerciaux. Ce que nous
              décrivons ici relève de notre pratique et de nos engagements, non
              d’une labellisation par un organisme tiers.
            </p>
          ),
        },
      ]}
    />
  );
}
