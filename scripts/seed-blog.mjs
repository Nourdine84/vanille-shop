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
 *
 * Note style : le contenu est du HTML rendu via dangerouslySetInnerHTML
 * (comme les articles existants). L'encadré « Le conseil de la Maison » est
 * mis en forme par des styles INLINE — il voyage avec le contenu et ne touche
 * à aucune feuille de style ni au design du site.
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
 * Encadré « Le conseil de la Maison Vanille'Or ».
 * Styles inline uniquement — aucune dépendance à une feuille de style.
 */
function conseil(inner) {
  return `
      <aside style="margin:34px 0;padding:22px 26px;background:#fff7ed;border-left:4px solid #a16207;border-radius:14px;">
        <p style="margin:0 0 8px;font-weight:800;color:#a16207;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">Le conseil de la Maison Vanille'Or</p>
        <p style="margin:0;color:#4a3f33;">${inner}</p>
      </aside>`;
}

/**
 * 6 articles premium. Introduction narrative, intertitres soignés, encadré
 * « conseil de la Maison », conclusion avec CTA naturel, maillage interne.
 */
const ARTICLES = [
  {
    slug: "comment-reconnaitre-vraie-vanille-madagascar",
    title: "Comment reconnaître une vraie vanille de Madagascar ?",
    excerpt:
      "Aspect, souplesse, parfum, humidité : les repères de la Maison Vanille'Or pour distinguer une gousse d'exception d'une gousse ordinaire — et acheter juste.",
    coverImage: IMG.reconnaitre,
    content: `
      <p>
        Il suffit parfois d'ouvrir un bocal pour comprendre. Une vraie vanille
        de Madagascar se signale avant même qu'on la touche : un parfum chaud
        s'échappe, dense, presque gourmand. À côté, une gousse ordinaire reste
        muette. Entre les deux, tout se joue sur quelques détails que l'œil et
        le nez apprennent vite à repérer.
      </p>

      <p>
        Chez Vanille'Or, chaque lot passe par cette lecture attentive avant
        d'être proposé. Voici les repères que nous appliquons — les mêmes qui
        vous permettront, à votre tour, de ne jamais vous tromper.
      </p>

      <h2>L'aspect : souple, charnue, vivante</h2>
      <p>
        Une belle gousse est <strong>souple</strong> : elle s'enroule autour du
        doigt sans se briser. Elle est charnue, d'un brun profond et régulier,
        la surface légèrement grasse et satinée. Une gousse rigide, cassante ou
        terne raconte l'inverse : un séchage excessif, ou le temps qui a passé.
      </p>

      <h2>Le parfum : la signature de la Maison</h2>
      <p>
        C'est le juge de paix. Une vanille d'exception dégage un parfum immédiat,
        chaud et profond, sans même être fendue. Un arôme faible ou plat trahit
        une gousse qui a perdu l'essentiel de son âme.
      </p>

      ${conseil(
        "Fiez-vous d'abord à votre nez, jamais au seul prix. Approchez la gousse, " +
          "fermez les yeux : si le parfum vous vient sans effort, chaud et enveloppant, " +
          "vous tenez une belle vanille. C'est ce test, tout simple, que nous faisons sur chaque lot."
      )}

      <h2>Les repères d'une gousse d'exception</h2>
      <ul>
        <li>✔ Souple et charnue, elle s'enroule sans casser</li>
        <li>✔ Surface grasse, légèrement satinée</li>
        <li>✔ Parfum puissant, perceptible sans la fendre</li>
        <li>✔ Humidité équilibrée : ni sèche, ni détrempée</li>
      </ul>

      <h2>Gousses sèches, gousses premium</h2>
      <p>
        Une gousse desséchée n'est pas mauvaise : elle a simplement perdu en
        souplesse et en intensité, et conviendra mieux à une infusion qu'à une
        dégustation. Une gousse trop humide, elle, risque la moisissure.
        L'équilibre entre les deux — c'est précisément ce que produit un
        affinage patient, dont nous parlons dans
        <a href="/blog/pourquoi-vanille-madagascar-reference-mondiale">pourquoi
        Madagascar est une référence mondiale</a>.
      </p>

      <h2>Bien acheter, en confiance</h2>
      <p>
        Un bon vendeur décrit précisément l'origine et l'aspect de ses gousses,
        et propose plusieurs formats pour essayer avant de s'engager. C'est
        l'esprit de notre
        <a href="/collections/vanille">collection de vanilles de Madagascar</a>,
        et l'engagement que nous détaillons dans notre
        <a href="/confiance/qualite">démarche qualité</a>.
      </p>

      <p>
        Envie de commencer par une valeur sûre ? La
        <a href="/products/vanille-bourbon-madagascar">Vanille Bourbon de
        Madagascar</a> réunit tous ces repères : souplesse, parfum, régularité.
        Le plus simple, pour se faire l'œil et le nez, reste encore de la
        goûter.
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
      "Terroir, climat, pollinisation à la main, affinage patient : ce qui a fait de Madagascar la référence de la vanille Bourbon — et pourquoi la Maison Vanille'Or y puise sa sélection.",
    coverImage: IMG.reference,
    content: `
      <p>
        Il existe des noms qui suffisent à eux seuls. Pour la vanille, ce nom
        est Madagascar. Au point que, dans l'esprit des chefs comme des
        amateurs, « vanille de Madagascar » et « grande vanille » finissent par
        se confondre. Cette réputation ne doit rien au hasard : elle est le
        fruit d'un terroir rare et d'un savoir-faire patient.
      </p>

      <h2>Un terroir que l'on ne recrée pas</h2>
      <p>
        La vanille est une orchidée exigeante : il lui faut de la chaleur, de
        l'humidité et un couvert végétal précis. Le nord-est de la grande île
        réunit naturellement ces conditions, offrant à la liane un
        environnement d'une rare justesse.
      </p>

      <h2>Une culture entièrement à la main</h2>
      <p>
        La fleur de vanille ne s'ouvre qu'un seul jour. Sa pollinisation se fait
        <strong>à la main</strong>, fleur après fleur, dans une course contre la
        montre. Puis près de neuf mois s'écoulent avant la récolte. Derrière
        chaque gousse, il y a donc un geste répété des milliers de fois, que
        rien n'est venu mécaniser.
      </p>

      ${conseil(
        "Quand vous choisissez une gousse de Madagascar, vous ne payez pas seulement " +
          "un arôme : vous rétribuez neuf mois de patience et un geste manuel. C'est cette " +
          "réalité qui guide nos décisions d'achat, et que nous assumons dans notre tarif."
      )}

      <h2>L'affinage : là où naît l'arôme</h2>
      <p>
        Échaudage, étuvage, séchage lent, puis de longues semaines d'affinage :
        c'est durant cette étape que la gousse prend sa couleur sombre, sa
        souplesse et son parfum. Un affinage bien conduit sépare la gousse
        banale de la gousse d'exception — c'est aussi lui qui fait apparaître,
        sur certaines gousses, le fameux « givre » de vanilline dont nous
        parlons dans notre
        <a href="/blog/bourbon-pompona-givree-differences">comparatif des
        vanilles</a>.
      </p>

      <ul>
        <li>✔ Un terroir tropical taillé pour l'orchidée vanille</li>
        <li>✔ Une pollinisation manuelle, fleur par fleur</li>
        <li>✔ Un affinage patient de plusieurs semaines</li>
        <li>✔ Un savoir-faire transmis de génération en génération</li>
      </ul>

      <h2>Une constance qui fait la différence</h2>
      <p>
        Terroir, geste, affinage : cette combinaison explique la régularité de
        qualité qui a bâti la réputation malgache. C'est cette constance que
        recherchent les artisans, et celle que nous privilégions dans notre
        <a href="/collections/vanille">sélection de vanilles</a>. Reste ensuite
        à savoir <a href="/blog/comment-reconnaitre-vraie-vanille-madagascar">
        reconnaître une belle gousse</a> — et à la choisir.
      </p>

      <p>
        Pour découvrir cette référence chez vous, commencez par la
        <a href="/products/vanille-bourbon-madagascar">Vanille Bourbon de
        Madagascar</a>, cœur de notre maison.
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
      "Bocal hermétique, à l'abri de la lumière et de l'humidité : les gestes de la Maison Vanille'Or pour garder vos gousses souples et parfumées — et l'erreur qui les abîme.",
    coverImage: IMG.conserver,
    content: `
      <p>
        Une belle gousse de vanille est un produit vivant. Bien traitée, elle
        garde ses arômes très longtemps ; oubliée dans un tiroir ou reléguée au
        réfrigérateur, elle sèche, durcit ou moisit en quelques semaines. La
        bonne nouvelle : la préserver ne demande ni matériel, ni tour de main
        particulier — seulement les bons réflexes.
      </p>

      <h2>Les bonnes conditions</h2>
      <ul>
        <li>✔ Un contenant <strong>hermétique</strong> — bocal en verre ou tube</li>
        <li>✔ À l'abri de la <strong>lumière</strong></li>
        <li>✔ À <strong>température ambiante</strong>, loin de toute source de chaleur</li>
        <li>✔ Au sec : l'humidité reste l'ennemi n°1</li>
      </ul>

      <h2>L'erreur à éviter absolument</h2>
      <p>
        La plus répandue consiste à ranger ses gousses au
        <strong>réfrigérateur</strong>. Le froid provoque de la condensation,
        donc de l'humidité, et ouvre la porte aux moisissures. Évitez aussi les
        sachets laissés ouverts et le rangement au-dessus d'une plaque de
        cuisson, où la chaleur fait fuir les arômes.
      </p>

      ${conseil(
        "Un bocal en verre, un coin d'placard à l'ombre, et surtout jamais le frigo : " +
          "c'est tout ce dont vos gousses ont besoin. Glissez-y une gousse déjà grattée, " +
          "elle continuera de parfumer l'ensemble."
      )}

      <h2>Et si une gousse se raidit ?</h2>
      <p>
        Rien n'est perdu : plongez-la quelques minutes dans un liquide chaud
        (lait, crème) avant usage, ou réservez-la à l'infusion. Pour en tirer le
        meilleur, qu'elle soit souple ou plus sèche, suivez notre guide
        <a href="/blog/comment-utiliser-gousse-vanille">pour utiliser une gousse
        de A à Z</a>.
      </p>

      <h2>Réutiliser, plutôt que jeter</h2>
      <p>
        Une gousse déjà grattée a encore beaucoup à offrir : dans un pot de
        sucre, elle donne un sucre vanillé maison ; dans une bouteille de rhum,
        un rhum arrangé. Nos
        <a href="/products/vanille-bourbon-madagascar">gousses de Vanille
        Bourbon</a> se prêtent particulièrement bien à ces secondes vies — et
        vous verrez, on prend vite l'habitude de ne plus rien jeter.
      </p>

      <p>
        Envie de refaire le plein ? Retrouvez l'ensemble de nos gousses dans la
        <a href="/collections/vanille">collection vanille</a>.
      </p>

      <blockquote>
        « Le secret d'une vanille qui dure tient en trois mots : bocal, ombre,
        pas de frigo. »
      </blockquote>
    `,
  },

  {
    slug: "comment-utiliser-gousse-vanille",
    title: "Comment utiliser une gousse de vanille de A à Z ?",
    excerpt:
      "Fendre, gratter, infuser, puis réutiliser : le mode d'emploi complet de la Maison Vanille'Or, jusqu'au sucre vanillé et au rhum arrangé.",
    coverImage: IMG.utiliser,
    content: `
      <p>
        Une gousse de vanille ne se résume pas à ses graines. De la pointe du
        couteau jusqu'à la dernière infusion, elle se déguste en entier — et
        c'est là tout le plaisir. Voici, étape par étape, comment n'en rien
        perdre.
      </p>

      <h2>1. Fendre</h2>
      <p>
        Posez la gousse à plat et fendez-la dans la longueur, sans la couper en
        deux. Vous ouvrez ainsi l'accès aux graines, là où l'arôme se concentre.
      </p>

      <h2>2. Gratter</h2>
      <p>
        Passez la lame à l'intérieur pour recueillir les graines noires.
        Incorporez-les directement à votre préparation : crème, pâte, ganache,
        glace.
      </p>

      <h2>3. Infuser</h2>
      <p>
        Ne jetez surtout pas la gousse grattée : plongée dans un liquide chaud
        (lait, crème, sirop), elle libère encore beaucoup d'arôme. Retirez-la
        avant de servir.
      </p>

      <h2>4. Réutiliser</h2>
      <ul>
        <li>✔ Séchée puis glissée dans un pot de sucre → <strong>sucre vanillé</strong></li>
        <li>✔ Dans une bouteille d'alcool → <strong>rhum arrangé</strong></li>
        <li>✔ Dans un pot de café ou une boîte de thé, pour les parfumer</li>
      </ul>

      ${conseil(
        "Gardez un « bocal à gousses usagées » : chaque gousse déjà grattée y rejoint " +
          "les précédentes, au milieu du sucre. Au fil des semaines, vous obtenez un sucre " +
          "vanillé maison bien plus parfumé que n'importe quel sachet du commerce."
      )}

      <h2>Quelle gousse pour quel usage ?</h2>
      <p>
        Pour la dégustation, rien ne vaut une gousse souple et charnue — d'où
        l'intérêt de
        <a href="/blog/comment-reconnaitre-vraie-vanille-madagascar">savoir la
        reconnaître</a> et de la
        <a href="/blog/comment-conserver-gousses-vanille">conserver
        correctement</a>. Notre
        <a href="/products/vanille-bourbon-madagascar">Vanille Bourbon</a>
        convient à la plupart des préparations ; pour un caractère plus
        singulier, tournez-vous vers la
        <a href="/products/vanille-pompona">Vanille Pompona</a>.
      </p>

      <p>
        Il ne vous reste plus qu'à choisir la vôtre dans la
        <a href="/collections/vanille">collection vanille</a>, et à passer en
        cuisine.
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
      "Trois vanilles, trois caractères. Le comparatif de la Maison Vanille'Or : profils aromatiques, intensité et usages pour choisir la bonne à coup sûr.",
    coverImage: IMG.comparatif,
    content: `
      <p>
        Un même mot, « vanille », recouvre des réalités très différentes. Trois
        d'entre elles reviennent souvent dans nos échanges avec les
        passionnés : la Bourbon, la Pompona, et les gousses dites « givrées ».
        Prenons le temps de les distinguer — c'est ainsi qu'on choisit juste.
      </p>

      <h2>La Vanille Bourbon</h2>
      <p>
        C'est la référence de Madagascar : équilibrée, chaleureuse, aux notes
        boisées et légèrement cacaotées. Polyvalente, elle accompagne aussi bien
        la pâtisserie que les crèmes, les glaces ou les infusions. Pour un usage
        quotidien, c'est le choix le plus sûr. Découvrez-la
        <a href="/products/vanille-bourbon-madagascar">ici</a>.
      </p>

      <h2>La Vanille Pompona</h2>
      <p>
        Plus rare, la <a href="/products/vanille-pompona">Pompona</a> se
        distingue par des gousses charnues et un profil plus corsé, aux nuances
        boisées et parfois florales. On la choisit quand on cherche un caractère
        affirmé, une signature qui tranche avec la Bourbon.
      </p>

      <h2>La vanille « givrée »</h2>
      <p>
        Le « givre » désigne ces fins cristaux blancs qui apparaissent
        naturellement à la surface de certaines gousses longuement affinées :
        c'est la vanilline qui remonte et cristallise. Le phénomène ne se
        provoque pas et ne concerne pas toutes les gousses. Il accompagne
        souvent une belle profondeur aromatique — mais, soyons honnêtes, une
        excellente gousse peut très bien ne jamais givrer.
      </p>

      ${conseil(
        "Ne cherchez pas le « givre » à tout prix : ce n'est pas un label, mais un heureux " +
          "hasard de l'affinage. Choisissez d'abord selon l'usage — Bourbon pour la polyvalence, " +
          "Pompona pour le caractère — et laissez le givre être une jolie surprise."
      )}

      <h2>Comment choisir ?</h2>
      <ul>
        <li>✔ <strong>Bourbon</strong> — polyvalente, la valeur sûre du quotidien</li>
        <li>✔ <strong>Pompona</strong> — caractère marqué, pour se démarquer</li>
        <li>✔ <strong>Givrée</strong> — la recherche d'une gousse longuement affinée</li>
      </ul>

      <p>
        Le meilleur juge reste votre palais. Pour comprendre d'où vient cette
        diversité, relisez
        <a href="/blog/pourquoi-vanille-madagascar-reference-mondiale">pourquoi
        Madagascar est une référence mondiale</a> ; pour passer à la pratique,
        parcourez nos <a href="/collections/vanille">vanilles</a> ou
        l'ensemble de la <a href="/products">boutique</a>.
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
      "Rendement aromatique, régularité, coût réel à l'usage : pourquoi les professionnels raisonnent en qualité — et comment la Maison Vanille'Or les accompagne.",
    coverImage: IMG.chefs,
    content: `
      <p>
        Demandez à un chef pourquoi il paie sa vanille plus cher, il vous
        répondra rarement par le prix. Il vous parlera de rendement, de
        régularité, de résultat dans l'assiette. Car pour un professionnel, une
        gousse ne se juge pas à son étiquette, mais à ce qu'elle apporte
        réellement — et sur ce terrain, une vanille premium change tout.
      </p>

      <h2>Le rendement aromatique</h2>
      <p>
        Une gousse charnue et bien affinée est riche en graines et en arôme : il
        en faut moins pour parfumer une même quantité de crème ou de pâte. Une
        gousse pauvre oblige à en utiliser davantage, pour un résultat pourtant
        moins net. Le « moins cher » finit souvent par coûter plus.
      </p>

      <h2>La régularité</h2>
      <p>
        En cuisine professionnelle, la reproductibilité est reine : une recette
        calibrée doit rendre le même résultat d'un service à l'autre. Cela
        suppose une vanille de qualité constante, lot après lot — exactement ce
        que garantit notre
        <a href="/confiance/qualite">démarche de sélection</a>.
      </p>

      ${conseil(
        "Raisonnez en coût par préparation, pas en prix par gousse. Une belle vanille, " +
          "utilisée en plus petite quantité et sans ratés, revient souvent moins cher au dessert " +
          "fini — tout en se remarquant à la dégustation."
      )}

      <h2>Le coût réel à l'usage</h2>
      <ul>
        <li>✔ Meilleur rendement → moins de gousses par préparation</li>
        <li>✔ Qualité constante → moins de pertes et de ratés</li>
        <li>✔ Arôme net → un résultat qui se remarque à la première bouchée</li>
      </ul>

      <h2>Un choix de cohérence</h2>
      <p>
        Choisir une vanille premium, ce n'est pas payer pour le prestige : c'est
        raisonner en résultat final. C'est aussi ce qui permet de
        <a href="/blog/comment-utiliser-gousse-vanille">tirer le meilleur de
        chaque gousse</a>, jusqu'à la dernière infusion.
      </p>

      <p>
        La Maison Vanille'Or accompagne artisans, restaurateurs et pâtissiers
        avec une sélection pensée pour l'exigence professionnelle. Pour des
        besoins récurrents ou des volumes, découvrez notre
        <a href="/b2b">offre professionnelle</a> ; pour commencer, parcourez la
        <a href="/collections/vanille">collection de vanilles</a> ou notre
        <a href="/products">catalogue complet</a>.
      </p>

      <blockquote>
        « Un chef ne compte pas le prix d'une gousse, mais ce qu'elle apporte à
        l'assiette. »
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
