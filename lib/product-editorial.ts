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
};

export function getProductEditorial(
  slug: string
): ProductEditorial | null {
  return PRODUCT_EDITORIAL[slug] ?? null;
}
