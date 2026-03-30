import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Vanille’Or — Vanille Premium de Madagascar",
  description:
    "Découvrez la vanille premium de Madagascar avec Vanille’Or. Produits haut de gamme pour particuliers et professionnels.",
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
          style={{ objectFit: "cover", filter: "brightness(0.6)" }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.6))",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 20px",
            zIndex: 2,
          }}
        >
          <div
            style={{
              textAlign: "center",
              color: "white",
              maxWidth: "700px",
            }}
          >
            <h1 style={{ fontSize: "52px", marginBottom: "20px" }}>
              Vanille’Or
            </h1>

            <p style={{ fontSize: "18px", marginBottom: "30px" }}>
              L’excellence de la vanille de Madagascar
            </p>

            <Link
              href="/products"
              style={{
                background: "#a16207",
                color: "white",
                padding: "16px 28px",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Découvrir nos produits
            </Link>
          </div>
        </div>
      </section>

      {/* UNIVERS */}
      <section style={{ padding: "70px 20px", maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", marginBottom: "40px" }}>
          Nos univers
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
          <Link href="/collections/vanille" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ background: "white", borderRadius: "16px", padding: "15px" }}>
              <Image
                src="/images/vanille.jpg"
                alt="Vanille premium"
                width={500}
                height={300}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
              <h3>🌿 Vanille</h3>
              <p>Gousses, poudre, caviar</p>
            </div>
          </Link>

          <Link href="/collections/epices" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ background: "white", borderRadius: "16px", padding: "15px" }}>
              <Image
                src="/images/epices.jpg"
                alt="Épices premium"
                width={500}
                height={300}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
              <h3>🌶️ Épices</h3>
              <p>Cannelle, cacao, poivre, girofle</p>
            </div>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          textAlign: "center",
          padding: "30px",
          fontSize: "13px",
          color: "#777",
        }}
      >
        © {new Date().getFullYear()} Vanille’Or — AKM.Consulting
      </footer>
    </div>
  );
}