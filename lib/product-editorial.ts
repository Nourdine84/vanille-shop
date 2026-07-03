/**
 * Couche de contenu éditorial premium des fiches produit, indexée par slug.
 *
 * Volontairement SÉPARÉE des données commerciales (prix, formats, stock,
 * image) qui vivent en base : ce module ne contient QUE du contenu éditorial
 * (storytelling, usages, conservation, FAQ). Il ne modifie ni la DB, ni le
 * prix, ni le slug.
 *
 * Règle de non-fabrication : on n'écrit ici aucun prix, aucun taux de
 * vanilline, aucune certification, aucun nom de producteur. Uniquement le
 * contenu validé par l'équipe. Un produit sans entrée ici ne rend simplement
 * aucune section éditoriale (dégradation propre).
 */

export type ProductFaq = {
  question: string;
  answer: string;
};

export type ProductEditorial = {
  /** Titre éditorial (peut différer du nom commercial en base). */
  title: string;
  /** Accroche courte, sous le titre. */
  hook: string;
  origin?: string;
  aromaticProfile?: string;
  uses?: string[];
  conservation?: string;
  /** "Pourquoi choisir cette vanille" / bloc confiance. */
  trust?: string;
  faq?: ProductFaq[];
};

export const PRODUCT_EDITORIAL: Record<string, ProductEditorial> = {
  "vanille-bourbon-madagascar": {
    title: "Vanille Bourbon de Madagascar",
    hook: "Une vanille souple, brillante et généreuse, sélectionnée pour révéler toute la richesse aromatique de Madagascar.",
    origin: "Madagascar",
    aromaticProfile:
      "Notes chaudes, boisées, légèrement cacaotées, avec une profondeur idéale pour la pâtisserie, les crèmes, les infusions et les préparations maison.",
    uses: [
      "pâtisserie",
      "crèmes",
      "glaces",
      "ganaches",
      "rhums arrangés",
      "infusions",
      "desserts maison",
    ],
    conservation:
      "À conserver à température ambiante, à l'abri de la lumière et de l'humidité. Refermer soigneusement après ouverture.",
    trust:
      "Chaque lot est sélectionné pour sa souplesse, son parfum, sa texture et sa qualité visuelle. Notre objectif est de proposer une vanille fiable, élégante et adaptée aux passionnés comme aux professionnels.",
    faq: [
      {
        question: "Comment utiliser une gousse de vanille ?",
        answer:
          "Fendez la gousse dans la longueur, récupérez les graines avec la lame d'un couteau, puis incorporez-les directement à votre préparation.",
      },
      {
        question:
          "Peut-on réutiliser la gousse après avoir prélevé les graines ?",
        answer:
          "Oui. La gousse vidée peut parfumer du sucre, du lait, une crème ou une infusion.",
      },
      {
        question: "Comment conserver la vanille ?",
        answer:
          "Gardez-la dans un contenant bien fermé, à température ambiante, loin de la lumière et de l'humidité.",
      },
      {
        question: "Pourquoi certaines gousses sont-elles souples et brillantes ?",
        answer:
          "C'est généralement le signe d'une bonne préparation et d'une teneur naturelle en humidité préservée.",
      },
    ],
  },

  "vanille-pompona": {
    title: "Vanille Pompona Grand Calibre",
    hook: "Une vanille rare, généreuse et charnue, reconnue pour ses grandes gousses et son profil aromatique singulier.",
    origin: "Madagascar",
    aromaticProfile:
      "La Vanille Pompona offre un parfum doux, rond et enveloppant, avec des notes chaudes, fruitées et légèrement florales. Son grand calibre en fait une vanille visuellement remarquable, idéale pour les créations où la présence du produit compte autant que son arôme.",
    uses: [
      "pâtisserie",
      "infusions",
      "rhums arrangés",
      "crèmes",
      "desserts maison",
      "préparations artisanales",
      "créations premium",
    ],
    conservation:
      "À conserver dans un contenant bien fermé, à température ambiante, à l'abri de la lumière et de l'humidité. Éviter le réfrigérateur afin de préserver sa souplesse et son parfum.",
    trust:
      "Nous sélectionnons la Vanille Pompona pour son calibre, sa souplesse, son parfum et son caractère distinctif. Elle s'adresse aux passionnés comme aux professionnels qui recherchent une vanille différente, généreuse et élégante.",
    faq: [
      {
        question: "Quelle est la différence entre la Pompona et la Bourbon ?",
        answer:
          "La Pompona se distingue par des gousses généralement plus grandes et charnues, avec un profil aromatique plus doux, rond et floral.",
      },
      {
        question: "Comment utiliser la Vanille Pompona ?",
        answer:
          "Elle s'utilise comme une gousse classique : fendue dans la longueur pour récupérer les graines, ou infusée entière dans une préparation.",
      },
      {
        question: "Est-elle adaptée aux professionnels ?",
        answer:
          "Oui. Son grand calibre et son aspect visuel en font une vanille intéressante pour les créations artisanales, les infusions et les préparations premium.",
      },
      {
        question: "Comment la conserver ?",
        answer:
          "Dans un contenant fermé, à température ambiante, loin de la lumière et de l'humidité.",
      },
    ],
  },

  "caviar-de-vanille": {
    title: "Caviar de Vanille",
    hook: "Une préparation intense et prête à l'emploi, pensée pour apporter instantanément toute la profondeur aromatique de la vanille.",
    origin: "Madagascar",
    aromaticProfile:
      "Le caviar de vanille concentre les graines et les arômes de la vanille dans une texture généreuse, facile à doser. Il révèle des notes chaudes, rondes et légèrement boisées, idéales pour les préparations où l'intensité aromatique doit être immédiate et régulière.",
    uses: [
      "crèmes",
      "ganaches",
      "glaces",
      "pâtisserie",
      "desserts maison",
      "yaourts",
      "cocktails",
      "préparations professionnelles",
    ],
    conservation:
      "À conserver dans son contenant bien fermé, à température ambiante, à l'abri de la lumière et de l'humidité. Utiliser une cuillère propre à chaque prélèvement.",
    trust:
      "Nous sélectionnons le caviar de vanille pour sa praticité, son intensité et sa régularité. Il s'adresse aux passionnés comme aux professionnels qui recherchent une solution élégante, rapide et précise pour parfumer leurs créations.",
    faq: [
      {
        question:
          "Quelle est la différence entre une gousse et le caviar de vanille ?",
        answer:
          "La gousse demande d'être fendue pour récupérer les graines. Le caviar de vanille est prêt à l'emploi et permet un dosage plus rapide.",
      },
      {
        question: "Comment utiliser le caviar de vanille ?",
        answer:
          "Ajoutez une petite quantité directement dans votre préparation, puis mélangez pour répartir les graines et les arômes.",
      },
      {
        question: "Est-il adapté aux professionnels ?",
        answer:
          "Oui. Sa texture prête à l'emploi et son dosage précis sont particulièrement pratiques en pâtisserie, restauration et préparation artisanale.",
      },
      {
        question: "Comment le conserver ?",
        answer:
          "Conservez-le bien fermé, à température ambiante, loin de la lumière et de l'humidité, avec une cuillère propre à chaque utilisation.",
      },
    ],
  },
};

export function getProductEditorial(
  slug: string
): ProductEditorial | null {
  return PRODUCT_EDITORIAL[slug] ?? null;
}
