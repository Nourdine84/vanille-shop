import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Vanille’Or — Vanille Premium de Madagascar",
  description:
    "Découvrez la vanille premium de Madagascar avec Vanille’Or.",
};

export default function HomePage() {
  return (
    <div style={{ background: "#faf7f2" }}>
      
      {/* HERO */}
      <section style={{ height: "90vh", position: "relative" }}>
        <Image
          src="/images/hero-vanille.jpg"
          alt="Vanille Madagascar premium"
          fill
          priority
          style={heroImg}
        />

        <div style={overlay} />

        <div style={heroContent}>
          {/* ❌ LOGO SUPPRIMÉ */}

          <h1 style={heroTitle}>
            L’essence précieuse de Madagascar
          </h1>

          <div style={divider} />

          <p style={heroSubtitle}>
            Une vanille d’exception, sélectionnée pour les passionnés de goût
          </p>

          <Link href="/products" style={ctaPrimary}>
            Découvrir nos produits
          </Link>
        </div>
      </section>

      {/* UNIVERS */}
      <section style={section}>
        <h2 style={sectionTitle}>Nos univers</h2>

        <div style={grid}>
          <Link href="/collections/vanille" style={linkReset}>
            <div style={card}>
              <Image
                src="/images/vanille.jpg"
                alt="Vanille premium"
                width={500}
                height={300}
                style={img}
              />
              <div style={cardContent}>
                <h3>🌿 Vanille</h3>
                <p>Gousses, poudre, caviar</p>
              </div>
            </div>
          </Link>

          <Link href="/collections/epices" style={linkReset}>
            <div style={card}>
              <Image
                src="/images/epices.jpg"
                alt="Épices premium"
                width={500}
                height={300}
                style={img}
              />
              <div style={cardContent}>
                <h3>🌶️ Épices</h3>
                <p>Cannelle, cacao, poivre, girofle</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* B2B */}
      <section style={{ ...section, background: "white" }}>
        <div style={b2bBox}>
          <h2>Offre professionnelle</h2>

          <p style={textMuted}>
            Fourniture en volume pour restaurants, pâtissiers et revendeurs.
          </p>

          <Link href="/b2b" style={ctaPrimary}>
            Demander un devis
          </Link>
        </div>
      </section>

      {/* STORY */}
      <section style={section}>
        <div style={storyBox}>
          <h2>Notre engagement</h2>

          <p style={textMuted}>
            VanilleOr travaille directement avec des producteurs à Madagascar
            pour garantir une qualité premium et une traçabilité totale.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={footer}>
        © {new Date().getFullYear()} Vanille’Or  
        <br />
        <span style={akm}>
          Site conçu par AKM.Consulting
        </span>
      </footer>
    </div>
  );
}

/* ================= STYLE ================= */

const heroImg = {
  objectFit: "cover" as const,
  filter: "brightness(0.5)",
};

const overlay = {
  position: "absolute" as const,
  inset: 0,
  background:
    "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))",
};

const heroContent = {
  position: "absolute" as const,
  inset: 0,
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  gap: "18px",
  zIndex: 2,
  color: "white",
  padding: "0 20px",
  textAlign: "center" as const,
};

const heroTitle = {
  fontSize: "52px",
  fontWeight: 700,
  letterSpacing: "-1px",
  lineHeight: 1.2,
};

const heroSubtitle = {
  fontSize: "18px",
  opacity: 0.9,
  maxWidth: "600px",
};

const divider = {
  width: "60px",
  height: "2px",
  background: "#a16207",
};

/* SECTIONS */

const section = {
  padding: "70px 20px",
  maxWidth: "1100px",
  margin: "0 auto",
};

const sectionTitle = {
  textAlign: "center" as const,
  marginBottom: "40px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "25px",
};

const card = {
  background: "white",
  borderRadius: "18px",
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  transition: "0.3s",
};

const cardContent = {
  padding: "15px",
};

const img = {
  width: "100%",
  height: "220px",
  objectFit: "cover" as const,
};

const ctaPrimary = {
  background: "#a16207",
  color: "white",
  padding: "16px 28px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: "600",
  display: "inline-block",
  marginTop: "10px",
};

const textMuted = {
  color: "#666",
  marginTop: "10px",
};

const b2bBox = {
  maxWidth: "800px",
  margin: "0 auto",
  textAlign: "center" as const,
  display: "flex",
  flexDirection: "column" as const,
  gap: "20px",
};

const storyBox = {
  maxWidth: "800px",
  margin: "0 auto",
  textAlign: "center" as const,
};

const footer = {
  textAlign: "center" as const,
  padding: "30px",
  fontSize: "13px",
  color: "#777",
};

const akm = {
  fontWeight: 600,
  color: "#111",
};

const linkReset = {
  textDecoration: "none",
  color: "inherit",
};