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

  // NB : clé = slug DB tel quel, avec la faute de frappe "extrai" (sans "t").
  // Ne pas "corriger" en "extrait-vanille" → provoquerait un miss silencieux.
  "extrai-vanille": {
    title: "Extrait de Vanille",
    hook: "Une solution aromatique fluide et pratique, idéale pour parfumer rapidement vos préparations avec la douceur de la vanille.",
    origin: "Madagascar",
    aromaticProfile:
      "L'extrait de vanille révèle des notes douces, chaudes et rondes, avec une intensité facile à doser. Sa texture liquide permet une incorporation rapide dans les préparations sucrées, les boissons, les crèmes et les recettes du quotidien.",
    uses: [
      "pâtisserie",
      "crèmes",
      "boissons chaudes",
      "cocktails",
      "glaces",
      "yaourts",
      "desserts maison",
      "préparations professionnelles",
    ],
    conservation:
      "À conserver dans son flacon bien fermé, à température ambiante, à l'abri de la lumière et de la chaleur. Agiter légèrement avant utilisation si nécessaire.",
    trust:
      "Nous sélectionnons l'extrait de vanille pour sa praticité, sa régularité et sa facilité d'utilisation. Il permet d'apporter rapidement une touche aromatique élégante aux créations du quotidien comme aux préparations professionnelles.",
    faq: [
      {
        question:
          "Quelle est la différence entre une gousse et un extrait de vanille ?",
        answer:
          "La gousse apporte les graines et une infusion plus traditionnelle. L'extrait est liquide, prêt à doser et plus rapide à incorporer.",
      },
      {
        question: "Comment utiliser l'extrait de vanille ?",
        answer:
          "Ajoutez quelques gouttes ou une petite quantité directement dans votre préparation, puis mélangez.",
      },
      {
        question: "Peut-on l'utiliser dans les boissons ?",
        answer:
          "Oui. Il peut parfumer un chocolat chaud, un café, un cocktail, une infusion ou une boisson lactée.",
      },
      {
        question: "Comment le conserver ?",
        answer:
          "Gardez le flacon bien fermé, à température ambiante, loin de la lumière et de la chaleur.",
      },
    ],
  },

  "poudre-de-vanille": {
    title: "Poudre de Vanille",
    hook: "Une poudre fine et concentrée, prête à doser, pour parfumer et colorer naturellement vos préparations d'une touche de vanille.",
    origin: "Madagascar",
    aromaticProfile:
      "Obtenue à partir de gousses broyées, la poudre de vanille concentre l'arôme dans une texture fine et régulière. Elle libère des notes chaudes, douces et légèrement boisées, et se répartit de façon homogène pour parfumer sans ajouter de liquide à vos préparations.",
    uses: [
      "pâtisserie",
      "boissons chaudes",
      "coloration naturelle",
      "crèmes",
      "yaourts",
      "sucres parfumés",
      "pâtes et biscuits",
      "préparations professionnelles",
    ],
    conservation:
      "À conserver dans un contenant hermétique, à température ambiante, à l'abri de la lumière et surtout de l'humidité pour éviter que la poudre ne s'agglomère. Prélever avec une cuillère sèche.",
    trust:
      "Nous sélectionnons la poudre de vanille pour sa finesse, son intensité et sa simplicité d'utilisation. Elle offre une solution précise et régulière aux passionnés comme aux professionnels qui souhaitent parfumer et colorer leurs créations sans ajout de liquide.",
    faq: [
      {
        question:
          "Quelle est la différence entre une gousse et la poudre de vanille ?",
        answer:
          "La gousse doit être fendue et infusée pour libérer ses arômes. La poudre est prête à doser et s'incorpore directement, sans infusion ni liquide ajouté.",
      },
      {
        question: "Comment utiliser la poudre de vanille ?",
        answer:
          "Ajoutez une petite quantité directement dans votre préparation, sèche ou liquide, puis mélangez pour répartir l'arôme de façon homogène.",
      },
      {
        question: "Peut-on l'utiliser pour colorer une préparation ?",
        answer:
          "Oui. La poudre apporte une teinte naturelle et de fins points vanillés, appréciés en pâtisserie, dans les crèmes et les glaces.",
      },
      {
        question: "Comment la conserver ?",
        answer:
          "Dans un contenant hermétique, à température ambiante, à l'abri de la lumière et de l'humidité, en prélevant avec une cuillère sèche pour éviter qu'elle ne s'agglomère.",
      },
    ],
  },
};

export function getProductEditorial(
  slug: string
): ProductEditorial | null {
  return PRODUCT_EDITORIAL[slug] ?? null;
}
