import type { Metadata } from "next";
import ConfianceSubPage from "@/components/confiance/ConfianceSubPage";

const description =
  "Les standards de sélection de Vanille’Or : origine Madagascar, critères de choix, conservation et transparence sur ce que nous ne revendiquons pas.";

export const metadata: Metadata = {
  title: "Notre qualité | Vanille’Or",
  description,
  alternates: {
    canonical: "/confiance/qualite",
  },
  openGraph: {
    title: "Notre qualité | Vanille’Or",
    description,
    type: "website",
  },
};

export default function QualitePage() {
  return (
    <ConfianceSubPage
      title="Notre qualité"
      intro="Les standards de sélection derrière chacun de nos produits, expliqués sans emphase."
      cta={{ label: "Voir le catalogue", href: "/products" }}
      sections={[
        {
          title: "L’origine",
          body: (
            <p>
              Notre vanille provient de <strong>Madagascar</strong>, première
              région productrice de vanille Bourbon. Nous travaillons
              également des épices et des produits dérivés issus de cette même
              filière.
            </p>
          ),
        },
        {
          title: "Nos critères de sélection",
          body: (
            <>
              <p>
                Chaque référence est évaluée sur des critères simples et
                observables&nbsp;:
              </p>
              <ul>
                <li>l’aspect de la gousse et sa régularité&nbsp;;</li>
                <li>sa souplesse, signe d’une bonne teneur en eau&nbsp;;</li>
                <li>l’intensité et la finesse du parfum&nbsp;;</li>
                <li>la constance d’un lot à l’autre.</li>
              </ul>
            </>
          ),
        },
        {
          title: "Conserver vos produits",
          body: (
            <p>
              La vanille se conserve à l’abri de la lumière, de la chaleur et
              de l’humidité, dans un contenant refermé. Conservée dans de
              bonnes conditions, une gousse garde ses qualités aromatiques
              durablement. Évitez le réfrigérateur, qui favorise la
              condensation.
            </p>
          ),
        },
        {
          title: "Ce que nous ne revendiquons pas",
          body: (
            <p>
              Par souci d’honnêteté, nous ne revendiquons{" "}
              <strong>aucune certification</strong> que nous ne détenons pas,
              et nous ne publions pas de notation ou de score de qualité
              interne. Notre exigence se juge sur le produit reçu — et notre
              politique de retours existe précisément pour cela.
            </p>
          ),
        },
      ]}
    />
  );
}
