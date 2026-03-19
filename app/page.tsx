import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-14 items-center">
        <div>
          <p
            style={{
              fontSize: "12px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#a16207",
              marginBottom: "16px",
              fontWeight: 700,
            }}
          >
            Vanille premium
          </p>

          <h1
            style={{
              fontSize: "clamp(40px, 6vw, 66px)",
              lineHeight: 1.05,
              fontWeight: 800,
              marginBottom: "20px",
            }}
          >
            L’excellence de la vanille de Madagascar
          </h1>

          <p
            style={{
              color: "#4b5563",
              fontSize: "18px",
              lineHeight: 1.8,
              marginBottom: "32px",
              maxWidth: "580px",
            }}
          >
            Une sélection raffinée de vanille haut de gamme, pensée pour offrir
            un parfum intense, une qualité irréprochable et une expérience
            premium à chaque utilisation.
          </p>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <Link
              href="/products"
              style={{
                background: "#111111",
                color: "white",
                padding: "14px 22px",
                borderRadius: "14px",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Découvrir nos produits
            </Link>

            <Link
              href="/products"
              style={{
                border: "1px solid #d6d3d1",
                color: "#111111",
                padding: "14px 22px",
                borderRadius: "14px",
                textDecoration: "none",
                fontWeight: 600,
                background: "white",
              }}
            >
              Voir la collection
            </Link>
          </div>
        </div>

        <div>
          <div
            style={{
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 20px 50px rgba(0,0,0,0.10)",
              background: "#f8f5ef",
            }}
          >
            <img
              src="/images/hero-vanille.jpg"
              alt="Vanille premium"
              style={{
                width: "100%",
                display: "block",
                objectFit: "cover",
                minHeight: "420px",
              }}
            />
          </div>
        </div>
      </section>

      <section style={{ background: "#fffdf9", padding: "80px 24px" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <div>
            <h3 style={{ fontWeight: 700, fontSize: "20px", marginBottom: "10px" }}>
              🌿 Origine Madagascar
            </h3>
            <p style={{ color: "#6b7280", lineHeight: 1.7 }}>
              Une provenance reconnue pour la richesse aromatique et la qualité
              exceptionnelle de ses gousses.
            </p>
          </div>

          <div>
            <h3 style={{ fontWeight: 700, fontSize: "20px", marginBottom: "10px" }}>
              ⭐ Qualité premium
            </h3>
            <p style={{ color: "#6b7280", lineHeight: 1.7 }}>
              Des produits sélectionnés avec exigence pour répondre aux attentes
              des passionnés comme des professionnels.
            </p>
          </div>

          <div>
            <h3 style={{ fontWeight: 700, fontSize: "20px", marginBottom: "10px" }}>
              🚚 Livraison rapide
            </h3>
            <p style={{ color: "#6b7280", lineHeight: 1.7 }}>
              Une expédition rapide et soignée pour la France et l’Europe.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-24 px-6 text-center">
        <h2 style={{ fontSize: "36px", fontWeight: 800, marginBottom: "18px" }}>
          Sublimez toutes vos créations
        </h2>

        <p
          style={{
            color: "#6b7280",
            maxWidth: "700px",
            margin: "0 auto 36px",
            lineHeight: 1.8,
          }}
        >
          Pâtisserie, cuisine fine, desserts, infusions ou cadeaux gourmands :
          notre vanille accompagne toutes les envies avec élégance.
        </p>

        <Link
          href="/products"
          style={{
            background: "#a16207",
            color: "white",
            padding: "14px 24px",
            borderRadius: "14px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Accéder à la boutique
        </Link>
      </section>

      <section style={{ background: "#f9fafb", padding: "80px 24px" }}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 style={{ fontSize: "34px", fontWeight: 800, marginBottom: "36px" }}>
            Ils nous font confiance
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div
              style={{
                background: "white",
                padding: "24px",
                borderRadius: "18px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
              }}
            >
              <p style={{ color: "#4b5563", marginBottom: "14px", lineHeight: 1.7 }}>
                “Une qualité incroyable, le parfum est puissant et très raffiné.”
              </p>
              <p style={{ fontWeight: 700 }}>Pâtissier</p>
            </div>

            <div
              style={{
                background: "white",
                padding: "24px",
                borderRadius: "18px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
              }}
            >
              <p style={{ color: "#4b5563", marginBottom: "14px", lineHeight: 1.7 }}>
                “Un produit premium qui se distingue immédiatement à l’ouverture.”
              </p>
              <p style={{ fontWeight: 700 }}>Client particulier</p>
            </div>

            <div
              style={{
                background: "white",
                padding: "24px",
                borderRadius: "18px",
                boxShadow: "0 6px 18px rgba(0,0,0,0.05)",
              }}
            >
              <p style={{ color: "#4b5563", marginBottom: "14px", lineHeight: 1.7 }}>
                “Parfait pour mes desserts, c’est devenu une référence.”
              </p>
              <p style={{ fontWeight: 700 }}>Chef</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}