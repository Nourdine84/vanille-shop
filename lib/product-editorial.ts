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

/* =========================================================================
   ÉPICES — définies en constantes plutôt qu'en littéraux inline afin de
   pouvoir référencer un même contenu sous plusieurs slugs (aliasing).
   Certains slugs en base portent un format ou une faute de frappe
   (« canelle-10g », « huile-de-girofle-15ml »). On indexe le contenu sur le
   slug actuel ET sur le slug propre, pour que la fiche reste alimentée si le
   slug est corrigé ultérieurement — sans réécrire ce fichier.

   `origin` est renseigné à "Madagascar" pour l'ensemble des produits :
   information métier confirmée par l'équipe Vanille'Or.
========================================================================= */

const CANNELLE: ProductEditorial = {
  title: "Cannelle",
  hook: "Chaleureuse et enveloppante, une cannelle choisie pour son équilibre : elle parfume sans jamais dominer.",
  origin: "Madagascar",
  aromaticProfile:
    "Des arômes doux, épicés et légèrement sucrés, portés par une chaleur boisée. Son intensité reste mesurée : elle apporte de la profondeur à une préparation sans écraser les autres saveurs. En bâton, elle libère lentement ses arômes à l'infusion ; moulue, elle se diffuse immédiatement et demande une main plus légère.",
  uses: [
    "pâtisserie",
    "compotes et fruits cuits",
    "boissons chaudes",
    "chocolat chaud",
    "infusions",
    "plats mijotés et tajines",
    "marinades",
    "vins et punchs chauds",
    "riz au lait et desserts lactés",
  ],
  conservation:
    "À conserver dans un contenant hermétique, à température ambiante, à l'abri de la lumière, de la chaleur et de l'humidité. Les bâtons conservent leurs arômes plus longtemps que la cannelle moulue, qui s'évente plus vite une fois le contenant ouvert.",
  trust:
    "Nous retenons la cannelle pour la finesse de son parfum et la régularité de son intensité d'un lot à l'autre. Chaque lot est contrôlé avant mise en vente, et nous privilégions un produit expédié rapidement plutôt qu'un stock dormant : une épice se juge à la vivacité de ses arômes.",
  faq: [
    {
      question: "Bâton ou cannelle moulue : que choisir ?",
      answer:
        "Le bâton convient aux préparations longues et liquides, où il infuse lentement : boissons chaudes, compotes, plats mijotés. La cannelle moulue s'incorpore directement aux pâtes, biscuits et crèmes, et libère ses arômes immédiatement.",
    },
    {
      question: "Quelle quantité utiliser ?",
      answer:
        "Commencez petit. Une demi-cuillère à café de cannelle moulue suffit généralement pour une pâte à gâteau familiale, et un bâton pour un litre de liquide. La cannelle monte vite en puissance : il est plus simple d'en ajouter que d'en retirer.",
    },
    {
      question: "Peut-on réutiliser un bâton de cannelle ?",
      answer:
        "Oui, une seconde fois si le bâton a infusé dans un liquide, à condition de le rincer, de le sécher complètement et de le conserver au sec. Il aura toutefois perdu une partie de ses arômes.",
    },
    {
      question: "Faut-il retirer le bâton avant de servir ?",
      answer:
        "Oui, dans la plupart des préparations. Le bâton n'est pas destiné à être consommé : il sert à parfumer, puis se retire en fin de cuisson ou d'infusion.",
    },
    {
      question: "La cannelle convient-elle aux plats salés ?",
      answer:
        "Tout à fait. Elle est traditionnellement utilisée dans les tajines, les plats mijotés, les currys et certaines marinades, où elle apporte une chaleur ronde qui équilibre l'acidité et le gras.",
    },
    {
      question: "Comment la conserver ?",
      answer:
        "Dans un contenant hermétique, à température ambiante, à l'abri de la lumière et de l'humidité. Évitez de la stocker au-dessus d'une plaque de cuisson : la chaleur accélère la perte d'arômes.",
    },
    {
      question: "Combien de temps se conserve-t-elle ?",
      answer:
        "Conservée dans de bonnes conditions, la cannelle ne devient pas impropre à la consommation, mais elle perd progressivement son intensité. Les bâtons tiennent nettement plus longtemps que la poudre. Fiez-vous à son parfum : s'il ne se dégage plus à l'ouverture, l'épice a fait son temps.",
    },
    {
      question: "Peut-on la congeler ?",
      answer:
        "Ce n'est pas recommandé. Le froid n'apporte rien à une épice sèche, et les variations de température favorisent la condensation, donc l'humidité — l'ennemi principal de la cannelle.",
    },
    {
      question: "Convient-elle à un usage professionnel ?",
      answer:
        "Oui. La régularité d'intensité entre les lots est précisément l'un de nos critères de sélection, afin qu'une recette calibrée reste reproductible d'une commande à l'autre.",
    },
  ],
};

const CACAO_PUR: ProductEditorial = {
  title: "Cacao Pur",
  hook: "Un cacao pur, sans sucre ajouté, à l'amertume franche et au caractère profond.",
  origin: "Madagascar",
  aromaticProfile:
    "Une amertume nette, portée par des notes torréfiées, boisées et une légère acidité fruitée. Sans sucre pour l'adoucir, sa puissance se révèle telle quelle : c'est un ingrédient de construction, qui donne de la profondeur et de la longueur plutôt que de la gourmandise immédiate.",
  uses: [
    "pâtisserie",
    "chocolaterie",
    "ganaches",
    "mousses et crèmes",
    "glaces",
    "biscuits et sablés",
    "boissons chaudes",
    "enrobages et finitions",
    "sauces salées et viandes mijotées",
  ],
  conservation:
    "À conserver dans un contenant hermétique, à température ambiante, à l'abri de la lumière, de l'humidité et des odeurs fortes — le cacao les capte facilement. Prélevez avec une cuillère sèche pour éviter tout apport d'humidité.",
  trust:
    "Nous sélectionnons un cacao pur, sans sucre ni additif, pour laisser le contrôle au cuisinier. Chaque lot est contrôlé avant mise en vente, et nous refusons ceux dont le profil manque de netteté : dans une préparation, un cacao médiocre ne se rattrape pas.",
  faq: [
    {
      question: "Quelle différence avec un chocolat en poudre du commerce ?",
      answer:
        "Un chocolat en poudre pour petit-déjeuner est très majoritairement composé de sucre. Ce cacao est pur : aucun sucre, aucun arôme ajouté. Il est donc nettement plus amer, plus puissant, et vous maîtrisez seul le sucrage.",
    },
    {
      question: "Quelle quantité utiliser ?",
      answer:
        "Comptez environ 10 à 20 g pour 100 g de farine dans une pâte, et 1 à 2 cuillères à café pour une boisson chaude. Sans sucre pour l'équilibrer, il vaut mieux doser progressivement.",
    },
    {
      question: "Pourquoi est-il si amer ?",
      answer:
        "Parce qu'il ne contient rien d'autre que du cacao. L'amertume est la signature du produit brut ; elle s'équilibre par le sucre, le gras ou le lait de votre préparation.",
    },
    {
      question: "Faut-il le tamiser ?",
      answer:
        "Oui, systématiquement pour les pâtes et les crèmes. Le cacao pur a tendance à former de petits grumeaux qui se dissolvent mal une fois la préparation montée.",
    },
    {
      question: "Peut-on l'utiliser en cuisine salée ?",
      answer:
        "Oui, en très petite quantité. Une pointe de cacao dans une sauce, un plat de viande mijoté ou un jus de cuisson apporte de la profondeur et de la longueur, sans que le goût de chocolat ne domine.",
    },
    {
      question: "Se dissout-il dans un liquide froid ?",
      answer:
        "Mal. Le cacao pur se disperse bien mieux dans un liquide chaud, ou délayé au préalable en pâte lisse avec un peu de liquide avant d'être incorporé au reste.",
    },
    {
      question: "Comment le conserver ?",
      answer:
        "Dans un contenant hermétique, à température ambiante, à l'abri de la lumière et de l'humidité. Tenez-le éloigné des épices puissantes et de tout produit odorant : le cacao absorbe les odeurs.",
    },
    {
      question: "Peut-on le congeler ?",
      answer:
        "Ce n'est pas conseillé. Une poudre sèche n'y gagne rien, et la condensation au moment de la sortie du froid risque de la faire s'agglomérer.",
    },
    {
      question: "Convient-il aux professionnels ?",
      answer:
        "Oui. L'absence de sucre et d'additif en fait une base de travail prévisible pour la chocolaterie, la pâtisserie et la glacerie, où le dosage doit rester maîtrisé.",
    },
  ],
};

const POIVRE_SAUVAGE: ProductEditorial = {
  title: "Poivre Sauvage (Voatsiperifery)",
  hook: "Récolté à l'état sauvage, un poivre au caractère singulier, boisé et long en bouche.",
  origin: "Madagascar",
  aromaticProfile:
    "Moins standardisé que les poivres cultivés, le voatsiperifery développe des notes boisées, fraîches et légèrement résineuses, avec une pointe florale. Sa force piquante reste mesurée ; c'est sa longueur en bouche et sa complexité qui le distinguent, davantage que sa puissance brute.",
  uses: [
    "viandes rouges et grillades",
    "volailles",
    "poissons",
    "sauces",
    "légumes rôtis",
    "foie gras",
    "fromages",
    "desserts au chocolat",
    "fruits rouges et ananas",
  ],
  conservation:
    "À conserver en grains, dans un contenant hermétique, à température ambiante et à l'abri de la lumière. Ne moulez qu'au moment de servir : un poivre moulu à l'avance perd l'essentiel de ses arômes volatils en quelques jours.",
  trust:
    "Ce poivre est issu d'une récolte sauvage, ce qui implique une variabilité naturelle de calibre et d'aspect que nous assumons plutôt que de la gommer. Nous sélectionnons les lots sur le parfum et la longueur en bouche, et contrôlons chaque lot avant mise en vente.",
  faq: [
    {
      question: "Quelle différence avec un poivre noir classique ?",
      answer:
        "Le poivre noir est cultivé et calibré. Le voatsiperifery est récolté à l'état sauvage sur des lianes : ses grains sont plus petits, irréguliers, souvent munis d'une petite queue. Il pique moins franchement mais offre une palette aromatique plus complexe et une longueur en bouche supérieure.",
    },
    {
      question: "Quand faut-il le poivrer ?",
      answer:
        "En fin de cuisson, ou directement à l'assiette. Une cuisson prolongée détruit ses arômes les plus fins et ne laisse subsister que le piquant — c'est-à-dire précisément ce qui fait le moins son intérêt.",
    },
    {
      question: "Faut-il le moudre ou l'écraser ?",
      answer:
        "Les deux fonctionnent. Le moulin donne une mouture régulière ; l'écrasement au mortier libère des morceaux plus grossiers, qui offrent des éclats de saveur au moment de la dégustation. Dans les deux cas, au dernier moment.",
    },
    {
      question: "Pourquoi les grains sont-ils irréguliers ?",
      answer:
        "C'est la conséquence directe de la récolte sauvage : aucun tri industriel ne vient uniformiser les calibres. Cette irrégularité est caractéristique du produit, non un défaut.",
    },
    {
      question: "Peut-on l'utiliser en dessert ?",
      answer:
        "Oui, et c'est l'un de ses usages les plus intéressants. Ses notes boisées et florales s'accordent avec le chocolat noir, les fruits rouges, l'ananas ou une crème vanillée — en quantité très mesurée.",
    },
    {
      question: "Quelle quantité utiliser ?",
      answer:
        "Un ou deux tours de moulin par assiette suffisent. Sa longueur en bouche fait qu'une petite quantité s'exprime longtemps ; le surdoser masque la complexité qu'on recherche.",
    },
    {
      question: "Comment le conserver ?",
      answer:
        "En grains entiers, dans un contenant hermétique, à température ambiante et à l'abri de la lumière. Ne le stockez pas moulu : c'est le meilleur moyen d'en perdre l'intérêt.",
    },
    {
      question: "Peut-on le congeler ?",
      answer:
        "Ce n'est ni utile ni recommandé. Un grain sec se conserve très bien à température ambiante, et le passage au froid favorise la condensation.",
    },
    {
      question: "Pourquoi est-il plus onéreux qu'un poivre courant ?",
      answer:
        "Parce qu'il n'est pas cultivé. La récolte se fait à la main sur des lianes en forêt, avec des rendements faibles et une saisonnalité contraignante. Le prix reflète cette réalité.",
    },
    {
      question: "Convient-il à un usage professionnel ?",
      answer:
        "Oui, en poivre de finition. Sa signature aromatique en fait un produit de dressage plutôt qu'un poivre de cuisson à intégrer en grande quantité.",
    },
  ],
};

const POIVRE_VERT: ProductEditorial = {
  title: "Poivre Vert",
  hook: "Le même fruit que le poivre noir, cueilli avant maturité : plus vif, plus végétal, moins piquant.",
  origin: "Madagascar",
  aromaticProfile:
    "Récolté jeune, le poivre vert conserve une fraîcheur végétale et herbacée que la maturation fait disparaître. Son piquant est nettement plus discret que celui du poivre noir, laissant place à des notes vives, presque acidulées, qui réveillent une sauce sans l'alourdir.",
  uses: [
    "sauces à la crème",
    "volailles",
    "poissons",
    "viandes blanches",
    "steak au poivre",
    "terrines et pâtés",
    "marinades",
    "légumes vapeur",
    "beurres composés",
  ],
  conservation:
    "Conservez-le dans un contenant hermétique, à l'abri de la lumière et de l'humidité. Selon la présentation, les conditions diffèrent : les grains séchés se gardent à température ambiante, tandis qu'un poivre vert en saumure se conserve au réfrigérateur une fois le bocal ouvert. Référez-vous à l'étiquette du produit reçu.",
  trust:
    "Nous sélectionnons le poivre vert pour la netteté de sa note végétale, qui doit rester franche et non éventée. Chaque lot est contrôlé avant mise en vente, et nous privilégions une rotation rapide des stocks : la fraîcheur est ici l'essentiel du produit.",
  faq: [
    {
      question: "Quelle différence avec le poivre noir ?",
      answer:
        "C'est la même baie, récoltée à un stade différent. Cueilli avant maturité, le poivre vert n'a pas subi la fermentation ni le séchage qui donnent au poivre noir sa puissance. Résultat : moins de piquant, plus de fraîcheur végétale.",
    },
    {
      question: "Est-il vraiment moins fort ?",
      answer:
        "Oui, sensiblement. Son piquant est plus discret, ce qui permet d'en utiliser davantage sans dominer le plat — c'est précisément ce qui en fait un bon compagnon des sauces crémeuses.",
    },
    {
      question: "Comment l'utiliser dans une sauce ?",
      answer:
        "Écrasez légèrement les grains pour libérer les arômes, puis incorporez-les à la crème ou au jus de cuisson en fin de préparation. Une cuisson trop longue atténue sa fraîcheur.",
    },
    {
      question: "Faut-il le moudre ?",
      answer:
        "Rarement. Le poivre vert s'utilise le plus souvent en grains entiers ou simplement écrasés, pour conserver les éclats de saveur en bouche.",
    },
    {
      question: "Quelle quantité utiliser ?",
      answer:
        "Une cuillère à café de grains pour une sauce destinée à deux personnes constitue un bon point de départ. Son piquant modéré autorise une main plus généreuse qu'avec le poivre noir.",
    },
    {
      question: "Avec quoi l'associer ?",
      answer:
        "Il s'accorde particulièrement avec la crème, le beurre, les volailles, les poissons à chair blanche et les terrines. Il équilibre le gras sans le masquer.",
    },
    {
      question: "Comment le conserver ?",
      answer:
        "Les grains séchés se gardent dans un contenant hermétique, à température ambiante et à l'abri de la lumière. En saumure, le produit se conserve au réfrigérateur après ouverture. Suivez l'indication portée sur l'emballage.",
    },
    {
      question: "Peut-on le congeler ?",
      answer:
        "Pour des grains séchés, ce n'est pas utile. Un poivre vert frais ou en saumure supporte en revanche la congélation, avec une perte de tenue à la décongélation.",
    },
    {
      question: "Convient-il aux professionnels ?",
      answer:
        "Oui. C'est un classique des sauces de restaurant, apprécié pour sa régularité et pour la lisibilité de sa note végétale dans une préparation riche.",
    },
  ],
};

const CLOUS_DE_GIROFLE: ProductEditorial = {
  title: "Clous de Girofle",
  hook: "Une épice de caractère, chaude et pénétrante, à manier avec retenue.",
  origin: "Madagascar",
  aromaticProfile:
    "Un parfum puissant, chaud et légèrement camphré, dû à l'eugénol qu'il contient naturellement en forte proportion. Le clou de girofle ne se dose pas comme une épice d'appoint : quelques unités suffisent à marquer durablement un plat entier, avec une persistance importante en bouche.",
  uses: [
    "plats mijotés",
    "bouillons et pot-au-feu",
    "vin chaud",
    "pain d'épices",
    "compotes de fruits",
    "marinades",
    "riz et currys",
    "oignon piqué",
    "chutneys",
  ],
  conservation:
    "À conserver entiers, dans un contenant hermétique, à température ambiante et à l'abri de la lumière et de l'humidité. Entiers, les clous gardent leur puissance très longtemps ; moulus, ils s'éventent rapidement. Ne moudre qu'au moment de l'usage.",
  trust:
    "Nous retenons des clous entiers, réguliers et bien formés, dont la tête n'est pas brisée — signe d'une manipulation soignée. Chaque lot est contrôlé avant mise en vente : sur une épice aussi puissante, la qualité du lot détermine directement l'équilibre du plat.",
  faq: [
    {
      question: "Quelle quantité utiliser ?",
      answer:
        "Très peu. Deux à quatre clous suffisent pour un plat mijoté familial, et un seul peut suffire dans une préparation délicate. Le girofle est l'une des épices où l'excès est le plus difficile à rattraper.",
    },
    {
      question: "Faut-il les retirer avant de servir ?",
      answer:
        "Oui, dans la plupart des cas. Croquer un clou entier libère une amertume et un effet légèrement anesthésiant en bouche, désagréables en dégustation. Piquez-les dans un oignon ou un bouquet garni pour les retrouver facilement.",
    },
    {
      question: "Pourquoi cette épice est-elle si puissante ?",
      answer:
        "Le clou de girofle est naturellement très riche en eugénol, le composé aromatique responsable de son odeur chaude et camphrée. Cette concentration explique à la fois sa force et sa persistance.",
    },
    {
      question: "Clous entiers ou girofle moulu ?",
      answer:
        "Privilégiez les clous entiers. Ils se conservent bien plus longtemps et vous permettent de les retirer après cuisson. La poudre s'incorpore mieux aux pâtes et biscuits, mais s'évente vite et ne se rattrape pas.",
    },
    {
      question: "Peut-on les moudre soi-même ?",
      answer:
        "Oui, au mortier ou dans un moulin à épices, juste avant usage. Une tête de clou moulue très finement s'incorpore bien à un pain d'épices ou à une pâte à biscuits.",
    },
    {
      question: "Peut-on les utiliser en pâtisserie ?",
      answer:
        "Oui, avec parcimonie. Le pain d'épices, les compotes de pommes, les poires pochées et certains biscuits d'hiver en tirent une chaleur caractéristique — à condition de rester en dessous du seuil où le girofle devient envahissant.",
    },
    {
      question: "Combien de temps se conservent-ils ?",
      answer:
        "Entiers et bien conservés, les clous gardent leur puissance très longtemps. Fiez-vous à l'odeur à l'ouverture : elle doit être immédiate et franche. Une fois moulus, comptez quelques mois seulement.",
    },
    {
      question: "Peut-on les congeler ?",
      answer:
        "Ce n'est ni nécessaire ni recommandé. Une épice sèche n'y gagne rien, et la condensation à la sortie du froid introduit de l'humidité.",
    },
    {
      question: "Conviennent-ils à un usage professionnel ?",
      answer:
        "Oui, notamment pour les fonds, bouillons et préparations mijotées. La régularité de forme facilite le dosage et le retrait avant service.",
    },
  ],
};

const HUILE_DE_GIROFLE: ProductEditorial = {
  title: "Huile de Girofle",
  hook: "Une essence concentrée, à manier avec précision : quelques gouttes suffisent.",
  origin: "Madagascar",
  aromaticProfile:
    "Extrêmement concentrée, l'huile de girofle porte les notes chaudes, épicées et camphrées du clou, mais démultipliées. Là où l'on compte les clous, on compte ici les gouttes. C'est un produit de précision, réservé à ceux qui maîtrisent le dosage et cherchent à marquer un profil aromatique d'une empreinte nette.",
  uses: [
    "préparations aromatiques très diluées",
    "pâtisserie d'assemblage",
    "chocolaterie",
    "sirops et infusions",
    "marinades",
    "usage professionnel encadré",
  ],
  conservation:
    "À conserver dans son flacon d'origine soigneusement refermé, à température ambiante, à l'abri de la lumière et de la chaleur. Tenir hors de portée des enfants. Conservez le flacon debout et évitez les écarts de température, qui favorisent l'oxydation.",
  trust:
    "Nous traitons ce produit pour ce qu'il est : une essence concentrée, et non une épice d'appoint. Nous ne lui prêtons aucune vertu autre qu'aromatique, et nous invitons à respecter scrupuleusement les mentions d'usage portées sur l'étiquette du produit reçu.",
  faq: [
    {
      question: "Quelle quantité utiliser ?",
      answer:
        "Une goutte, voire moins. L'huile de girofle est bien plus concentrée que le clou entier. Diluez-la toujours au préalable dans un corps gras, un sirop ou un alcool, jamais directement dans la préparation finale.",
    },
    {
      question: "Peut-on la consommer pure ?",
      answer:
        "Non. Elle ne doit jamais être ingérée pure ni appliquée pure. Elle s'emploie exclusivement très diluée, et uniquement si l'étiquette du produit reçu en mentionne l'usage alimentaire.",
    },
    {
      question: "Quelle différence avec les clous de girofle ?",
      answer:
        "Le clou est l'épice entière, dosable à l'unité. L'huile en est une extraction concentrée : même famille aromatique, tout autre rapport de force. Elles ne se substituent pas l'une à l'autre à quantité égale.",
    },
    {
      question: "L'huile de girofle a-t-elle des vertus médicinales ?",
      answer:
        "Nous ne formulons aucune allégation de santé, thérapeutique ou médicale concernant ce produit. Nous le proposons pour son intérêt aromatique. Pour toute question relevant de la santé, adressez-vous à un professionnel de santé.",
    },
    {
      question: "Y a-t-il des précautions particulières ?",
      answer:
        "Oui. Tenez le flacon hors de portée des enfants, évitez le contact avec les yeux et les muqueuses, et respectez les mentions figurant sur l'étiquette. En cas de grossesse, d'allaitement, de traitement en cours ou de doute, demandez l'avis d'un professionnel de santé avant tout usage.",
    },
    {
      question: "Comment la diluer correctement ?",
      answer:
        "Incorporez la goutte dans un support gras ou sucré — beurre fondu, sirop, alcool, masse de chocolat — puis mélangez soigneusement avant d'intégrer ce mélange à votre préparation. Une goutte versée directement ne se répartira pas.",
    },
    {
      question: "Comment la conserver ?",
      answer:
        "Flacon bien refermé, debout, à température ambiante, à l'abri de la lumière et de la chaleur. La lumière et l'air sont les deux facteurs qui altèrent le plus rapidement une essence concentrée.",
    },
    {
      question: "Combien de temps se conserve-t-elle ?",
      answer:
        "Bien conservée, elle se garde longtemps, mais son profil évolue avec l'oxydation. Référez-vous à la date indiquée sur le flacon reçu, et jugez à l'odeur : une essence oxydée perd sa netteté.",
    },
    {
      question: "Peut-on la congeler ?",
      answer:
        "Non, cela n'apporte rien et n'est pas recommandé. Une conservation à température ambiante, à l'abri de la lumière, est la solution adaptée.",
    },
    {
      question: "Convient-elle à un usage professionnel ?",
      answer:
        "Oui, dans un cadre maîtrisé, où le dosage est pesé et la dilution contrôlée. C'est un produit d'assemblage et de finition aromatique, pas un ingrédient de volume.",
    },
  ],
};

/* =========================================================================
   VANILLE GIVRÉE — produit non encore créé en base.
   L'entrée reste inerte jusqu'à sa création (getProductEditorial renvoie
   simplement le contenu dès que le slug existera côté produit).
========================================================================= */

const VANILLE_GIVREE: ProductEditorial = {
  title: "Vanille Givrée de Madagascar",
  hook: "Des gousses parées de fins cristaux nés du temps : la signature d'un affinage patient.",
  origin: "Madagascar",
  aromaticProfile:
    "Le givrage est une cristallisation naturelle de la vanilline, qui remonte lentement à la surface de certaines gousses particulièrement bien affinées. Ces gousses développent des notes chaudes, boisées et cacaotées, d'une profondeur marquée. Le voile cristallin ne se provoque pas : il apparaît, ou non, au terme d'un affinage long et bien conduit.",
  uses: [
    "pâtisserie",
    "crèmes et custards",
    "glaces",
    "ganaches et chocolat",
    "infusions",
    "rhums arrangés",
    "sucres parfumés",
    "dressage et dégustation",
  ],
  conservation:
    "À conserver à température ambiante, dans un contenant hermétique, à l'abri de la lumière et de l'humidité. Évitez le réfrigérateur : la condensation dissout les cristaux et abîme la gousse. Le givre peut évoluer, s'accentuer ou s'estomper selon la température et l'hygrométrie — c'est le comportement normal d'un cristal naturel.",
  trust:
    "Nous ne provoquons pas le givrage : nous le constatons. Ces gousses sont mises de côté au moment du tri, lorsqu'un affinage prolongé a laissé les cristaux apparaître d'eux-mêmes. Leur disponibilité dépend donc des lots, et nous préférons ne pas en proposer plutôt que de forcer un produit qui ne s'obtient pas sur commande.",
  faq: [
    {
      question: "Qu'est-ce que le givrage exactement ?",
      answer:
        "C'est une cristallisation naturelle de la vanilline, le principal composé aromatique de la vanille. Sur certaines gousses longuement affinées, elle migre lentement vers la surface et y forme de fins cristaux blancs. Rien n'est ajouté : le givre vient de la gousse elle-même.",
    },
    {
      question: "Ces cristaux blancs sont-ils de la moisissure ?",
      answer:
        "Non. Le givre de vanilline se présente en cristaux secs, fins et brillants, sans odeur particulière autre que celle de la vanille. Une moisissure, elle, est duveteuse ou cotonneuse, souvent grisâtre ou verdâtre, et dégage une odeur de renfermé. En cas de doute sur une gousse reçue, ne la consommez pas et contactez notre service client.",
    },
    {
      question: "Le givrage est-il un signe de qualité ?",
      answer:
        "Il témoigne d'un affinage long et bien conduit, et se rencontre le plus souvent sur des gousses riches en arômes. Ce n'est pas pour autant un critère de qualité exclusif : une excellente gousse peut ne jamais givrer. Nous jugeons toujours une vanille sur son parfum, sa souplesse et son aspect général.",
    },
    {
      question: "Toutes les gousses du lot sont-elles givrées ?",
      answer:
        "Non, et nous ne le promettons pas. Le givrage est un phénomène naturel qui touche certaines gousses, à des degrés variables. L'intensité du voile cristallin diffère d'une gousse à l'autre au sein d'un même lot.",
    },
    {
      question: "Le givre peut-il disparaître ?",
      answer:
        "Oui. La chaleur et l'humidité peuvent dissoudre les cristaux, qui se reforment parfois lorsque les conditions redeviennent favorables. La disparition du givre n'altère pas la qualité aromatique de la gousse : la vanilline est toujours là, simplement plus répartie.",
    },
    {
      question: "Faut-il retirer les cristaux avant utilisation ?",
      answer:
        "Surtout pas. Ces cristaux sont précisément ce que vous recherchez : ils concentrent l'arôme. Utilisez la gousse normalement, cristaux compris.",
    },
    {
      question: "Comment l'utiliser ?",
      answer:
        "Comme une gousse classique : fendez-la dans la longueur, prélevez les graines à la pointe d'un couteau, puis incorporez-les à votre préparation. La gousse vidée continue de parfumer un sucre, un lait ou une infusion.",
    },
    {
      question:
        "Quelle différence avec une Vanille Bourbon classique ?",
      answer:
        "C'est la même vanille de Madagascar, sélectionnée à un stade d'affinage plus avancé. La givrée se distingue par ses cristaux de surface et une profondeur aromatique souvent plus marquée. Elle s'utilise exactement de la même façon.",
    },
    {
      question: "Comment la conserver ?",
      answer:
        "Dans un contenant hermétique, à température ambiante, à l'abri de la lumière et de l'humidité. Refermez soigneusement après chaque usage.",
    },
    {
      question: "Peut-on la mettre au réfrigérateur ou la congeler ?",
      answer:
        "Non, ce n'est pas recommandé. Le froid favorise la condensation, qui dissout les cristaux et peut détremper la gousse. La température ambiante, au sec et à l'obscurité, reste la meilleure conservation.",
    },
    {
      question: "Convient-elle à un usage professionnel ?",
      answer:
        "Oui. Sa concentration aromatique en fait une vanille appréciée en pâtisserie et en glacerie. Sa disponibilité dépend toutefois des lots : nous ne pouvons pas garantir un approvisionnement continu en gousses givrées.",
    },
  ],
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

  // Produit non encore créé en base : l'entrée reste inerte jusque-là.
  "vanille-givree": VANILLE_GIVREE,

  /* ================= ÉPICES =================
     Chaque produit est indexé sur le slug actuellement en base ET sur le
     slug « propre » cible, afin que la fiche reste alimentée si le slug est
     corrigé (cf. audit catalogue). Les deux clés pointent vers le même objet.
  ========================================== */

  "canelle-10g": CANNELLE,
  cannelle: CANNELLE,

  "cacao-pur": CACAO_PUR,

  "poivre-sauvage-noir-voatsiperifery": POIVRE_SAUVAGE,
  "poivre-sauvage": POIVRE_SAUVAGE,

  // Produit non encore créé en base : l'entrée reste inerte jusque-là.
  "poivre-vert": POIVRE_VERT,

  "clous-de-girofle-100g": CLOUS_DE_GIROFLE,
  "clous-de-girofle": CLOUS_DE_GIROFLE,

  "huile-de-girofle-15ml": HUILE_DE_GIROFLE,
  "huile-de-girofle": HUILE_DE_GIROFLE,
};

export function getProductEditorial(
  slug: string
): ProductEditorial | null {
  return PRODUCT_EDITORIAL[slug] ?? null;
}
