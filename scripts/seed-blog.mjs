/**
 * seed-blog.mjs — Contenu blog premium V1 Vanille'Or.
 *
 * Idempotent : upsert PAR SLUG (crée ou met à jour), n'affecte AUCUN autre
 * article. Supprime uniquement les slugs de test explicitement listés.
 *
 * SÉCURITÉ — le script est en DRY-RUN par défaut : il n'écrit RIEN tant que
 * l'option --commit n'est pas passée. Il affiche d'abord la base ciblée
 * (hôte masqué) pour éviter tout envoi accidentel en préprod/prod.
 *
 * Exécution :
 *   # 1) Aperçu sans écriture (défaut) :
 *   DATABASE_URL="postgresql://…" node scripts/seed-blog.mjs
 *
 *   # 2) Application réelle, après relecture de l'aperçu :
 *   DATABASE_URL="postgresql://…" node scripts/seed-blog.mjs --commit
 *
 * Ne modifie ni le schéma Prisma, ni les pages, ni le design.
 * Le modèle BlogPost utilisé : { title, slug (unique), excerpt?, content,
 * coverImage?, createdAt, updatedAt }. Aucun champ inventé.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* Slugs de démonstration à retirer du site. */
const TEST_SLUGS = ["test", "testproduit"];

/* Images existantes dans public/images (résolues par lib/image.getImageUrl). */
const IMG = {
  reconnaitre: "/images/vanille-bourbon.jpg",
  reference: "/images/about-vanille.jpg",
  conserver: "/images/vanille.jpg",
  utiliser: "/images/vanille-250.jpg",
  comparatif: "/images/pompona-vanille.jpg",
  chefs: "/images/caviar-vanille.jpg",
};

/**
 * 6 articles premium. `content` est du HTML (rendu via dangerouslySetInnerHTML,
 * comme les articles existants). Liens internes intégrés naturellement.
 */
const ARTICLES = [
  {
    slug: "comment-reconnaitre-vraie-vanille-madagascar",
    title: "Comment reconnaître une vraie vanille de Madagascar ?",
    excerpt:
      "Aspect, souplesse, parfum, humidité : les repères simples pour distinguer une gousse premium d'une gousse desséchée, et bien acheter.",
    coverImage: IMG.reconnaitre,
    content: `
      <p>
        Toutes les gousses de vanille ne se valent pas. Derrière une
        appellation identique se cachent des qualités très différentes,
        qui tiennent à la récolte, à l'affinage et à la conservation. Quelques
        repères simples suffisent pourtant à reconnaître une gousse d'exception.
      </p>

      <h2>L'aspect : souple, charnue, brillante</h2>
      <p>
        Une belle gousse de vanille est <strong>souple</strong> : on doit
        pouvoir l'enrouler autour d'un doigt sans qu'elle se casse. Elle est
        charnue, d'un brun sombre et régulier, avec une surface légèrement
        grasse et brillante. Une gousse rigide, cassante ou terne trahit
        généralement un séchage excessif ou une gousse trop âgée.
      </p>

      <h2>Le parfum : la signature</h2>
      <p>
        C'est le critère le plus fiable. Une vanille de qualité dégage un
        parfum immédiat, chaud et profond, sans avoir besoin d'être ouverte.
        Un arôme faible ou plat est le signe d'une gousse qui a perdu
        l'essentiel de son intérêt.
      </p>

      <h2>Les repères d'une gousse premium</h2>
      <ul>
        <li>✔ Souple et charnue, elle s'enroule sans se briser</li>
        <li>✔ Surface grasse, légèrement brillante</li>
        <li>✔ Parfum puissant perceptible sans la fendre</li>
        <li>✔ Taux d'humidité équilibré, ni sèche ni détrempée</li>
      </ul>

      <h2>Gousses sèches contre gousses premium</h2>
      <p>
        Une gousse desséchée n'est pas nécessairement mauvaise, mais elle a
        perdu en souplesse et en intensité : elle conviendra à une infusion,
        moins à une dégustation. À l'inverse, une gousse trop humide risque de
        moisir. L'équilibre est justement ce qui distingue une vanille bien
        affinée. Pour comprendre ce qui se joue en amont, voir aussi
        <a href="/blog/pourquoi-vanille-madagascar-reference-mondiale">pourquoi
        la vanille de Madagascar est une référence mondiale</a>.
      </p>

      <h2>Bien acheter</h2>
      <p>
        Privilégiez un vendeur qui décrit précisément l'origine et l'aspect de
        ses gousses, et qui propose plusieurs formats pour essayer avant de
        s'engager. Notre
        <a href="/collections/vanille">collection de vanilles de Madagascar</a>
        est sélectionnée sur ces mêmes critères ; la
        <a href="/products/vanille-bourbon-madagascar">Vanille Bourbon</a>
        en est le meilleur point de départ.
      </p>

      <blockquote>
        « Une grande vanille se reconnaît d'abord à son parfum, avant même
        d'être ouverte. »
      </blockquote>
    `,
  },

  {
    slug: "pourquoi-vanille-madagascar-reference-mondiale",
    title: "Pourquoi la vanille de Madagascar est-elle une référence mondiale ?",
    excerpt:
      "Terroir, climat, pollinisation à la main et affinage patient : ce qui fait de Madagascar la référence de la vanille Bourbon.",
    coverImage: IMG.reference,
    content: `
      <p>
        Quand on parle de vanille, un nom revient toujours : Madagascar. La
        grande île de l'océan Indien s'est imposée comme la référence de la
        vanille Bourbon, au point d'en être devenue synonyme dans l'esprit des
        chefs comme des amateurs.
      </p>

      <h2>Un terroir et un climat rares</h2>
      <p>
        La vanille est une orchidée exigeante. Elle a besoin de chaleur,
        d'humidité et d'un couvert végétal précis. Le nord-est de Madagascar
        réunit naturellement ces conditions, offrant à la liane un
        environnement particulièrement favorable au développement de ses arômes.
      </p>

      <h2>Une culture entièrement manuelle</h2>
      <p>
        La fleur de vanille ne s'ouvre qu'un jour, et sa pollinisation est
        réalisée <strong>à la main</strong>, fleur par fleur. Près de neuf mois
        séparent ensuite la pollinisation de la récolte. Derrière chaque gousse,
        il y a donc un travail long, minutieux et difficilement mécanisable.
      </p>

      <h2>L'affinage : là où naît l'arôme</h2>
      <p>
        Après la récolte viennent l'échaudage, l'étuvage, un séchage lent puis
        une longue période d'affinage. C'est durant ces semaines que la gousse
        acquiert sa couleur sombre, sa souplesse et son parfum caractéristique.
        Un affinage bien conduit fait toute la différence entre une gousse
        banale et une gousse d'exception.
      </p>

      <ul>
        <li>✔ Terroir tropical adapté à l'orchidée vanille</li>
        <li>✔ Pollinisation manuelle, fleur par fleur</li>
        <li>✔ Affinage patient de plusieurs semaines</li>
        <li>✔ Un savoir-faire transmis de génération en génération</li>
      </ul>

      <h2>Une place installée dans la durée</h2>
      <p>
        Cette combinaison — terroir, savoir-faire et affinage — explique la
        constance de qualité qui a fait la réputation de la vanille malgache.
        C'est cette régularité que recherchent les artisans, et que nous
        privilégions dans notre
        <a href="/collections/vanille">sélection de vanilles</a>. Reste ensuite
        à savoir <a href="/blog/comment-reconnaitre-vraie-vanille-madagascar">
        reconnaître une belle gousse</a> au moment de l'achat.
      </p>

      <blockquote>
        « À Madagascar, la vanille n'est pas seulement cultivée : elle est
        façonnée, lentement. »
      </blockquote>
    `,
  },

  {
    slug: "comment-conserver-gousses-vanille",
    title: "Comment conserver ses gousses de vanille ?",
    excerpt:
      "Bocal hermétique, à l'abri de la lumière et de l'humidité : les bons gestes pour garder vos gousses souples et parfumées, et les erreurs à éviter.",
    coverImage: IMG.conserver,
    content: `
      <p>
        Bien conservée, une gousse de vanille garde ses qualités aromatiques
        très longtemps. Mal rangée, elle sèche, durcit ou moisit en quelques
        semaines. La bonne nouvelle : les règles sont simples.
      </p>

      <h2>Les bonnes conditions</h2>
      <ul>
        <li>✔ Un contenant <strong>hermétique</strong> (bocal en verre, tube)</li>
        <li>✔ À l'abri de la <strong>lumière</strong></li>
        <li>✔ À <strong>température ambiante</strong>, loin d'une source de chaleur</li>
        <li>✔ Au sec : l'humidité est le principal ennemi</li>
      </ul>

      <h2>Les erreurs à éviter</h2>
      <p>
        La plus fréquente est de placer les gousses au
        <strong>réfrigérateur</strong> : le froid favorise la condensation,
        donc l'humidité, et accélère l'apparition de moisissures. Évitez aussi
        les sachets ouverts et le stockage au-dessus d'une plaque de cuisson,
        où la chaleur fait fuir les arômes.
      </p>

      <h2>Et si une gousse sèche un peu ?</h2>
      <p>
        Une gousse légèrement raidie n'est pas perdue : laissez-la quelques
        minutes dans un liquide chaud (lait, crème) avant de l'utiliser, ou
        réservez-la à l'infusion. Pour tirer le meilleur d'une gousse, qu'elle
        soit souple ou plus sèche, voir
        <a href="/blog/comment-utiliser-gousse-vanille">comment utiliser une
        gousse de A à Z</a>.
      </p>

      <h2>Réutiliser plutôt que jeter</h2>
      <p>
        Une gousse déjà grattée continue de parfumer : glissez-la dans un pot de
        sucre pour obtenir un sucre vanillé maison, ou dans une bouteille de
        rhum. Rien ne se perd. Nos
        <a href="/products/vanille-bourbon-madagascar">gousses de Vanille
        Bourbon</a> se prêtent particulièrement bien à ces seconds usages.
      </p>

      <blockquote>
        « Le secret d'une vanille qui dure : un bocal fermé, l'ombre, et surtout
        pas de réfrigérateur. »
      </blockquote>
    `,
  },

  {
    slug: "comment-utiliser-gousse-vanille",
    title: "Comment utiliser une gousse de vanille de A à Z ?",
    excerpt:
      "Fendre, gratter, infuser, puis réutiliser : le mode d'emploi complet de la gousse, jusqu'au sucre vanillé et au rhum arrangé.",
    coverImage: IMG.utiliser,
    content: `
      <p>
        Une gousse de vanille s'utilise en entier, des graines jusqu'à la peau.
        Voici la marche à suivre, étape par étape, pour n'en rien perdre.
      </p>

      <h2>1. Fendre la gousse</h2>
      <p>
        Posez la gousse à plat et fendez-la dans la longueur à l'aide d'un
        couteau, sans la couper en deux. Vous ouvrez ainsi l'accès aux graines,
        là où se concentre l'arôme.
      </p>

      <h2>2. Gratter les graines</h2>
      <p>
        Passez la lame du couteau à l'intérieur de la gousse pour récupérer les
        graines noires. Incorporez-les directement à votre préparation : crème,
        pâte, ganache, glace.
      </p>

      <h2>3. Infuser</h2>
      <p>
        Ne jetez pas la gousse grattée : plongez-la dans un liquide chaud
        (lait, crème, sirop) et laissez infuser. Elle libère encore beaucoup
        d'arôme. Retirez-la avant de servir.
      </p>

      <h2>4. Réutiliser la gousse</h2>
      <ul>
        <li>✔ Séchée puis glissée dans un pot de sucre → <strong>sucre vanillé</strong></li>
        <li>✔ Dans une bouteille d'alcool → <strong>rhum arrangé</strong></li>
        <li>✔ Dans une boîte de café ou de thé pour le parfumer</li>
      </ul>

      <h2>Quelle gousse choisir ?</h2>
      <p>
        Pour la dégustation, une gousse souple et charnue donnera les meilleurs
        résultats — d'où l'importance de
        <a href="/blog/comment-reconnaitre-vraie-vanille-madagascar">savoir la
        reconnaître</a> et de
        <a href="/blog/comment-conserver-gousses-vanille">bien la conserver</a>.
        Notre <a href="/products/vanille-bourbon-madagascar">Vanille Bourbon de
        Madagascar</a> convient à la plupart des usages ; pour un profil plus
        singulier, découvrez la
        <a href="/products/vanille-pompona">Vanille Pompona</a>.
      </p>

      <blockquote>
        « De la graine à la peau, une gousse de vanille se déguste jusqu'au
        bout. »
      </blockquote>
    `,
  },

  {
    slug: "bourbon-pompona-givree-differences",
    title: "Vanille Bourbon, Pompona, givrée : quelles différences ?",
    excerpt:
      "Trois vanilles, trois caractères. Profils aromatiques, intensité et usages pour choisir la bonne selon vos préparations.",
    coverImage: IMG.comparatif,
    content: `
      <p>
        Sous le mot « vanille » se cachent des réalités différentes. Trois
        d'entre elles reviennent souvent : la Bourbon, la Pompona et les
        gousses dites « givrées ». Voici de quoi les distinguer clairement.
      </p>

      <h2>La Vanille Bourbon</h2>
      <p>
        C'est la vanille de référence de Madagascar : équilibrée, chaleureuse,
        aux notes boisées et légèrement cacaotées. Polyvalente, elle convient à
        la pâtisserie, aux crèmes, aux glaces et aux infusions. C'est le choix
        le plus sûr pour un usage quotidien. Découvrez-la
        <a href="/products/vanille-bourbon-madagascar">ici</a>.
      </p>

      <h2>La Vanille Pompona</h2>
      <p>
        Plus rare, la <a href="/products/vanille-pompona">Pompona</a> se
        distingue par ses gousses charnues et un profil aromatique singulier,
        plus corsé, aux nuances parfois boisées et florales. On l'apprécie pour
        des préparations où l'on veut un caractère marqué et une signature un
        peu différente de la Bourbon.
      </p>

      <h2>La vanille « givrée »</h2>
      <p>
        Le « givre » désigne de fins cristaux blancs qui apparaissent
        naturellement à la surface de certaines gousses particulièrement bien
        affinées : c'est la vanilline qui remonte et cristallise. Ce phénomène
        ne se provoque pas et ne touche pas toutes les gousses. Il accompagne
        souvent une belle profondeur aromatique — mais une excellente gousse
        peut ne jamais givrer.
      </p>

      <h2>Comment choisir ?</h2>
      <ul>
        <li>✔ <strong>Bourbon</strong> : polyvalente, valeur sûre du quotidien</li>
        <li>✔ <strong>Pompona</strong> : caractère marqué, pour se démarquer</li>
        <li>✔ <strong>Givrée</strong> : recherche d'une gousse longuement affinée</li>
      </ul>

      <p>
        Le meilleur moyen de se faire une idée reste de comparer. Parcourez
        l'ensemble de nos <a href="/collections/vanille">vanilles</a> ou
        l'intégralité de la <a href="/products">boutique</a> pour trouver celle
        qui correspond à vos préparations.
      </p>

      <blockquote>
        « Il n'y a pas une vanille, mais des vanilles : à chacune ses usages. »
      </blockquote>
    `,
  },

  {
    slug: "pourquoi-chefs-choisissent-vanille-premium",
    title: "Pourquoi les chefs choisissent une vanille premium ?",
    excerpt:
      "Rendement aromatique, régularité, coût réel à l'usage : pourquoi les professionnels raisonnent en qualité plutôt qu'en prix affiché.",
    coverImage: IMG.chefs,
    content: `
      <p>
        Pour un professionnel, le prix d'une gousse ne dit pas grand-chose. Ce
        qui compte, c'est ce qu'elle apporte réellement à une préparation — et
        sur ce terrain, une vanille premium change tout.
      </p>

      <h2>Le rendement aromatique</h2>
      <p>
        Une gousse charnue et bien affinée est riche en graines et en arôme :
        il en faut moins pour parfumer une même quantité de crème ou de pâte.
        Une gousse pauvre, à l'inverse, oblige à en utiliser davantage pour un
        résultat moins net. Le « moins cher » finit souvent par coûter plus.
      </p>

      <h2>La régularité</h2>
      <p>
        En cuisine professionnelle, la reproductibilité est essentielle : une
        recette calibrée doit rendre le même résultat d'un service à l'autre.
        Une vanille de qualité constante, d'un lot à l'autre, est la condition
        de cette régularité.
      </p>

      <h2>Le coût réel à l'usage</h2>
      <ul>
        <li>✔ Meilleur rendement → moins de gousses par préparation</li>
        <li>✔ Qualité constante → moins de pertes et de ratés</li>
        <li>✔ Arôme net → un résultat qui se remarque à la dégustation</li>
      </ul>

      <h2>Un choix de cohérence</h2>
      <p>
        Choisir une vanille premium, ce n'est pas payer plus cher pour le
        prestige : c'est raisonner en coût réel et en résultat final. C'est
        aussi ce qui permet de <a href="/blog/comment-utiliser-gousse-vanille">
        tirer le meilleur de chaque gousse</a>, jusqu'à la dernière infusion.
      </p>

      <p>
        Nous accompagnons les artisans, restaurateurs et pâtissiers avec une
        sélection pensée pour l'usage professionnel. Pour des besoins récurrents
        ou des volumes, découvrez notre
        <a href="/b2b">offre professionnelle</a>, ou parcourez d'abord la
        <a href="/collections/vanille">collection de vanilles</a>.
      </p>

      <blockquote>
        « Un chef ne compte pas le prix d'une gousse, mais ce qu'elle apporte
        à l'assiette. »
      </blockquote>
    `,
  },
];

/* ------------------------------------------------------------------ */

function maskedDbHost() {
  const url = process.env.DATABASE_URL || "";
  const m = url.match(/@([^/:?]+)/);
  return m ? m[1] : "(DATABASE_URL non défini)";
}

async function main() {
  const commit = process.argv.includes("--commit");

  console.log("── Seed blog premium V1 ──────────────────────────────");
  console.log("Base ciblée (hôte) :", maskedDbHost());
  console.log("Mode               :", commit ? "⚠️  COMMIT (écriture réelle)" : "DRY-RUN (aucune écriture)");
  console.log("Articles à upsert  :", ARTICLES.length);
  console.log("Slugs test à retirer:", TEST_SLUGS.join(", "));
  console.log("──────────────────────────────────────────────────────");

  if (!commit) {
    for (const a of ARTICLES) {
      console.log(`  [dry-run] upsert  ${a.slug}  — "${a.title}"`);
    }
    for (const s of TEST_SLUGS) {
      console.log(`  [dry-run] delete  ${s}`);
    }
    console.log("\nDRY-RUN terminé — rien n'a été écrit. Relancez avec --commit pour appliquer.");
    return;
  }

  // Suppression ciblée des articles de test (uniquement ces slugs).
  const del = await prisma.blogPost.deleteMany({
    where: { slug: { in: TEST_SLUGS } },
  });
  console.log(`  ✔ articles de test supprimés : ${del.count}`);

  // Upsert idempotent par slug : n'affecte aucun autre article.
  for (const a of ARTICLES) {
    await prisma.blogPost.upsert({
      where: { slug: a.slug },
      update: {
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        coverImage: a.coverImage,
      },
      create: {
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        coverImage: a.coverImage,
      },
    });
    console.log(`  ✔ upsert ${a.slug}`);
  }

  const total = await prisma.blogPost.count();
  console.log(`\n✅ Terminé. Articles en base : ${total}`);
}

main()
  .catch((e) => {
    console.error("❌ Erreur :", e.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
