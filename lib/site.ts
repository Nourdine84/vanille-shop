/**
 * Source unique de vérité pour l'URL et le nom du site.
 *
 * Le domaine était dispersé et incohérent (vanilleor.fr dans les pages
 * légales / contact / email / facture — autoritatif — vs vanille-or.com dans
 * robots/sitemap). On centralise ici, avec override possible par env en prod.
 *
 * Domaine par défaut = vanilleor.fr (celui des mentions légales réelles).
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
  "https://vanilleor.fr";

export const SITE_NAME = "Vanille'Or";

export const SITE_DESCRIPTION =
  "Vanille premium de Madagascar pour particuliers et professionnels.";
