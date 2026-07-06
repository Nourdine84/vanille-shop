import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getImageUrl } from "@/lib/image";
import { getMinPriceCents, hasMultiplePriceFormats } from "@/lib/pricing";
import { colors } from "@/lib/design-tokens";
import Reveal from "@/components/Reveal";

export const dynamic = "force-dynamic";

/* =========================
   HELPERS
========================= */

function formatPrice(priceCents: number) {
  return (priceCents / 100)
    .toFixed(2)
    .replace(".", ",") + " €";
}

/* =========================
   PAGE
========================= */

export default async function HomePage() {
  const best = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div style={page}>
      {/* ================= HERO ================= */}

      <section style={hero}>
        <div style={heroOverlay} />

        <div style={heroContent}>
          <p style={heroTag}>
            VANILLE PREMIUM • MADAGASCAR
          </p>

          <h1 style={heroTitle}>
            L’excellence des épices <br />
            directement de Madagascar
          </h1>

          <p style={heroSubtitle}>
            Vanille gourmet, cacao, poivre sauvage et
            créations premium sélectionnées avec exigence
            pour particuliers et professionnels.
          </p>

          <div style={heroActions}>
            <Link href="/products" style={btnPrimary}>
              Découvrir nos produits d’exception
            </Link>
          </div>

          <Link href="/b2b" style={heroSecondaryLink}>
            Vous êtes un professionnel ? →
          </Link>
        </div>
      </section>

      {/* ================= PROMESSE ================= */}

      <section style={sectionAlt}>
        <Reveal>
        <div style={sectionIntro}>
          <p style={sectionEyebrow}>
            NOTRE PROMESSE
          </p>

          <h2 style={sectionIntroTitle}>
            Une sélection exigeante, du terroir malgache jusqu’à votre cuisine.
          </h2>

          <p style={sectionIntroText}>
            Nous sélectionnons des vanilles et des épices reconnues pour
            leur qualité, leur richesse aromatique et leur authenticité.
          </p>

          <p style={sectionIntroText}>
            Chaque lot est choisi avec soin afin d’offrir une expérience
            fidèle à ce que Madagascar produit de meilleur, sans compromis
            sur la régularité ni sur la traçabilité.
          </p>

          <p style={sectionIntroText}>
            Notre engagement est simple : proposer des produits que nous
            serions fiers d’utiliser et d’offrir.
          </p>
        </div>

        <div style={pillarGrid}>
          <div style={pillarCard}>
            <div style={pillarIcon}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#a16207" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6" />
              </svg>
            </div>
            <h3 style={pillarTitle}>Origine maîtrisée</h3>
            <p style={pillarText}>
              Une sélection directement issue des terroirs de Madagascar.
            </p>
          </div>

          <div style={pillarCard}>
            <div style={pillarIcon}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#a16207" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="8" r="6" />
                <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
              </svg>
            </div>
            <h3 style={pillarTitle}>Qualité constante</h3>
            <p style={pillarText}>
              Des critères de sélection exigeants pour garantir une
              expérience régulière.
            </p>
          </div>

          <div style={pillarCard}>
            <div style={pillarIcon}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#a16207" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h3 style={pillarTitle}>Transparence</h3>
            <p style={pillarText}>
              Une origine claire, des conseils utiles et une information
              honnête.
            </p>
          </div>

          <div style={pillarCard}>
            <div style={pillarIcon}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#a16207" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
                <line x1="6" x2="18" y1="17" y2="17" />
              </svg>
            </div>
            <h3 style={pillarTitle}>Pour tous les passionnés</h3>
            <p style={pillarText}>
              Du cuisinier amateur au professionnel, chacun trouve le
              format adapté à ses besoins.
            </p>
          </div>
        </div>

        <div style={sectionCtaBox}>
          <Link href="/products" style={btnSecondary}>
            Découvrir notre sélection
          </Link>
        </div>
        </Reveal>
      </section>

      {/* ================= DIFFÉRENCE ================= */}
      {/* Placée juste après "Notre Promesse" (plutôt que juste avant Collections) : les deux blocs
          forment un même mouvement "pourquoi nous faire confiance / en quoi sommes-nous différents"
          avant de passer à l'histoire puis aux produits. Évite aussi un doublon de CTA vers /products
          juste à côté du bloc Packs, qui pointe déjà vers /products. */}

      <section style={sectionAlt}>
        <Reveal>
        <div style={sectionIntro}>
          <p style={sectionEyebrow}>
            NOTRE DIFFÉRENCE
          </p>

          <h2 style={sectionIntroTitle}>
            Une Maison de sélection, pas un simple e-commerce.
          </h2>

          <p style={sectionIntroText}>
            Vanille’Or ne cherche pas à proposer le plus grand catalogue.
            Nous sélectionnons moins, mais mieux : des produits cohérents,
            traçables et capables de porter l’exigence de la Maison.
          </p>

          <p style={sectionIntroText}>
            Chaque référence doit avoir une origine claire, une utilité
            réelle et une place légitime dans notre collection.
          </p>
        </div>

        <div style={diffList}>
          <div style={diffItem}>
            <span style={diffNumber}>1</span>
            <div>
              <h3 style={diffItemTitle}>Sélection courte</h3>
              <p style={diffItemText}>
                Nous privilégions une gamme lisible plutôt qu’un
                catalogue surchargé.
              </p>
            </div>
          </div>

          <div style={diffItem}>
            <span style={diffNumber}>2</span>
            <div>
              <h3 style={diffItemTitle}>Origine assumée</h3>
              <p style={diffItemText}>
                Madagascar reste au cœur de notre exigence et de notre
                identité.
              </p>
            </div>
          </div>

          <div style={diffItem}>
            <span style={diffNumber}>3</span>
            <div>
              <h3 style={diffItemTitle}>Qualité visible</h3>
              <p style={diffItemText}>
                Textures, parfums, souplesse, brillance : la qualité doit
                se voir avant même l’achat.
              </p>
            </div>
          </div>

          <div style={diffItem}>
            <span style={diffNumber}>4</span>
            <div>
              <h3 style={diffItemTitle}>Expérience soignée</h3>
              <p style={diffItemText}>
                Du site au colis, chaque détail doit renforcer la
                confiance.
              </p>
            </div>
          </div>
        </div>

        <div style={sectionCtaBox}>
          <Link href="/products" style={btnSecondary}>
            Explorer les produits
          </Link>
        </div>
        </Reveal>
      </section>

      {/* ================= STORY ================= */}
      {/* NOTE: contenu voué à être retravaillé/fusionné une fois le bloc "Notre Histoire" finalisé côté contenu */}

      <section style={section}>
        <Reveal>
        <div style={storyContainer}>
          <div style={storyTextBox}>
            <p style={sectionEyebrow}>
              L’HISTOIRE VANILLE’OR
            </p>

            <h2 style={sectionTitleLeft}>
              Un héritage rare et précieux
            </h2>

            <p style={storyText}>
              Vanille’Or est née d’un lien familial fort avec
              Madagascar : des gousses récoltées et affinées selon
              un savoir-faire artisanal transmis depuis des
              générations, pour une intensité aromatique
              exceptionnelle.
            </p>

            <p style={storyText}>
              Inspirée par l’héritage de Raymond Albius, figure
              emblématique de la pollinisation de la vanille,
              Vanille’Or valorise l’authenticité et la passion du
              produit.
            </p>
          </div>

          <div style={storyImageBox}>
            <img
              src="/images/vanille-250.jpg"
              alt="Gousses de vanille de Madagascar"
              style={storyImage}
            />
          </div>
        </div>
        </Reveal>
      </section>

      {/* ================= MADAGASCAR ================= */}
      {/* Placée ici (après Notre Histoire, avant Best Sellers) plutôt qu'immédiatement après
          "Notre Différence" comme le laissait supposer l'architecture cible initiale : trois blocs
          de texte s'enchaînaient déjà (Promesse, Différence, Histoire) sans réelle respiration.
          Ce grand visuel sert de rupture de rythme avant les sections produits. Visuel temporaire
          en attendant le média définitif. */}

      <section style={madagascarSection}>
        <div style={madagascarOverlay} />

        <Reveal>
        <div style={madagascarContent}>
          <p style={sectionEyebrowLight}>
            MADAGASCAR
          </p>

          <h2 style={packTitle}>
            L’origine qui révèle chaque arôme.
          </h2>

          <p style={madagascarText}>
            À Madagascar, la culture de la vanille repose sur un
            savoir-faire transmis depuis des générations.
          </p>

          <p style={madagascarText}>
            Chaque fleur est pollinisée à la main, chaque récolte demande
            patience et précision, chaque étape influence la richesse
            aromatique du produit final.
          </p>

          <p style={madagascarText}>
            Notre rôle est de sélectionner ces produits avec la même
            exigence que ceux qui les cultivent.
          </p>

          <p style={madagascarQuote}>
            « Le temps est le premier ingrédient de la qualité. »
          </p>

          <Link href="/maison/notre-histoire" style={btnSecondaryLight}>
            Découvrir notre histoire
          </Link>
        </div>
        </Reveal>
      </section>

      {/* ================= BEST SELLERS ================= */}

      <section style={sectionAlt}>
        <Reveal>
        <div style={sectionHeader}>
          <div>
            <p style={sectionEyebrow}>
              NOS PRODUITS
            </p>

            <h2 style={sectionTitleLeft}>
              Best Sellers
            </h2>
          </div>

          <Link href="/products" style={sectionLink}>
            Voir tout →
          </Link>
        </div>

        {best.length === 0 && (
          <div style={center}>
            Aucun produit disponible
          </div>
        )}

        <div style={productGrid}>
          {best.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.slug}`}
              style={card}
            >
              <div style={badge}>
                {p.badge || "Premium"}
              </div>

              <img
                src={getImageUrl(p.imageUrl)}
                alt={p.name}
                style={img}
              />

              <div style={cardContent}>
                <p style={cardCategory}>
                  {p.category || "Vanille’Or"}
                </p>

                <h3 style={cardTitle}>
                  {p.name}
                </h3>

                <p style={price}>
                  {hasMultiplePriceFormats(p) && "À partir de "}
                  {formatPrice(getMinPriceCents(p))}
                </p>
              </div>
            </Link>
          ))}
        </div>
        </Reveal>
      </section>

      {/* ================= PACKS ================= */}

      <section style={section}>
        <Reveal>
        <div style={packContainer}>
          <div style={packCardLarge}>
            <div style={packOverlay} />

            <div style={packContent}>
              <p style={sectionEyebrowLight}>
                COLLECTIONS
              </p>

              <h2 style={packTitle}>
                Découvrez nos packs premium
              </h2>

              <p style={packText}>
                Packs découverte, professionnels,
                pâtisserie ou cadeaux premium :
                une sélection pensée pour chaque usage.
              </p>

              <Link
                href="/products"
                style={btnPrimary}
              >
                Explorer les packs
              </Link>
            </div>
          </div>
        </div>
        </Reveal>
      </section>

      {/* ================= COLLECTIONS ================= */}

      <section style={sectionAlt}>
        <Reveal>
        <div style={sectionHeader}>
          <div>
            <p style={sectionEyebrow}>
              EXPLORER
            </p>

            <h2 style={sectionTitleLeft}>
              Nos collections
            </h2>
          </div>
        </div>

        <div style={collectionsGrid}>
          <Link
            href="/collections/vanille"
            style={collection}
          >
            <img
              src="/images/vanille.jpg"
              alt="Vanille"
              style={imgFull}
            />

            <div style={overlay} />

            <div style={collectionContent}>
              <p style={collectionTag}>
                Collection
              </p>

              <h3 style={collectionTitle}>
                Vanille
              </h3>
            </div>
          </Link>

          <Link
            href="/collections/epices"
            style={collection}
          >
            <img
              src="/images/epices.jpg"
              alt="Épices"
              style={imgFull}
            />

            <div style={overlay} />

            <div style={collectionContent}>
              <p style={collectionTag}>
                Collection
              </p>

              <h3 style={collectionTitle}>
                Épices
              </h3>
            </div>
          </Link>
        </div>
        </Reveal>
      </section>

      {/* ================= B2B ================= */}

      <section style={b2b}>
        <Reveal>
        <div style={b2bContent}>
          <p style={sectionEyebrow}>
            PROFESSIONNELS
          </p>

          <h2 style={b2bTitle}>
            Approvisionnement gros volume
          </h2>

          <p style={b2bText}>
            Restaurants, pâtisseries, laboratoires,
            revendeurs ou distributeurs :
            nous proposons des solutions adaptées aux
            besoins professionnels.
          </p>

          <div style={trustGrid}>
            <div style={trustItem}>
              ✔ Qualité premium
            </div>

            <div style={trustItem}>
              ✔ Fournisseur direct Madagascar
            </div>

            <div style={trustItem}>
              ✔ Volume disponible
            </div>

            <div style={trustItem}>
              ✔ Expédition Europe
            </div>
          </div>

          <Link href="/b2b" style={btnPrimaryLarge}>
            Faire une demande pro
          </Link>
        </div>
        </Reveal>
      </section>

      {/* ================= CONFIANCE ================= */}
      {/* Volontairement sans pictogramme (aucune icône livraison/CB/camion) : la séparation entre
          les 3 engagements se fait par un simple filet doré, pas une icône, pour garder la
          sensation de calme demandée. Enchaîne juste après le B2B (fond sombre) pour un contraste
          apaisant avant la section CTA finale. */}

      <section style={sectionAlt}>
        <Reveal>
        <div style={sectionIntro}>
          <p style={sectionEyebrow}>
            NOTRE ENGAGEMENT
          </p>

          <h2 style={sectionIntroTitle}>
            La confiance se construit dans les détails.
          </h2>

          <p style={sectionIntroText}>
            Nous pensons qu’une relation durable commence par la
            transparence.
          </p>

          <p style={sectionIntroText}>
            Nous privilégions une sélection exigeante, des informations
            claires et un accompagnement attentif avant comme après votre
            commande.
          </p>

          <p style={sectionIntroText}>
            Nos engagements sont simples : présenter honnêtement nos
            produits, respecter leur origine et vous permettre d’acheter
            en toute confiance.
          </p>
        </div>

        <div style={trustList}>
          <div style={trustColumn}>
            <div style={trustColumnRule} />
            <h3 style={trustColumnTitle}>Sélection rigoureuse</h3>
            <p style={trustColumnText}>
              Chaque lot est contrôlé avant sa mise en vente.
            </p>
          </div>

          <div style={trustColumn}>
            <div style={trustColumnRule} />
            <h3 style={trustColumnTitle}>Traçabilité</h3>
            <p style={trustColumnText}>
              Nous mettons en avant l’origine de nos produits et leur
              parcours.
            </p>
          </div>

          <div style={trustColumn}>
            <div style={trustColumnRule} />
            <h3 style={trustColumnTitle}>Accompagnement</h3>
            <p style={trustColumnText}>
              Conseils de conservation, d’utilisation et disponibilité si
              vous avez une question.
            </p>
          </div>
        </div>

        <div style={sectionCtaBox}>
          <Link href="/confiance" style={btnSecondary}>
            Découvrir nos engagements
          </Link>
        </div>
        </Reveal>
      </section>

      {/* ================= CTA ================= */}
      {/* Fusion des deux CTA de fermeture (Sprint 06) validée en revue qualité (Sprint 07) :
          une seule intention finale (le catalogue), "Rejoindre la Maison" redescend en lien
          secondaire discret, sur le même principe que le lien B2B sous le CTA du Hero. */}

      <section style={cta}>
        <Reveal>
        <h2 style={ctaTitle}>
          Passez à l’expérience Vanille’Or
        </h2>

        <p style={ctaText}>
          Découvrez une sélection premium conçue
          pour révéler toute la richesse aromatique
          de Madagascar.
        </p>

        <Link
          href="/products"
          style={btnPrimaryLarge}
        >
          Voir le catalogue
        </Link>

        <div style={{ marginTop: "22px" }}>
          <Link href="/register" style={sectionLink}>
            Rejoindre la Maison →
          </Link>
        </div>
        </Reveal>
      </section>

    </div>
  );
}

/* =========================
   STYLES
========================= */

const page = {
  background: colors.cream,
  overflowX: "hidden" as const,
};

/* HERO */

const hero = {
  position: "relative" as const,
  minHeight: "92vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center" as const,
  padding: "40px 20px",
  backgroundImage:
    "url('/images/hero-vanille.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const heroOverlay = {
  position: "absolute" as const,
  inset: 0,
  background:
    "linear-gradient(135deg,#000000d9,#2a2117d1)",
};

const heroContent = {
  position: "relative" as const,
  zIndex: 2,
  maxWidth: "900px",
};

const heroTag = {
  color: colors.goldLight,
  fontWeight: 700,
  letterSpacing: "0.2em",
  fontSize: "13px",
  marginBottom: "20px",
};

const heroTitle = {
  color: "white",
  fontSize: "clamp(38px,7vw,72px)",
  fontWeight: 800,
  lineHeight: 1.1,
  marginBottom: "24px",
};

const heroSubtitle = {
  color: "#ddd",
  fontSize: "18px",
  lineHeight: 1.7,
  maxWidth: "760px",
  margin: "0 auto 34px",
};

const heroActions = {
  display: "flex",
  flexWrap: "wrap" as const,
  justifyContent: "center",
  gap: "14px",
};

const heroSecondaryLink = {
  display: "inline-block",
  marginTop: "22px",
  color: "#ddd",
  fontSize: "14px",
  fontWeight: 600,
  textDecoration: "none",
  opacity: 0.85,
};

/* BUTTONS */

const btnPrimary = {
  background: colors.gold,
  color: "white",
  padding: "15px 24px",
  borderRadius: "14px",
  textDecoration: "none",
  fontWeight: 700,
  display: "inline-block",
};

const btnPrimaryLarge = {
  background: colors.gold,
  color: "white",
  padding: "18px 30px",
  borderRadius: "16px",
  textDecoration: "none",
  fontWeight: 800,
  display: "inline-block",
};

/* SECTIONS */

const section = {
  padding: "90px 20px",
};

const sectionAlt = {
  padding: "90px 20px",
  background: "white",
};

const sectionEyebrow = {
  color: colors.gold,
  fontWeight: 700,
  letterSpacing: "0.15em",
  fontSize: "12px",
  marginBottom: "12px",
};

const sectionEyebrowLight = {
  color: "#f3d7a1",
  fontWeight: 700,
  letterSpacing: "0.15em",
  fontSize: "12px",
  marginBottom: "12px",
};

const sectionTitleLeft = {
  fontSize: "clamp(28px,5vw,42px)",
  fontWeight: 800,
  marginBottom: "20px",
  lineHeight: 1.2,
};

const sectionHeader = {
  maxWidth: "1200px",
  margin: "0 auto 40px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  flexWrap: "wrap" as const,
};

const sectionLink = {
  color: colors.gold,
  textDecoration: "none",
  fontWeight: 700,
};

/* INTRO DE SECTION (réutilisé par Promesse, Différence, et les futurs blocs similaires) */

const sectionIntro = {
  maxWidth: "760px",
  margin: "0 auto 60px",
  textAlign: "center" as const,
};

const sectionIntroTitle = {
  fontSize: "clamp(28px,5vw,42px)",
  fontWeight: 800,
  lineHeight: 1.25,
  marginBottom: "24px",
};

const sectionIntroText = {
  color: "#5f5f5f",
  lineHeight: 1.8,
  marginBottom: "16px",
  fontSize: "16px",
};

const sectionCtaBox = {
  textAlign: "center" as const,
  marginTop: "56px",
};

/* PROMESSE */

const pillarGrid = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(230px,1fr))",
  gap: "24px",
};

const pillarCard = {
  background: colors.cream,
  border: "1px solid rgba(0,0,0,0.05)",
  borderRadius: "20px",
  padding: "32px 24px",
  textAlign: "center" as const,
};

const pillarIcon = {
  fontSize: "32px",
  marginBottom: "16px",
};

const pillarTitle = {
  fontSize: "17px",
  fontWeight: 700,
  marginBottom: "10px",
};

const pillarText = {
  color: "#666",
  lineHeight: 1.6,
  fontSize: "14px",
};

const btnSecondary = {
  display: "inline-block",
  border: `2px solid ${colors.gold}`,
  color: colors.gold,
  background: "transparent",
  padding: "13px 26px",
  borderRadius: "14px",
  textDecoration: "none",
  fontWeight: 700,
};

/* DIFFÉRENCE */

const diffList = {
  maxWidth: "900px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(360px,1fr))",
  gap: "36px 48px",
};

const diffItem = {
  display: "flex",
  gap: "18px",
  alignItems: "flex-start" as const,
};

const diffNumber = {
  fontSize: "26px",
  fontWeight: 800,
  color: colors.gold,
  lineHeight: 1,
  flexShrink: 0,
};

const diffItemTitle = {
  fontSize: "17px",
  fontWeight: 700,
  marginBottom: "8px",
};

const diffItemText = {
  color: "#666",
  lineHeight: 1.6,
  fontSize: "14px",
};

/* STORY */

const storyContainer = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(320px,1fr))",
  gap: "50px",
  alignItems: "center",
};

const storyTextBox = {};

const storyText = {
  color: "#5f5f5f",
  lineHeight: 1.8,
  marginBottom: "18px",
  fontSize: "16px",
};

const storyImageBox = {};

const storyImage = {
  width: "100%",
  borderRadius: "24px",
  objectFit: "cover" as const,
  minHeight: "420px",
};

/* MADAGASCAR */

const madagascarSection = {
  position: "relative" as const,
  minHeight: "85vh",
  display: "flex",
  alignItems: "flex-end" as const,
  justifyContent: "center",
  textAlign: "center" as const,
  padding: "60px 20px",
  backgroundImage:
    "url('/images/about-vanille.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const madagascarOverlay = {
  position: "absolute" as const,
  inset: 0,
  background:
    "linear-gradient(to top,#000000d9 0%,#00000066 35%,transparent 65%)",
};

const madagascarContent = {
  position: "relative" as const,
  zIndex: 2,
  maxWidth: "640px",
};

const madagascarText = {
  color: "#eee",
  lineHeight: 1.7,
  marginBottom: "14px",
  fontSize: "15px",
};

const madagascarQuote = {
  color: colors.goldLight,
  fontStyle: "italic" as const,
  fontSize: "18px",
  fontWeight: 600,
  margin: "26px 0 30px",
  lineHeight: 1.5,
};

const btnSecondaryLight = {
  display: "inline-block",
  border: "2px solid rgba(255,255,255,0.8)",
  color: "white",
  background: "transparent",
  padding: "13px 26px",
  borderRadius: "14px",
  textDecoration: "none",
  fontWeight: 700,
};

/* PRODUCTS */

const productGrid = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(260px,1fr))",
  gap: "24px",
};

const card = {
  position: "relative" as const,
  background: "white",
  borderRadius: "22px",
  overflow: "hidden",
  textDecoration: "none",
  color: "#111",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.06)",
};

const badge = {
  position: "absolute" as const,
  top: 14,
  left: 14,
  background: colors.gold,
  color: "white",
  padding: "6px 12px",
  borderRadius: "999px",
  fontSize: "12px",
  zIndex: 2,
  fontWeight: 700,
};

const img = {
  width: "100%",
  height: 260,
  objectFit: "cover" as const,
};

const cardContent = {
  padding: "18px",
};

const cardCategory = {
  fontSize: "12px",
  color: "#888",
  marginBottom: "8px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
};

const cardTitle = {
  fontSize: "18px",
  fontWeight: 700,
  lineHeight: 1.4,
  marginBottom: "10px",
  // Réserve la hauteur de 2 lignes pour aligner les prix quel que soit
  // le nombre de lignes du nom (cartes de hauteur homogène).
  minHeight: "50px",
};

const price = {
  color: colors.gold,
  fontWeight: 800,
  fontSize: "18px",
};

/* PACK */

const packContainer = {
  maxWidth: "1200px",
  margin: "0 auto",
};

const packCardLarge = {
  position: "relative" as const,
  minHeight: "420px",
  borderRadius: "30px",
  overflow: "hidden",
  backgroundImage:
    "url('/images/PACK-DECOUVERTE.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
};

const packOverlay = {
  position: "absolute" as const,
  inset: 0,
  background:
    "linear-gradient(135deg,#000000d9,#2a2117ba)",
};

const packContent = {
  position: "relative" as const,
  zIndex: 2,
  padding: "50px",
  maxWidth: "600px",
};

const packTitle = {
  color: "white",
  fontSize: "clamp(30px,5vw,48px)",
  fontWeight: 800,
  lineHeight: 1.2,
  marginBottom: "20px",
};

const packText = {
  color: "#ddd",
  lineHeight: 1.8,
  marginBottom: "30px",
};

/* COLLECTIONS */

const collectionsGrid = {
  maxWidth: "1200px",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(320px,1fr))",
  gap: "24px",
};

const collection = {
  position: "relative" as const,
  height: "360px",
  borderRadius: "28px",
  overflow: "hidden",
};

const imgFull = {
  width: "100%",
  height: "100%",
  objectFit: "cover" as const,
};

const overlay = {
  position: "absolute" as const,
  inset: 0,
  background:
    "linear-gradient(to top,#000000d9,#00000030)",
};

const collectionContent = {
  position: "absolute" as const,
  bottom: "28px",
  left: "28px",
  zIndex: 2,
};

const collectionTag = {
  color: colors.goldLight,
  marginBottom: "8px",
  fontWeight: 700,
  letterSpacing: "0.12em",
  fontSize: "12px",
};

const collectionTitle = {
  color: "white",
  fontSize: "32px",
  fontWeight: 800,
};

/* B2B */

const b2b = {
  padding: "100px 20px",
  background:
    "linear-gradient(135deg,#16110c,#2a2117)",
};

const b2bContent = {
  maxWidth: "1000px",
  margin: "0 auto",
  textAlign: "center" as const,
};

const b2bTitle = {
  color: "white",
  fontSize: "clamp(32px,5vw,50px)",
  fontWeight: 800,
  marginBottom: "20px",
};

const b2bText = {
  color: "#ddd",
  lineHeight: 1.8,
  maxWidth: "760px",
  margin: "0 auto 40px",
};

const trustGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "16px",
  marginBottom: "40px",
};

const trustItem = {
  background: "rgba(255,255,255,0.06)",
  color: "white",
  padding: "18px",
  borderRadius: "16px",
  border:
    "1px solid rgba(255,255,255,0.08)",
};

/* CONFIANCE */

const trustList = {
  maxWidth: "1000px",
  margin: "56px auto 0",
  paddingTop: "40px",
  borderTop: "1px solid rgba(0,0,0,0.08)",
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "48px 40px",
};

const trustColumn = {
  textAlign: "center" as const,
};

const trustColumnRule = {
  width: "36px",
  height: "2px",
  background: colors.gold,
  margin: "0 auto 18px",
};

const trustColumnTitle = {
  fontSize: "17px",
  fontWeight: 600,
  letterSpacing: "0.01em",
  marginBottom: "10px",
};

const trustColumnText = {
  color: "#666",
  lineHeight: 1.7,
  fontSize: "14px",
};

/* CTA */

const cta = {
  padding: "100px 20px",
  textAlign: "center" as const,
};

const ctaTitle = {
  fontSize: "clamp(32px,5vw,50px)",
  fontWeight: 800,
  marginBottom: "20px",
};

const ctaText = {
  color: "#666",
  lineHeight: 1.8,
  maxWidth: "700px",
  margin: "0 auto 30px",
};

const center = {
  textAlign: "center" as const,
  padding: "40px",
};