"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import { useCart } from "@/lib/cart-context";
import CrossSell from "@/components/cross-sell";
import { useToast } from "@/components/ui/toast";

/* ================= SAFE UTILS ================= */

function safeNumber(
  value: any
) {
  const n = Number(value);

  return Number.isFinite(n)
    ? n
    : 0;
}

function formatPrice(
  priceCents: number
) {
  const safe =
    safeNumber(priceCents);

  return (
    (safe / 100)
      .toFixed(2)
      .replace(".", ",") +
    " €"
  );
}

/* ================= PAGE ================= */

export default function CheckoutPage() {
  const { cart } =
    useCart();

  const { showToast } =
    useToast();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    mounted,
    setMounted,
  ] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const subtotal =
    useMemo(() => {
      return cart.reduce(
        (acc, item) => {
          const price =
            safeNumber(
              item.priceCents
            );

          const qty =
            safeNumber(
              item.quantity
            );

          return (
            acc +
            price * qty
          );
        },
        0
      );
    }, [cart]);

  const freeShippingThreshold =
    5000;

  const shippingCost =
    subtotal >=
    freeShippingThreshold
      ? 0
      : 490;

  const total =
    subtotal +
    shippingCost;

  const remaining =
    Math.max(
      0,
      freeShippingThreshold -
        subtotal
    );

  const totalItems =
    cart.reduce(
      (acc, item) =>
        acc +
        safeNumber(
          item.quantity
        ),
      0
    );

  /* ================= CHECKOUT ================= */

  const handleCheckout =
    async () => {
      if (
        !cart.length ||
        loading
      )
        return;

      try {
        setLoading(true);

        const res =
          await fetch(
            "/api/checkout-session",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                {
                  cart,
                }
              ),
            }
          );

        const data =
          await res
            .json()
            .catch(
              () => null
            );

        if (
          !res.ok ||
          !data?.url
        ) {
          let message =
            data?.error ||
            "Erreur paiement";

          if (
            message
              .toLowerCase()
              .includes(
                "stock"
              )
          ) {
            message =
              "Un produit de votre panier est en rupture de stock.";
          }

          showToast(
            message,
            "error"
          );

          return;
        }

        window.location.href =
          data.url;
      } catch (
        err: unknown
      ) {
        console.error(
          "🔥 CHECKOUT ERROR:",
          err
        );

        let message =
          "Erreur réseau. Merci de réessayer.";

        if (
          err instanceof
            Error &&
          err.message
        ) {
          message =
            err.message;
        }

        showToast(
          message,
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

  if (!mounted)
    return null;

  return (
    <div style={page}>
      {/* HERO */}

      <section style={hero}>
        <div
          style={
            heroOverlay
          }
        />

        <div
          style={
            heroContent
          }
        >
          <p style={heroTag}>
            VANILLE’OR
          </p>

          <h1
            style={
              heroTitle
            }
          >
            Finalisez votre
            commande en
            toute sérénité
          </h1>

          <p style={heroSub}>
            Paiement
            sécurisé •
            Livraison
            premium •
            Produits
            sélectionnés à
            Madagascar
          </p>
        </div>
      </section>

      {/* CONTENT */}

      <div style={container}>
        <div
          style={{
            ...grid,
            gridTemplateColumns: isMobile
              ? "1fr"
              : grid.gridTemplateColumns,
          }}
        >
          {/* LEFT */}

          <div>
            {/* CART */}

            <div style={card}>
              <div
                style={
                  sectionHeader
                }
              >
                <div>
                  <p
                    style={
                      sectionEyebrow
                    }
                  >
                    PANIER
                  </p>

                  <h2
                    style={
                      sectionTitle
                    }
                  >
                    Votre
                    sélection
                  </h2>
                </div>

                <div
                  style={
                    itemCount
                  }
                >
                  {
                    totalItems
                  }{" "}
                  article
                  {totalItems >
                  1
                    ? "s"
                    : ""}
                </div>
              </div>

              {cart.length ===
              0 ? (
                <div
                  style={
                    emptyCart
                  }
                >
                  <h3>
                    Votre
                    panier
                    est vide
                  </h3>

                  <p
                    style={
                      emptyText
                    }
                  >
                    Découvrez
                    notre
                    sélection
                    premium
                    Vanille’Or.
                  </p>

                  <Link
                    href="/products"
                    style={
                      continueBtn
                    }
                  >
                    Découvrir
                    nos
                    produits
                  </Link>
                </div>
              ) : (
                <div
                  style={
                    cartWrapper
                  }
                >
                  {cart.map(
                    (
                      item
                    ) => (
                      <div
                        key={
                          item.id
                        }
                        style={
                          itemRow
                        }
                      >
                        <img
                          src={
                            item.imageUrl ||
                            "/images/default.jpg"
                          }
                          alt={
                            item.name
                          }
                          style={
                            image
                          }
                        />

                        <div
                          style={{
                            flex: 1,
                          }}
                        >
                          <p
                            style={
                              name
                            }
                          >
                            {
                              item.name
                            }
                          </p>

                          <p
                            style={
                              meta
                            }
                          >
                            Quantité
                            :{" "}
                            {
                              item.quantity
                            }
                          </p>
                        </div>

                        <p
                          style={
                            price
                          }
                        >
                          {formatPrice(
                            item.priceCents *
                              item.quantity
                          )}
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* TRUST */}

            <div
              style={
                trust
              }
            >
              <div
                style={
                  trustItem
                }
              >
                🔒 Paiement
                sécurisé
                Stripe
              </div>

              <div
                style={
                  trustItem
                }
              >
                🚚 Livraison
                rapide &
                suivie
              </div>

              <div
                style={
                  trustItem
                }
              >
                🌿 Produits
                premium de
                Madagascar
              </div>

              <div
                style={
                  trustItem
                }
              >
                ⭐ Qualité
                sélectionnée
                Vanille’Or
              </div>
            </div>

            {/* CROSS SELL */}

            <CrossSell />
          </div>

          {/* RIGHT */}

          <div
            style={
              summary
            }
          >
            <div
              style={
                summaryHeader
              }
            >
              <p
                style={
                  sectionEyebrow
                }
              >
                CHECKOUT
              </p>

              <h2
                style={
                  sectionTitle
                }
              >
                Résumé de la
                commande
              </h2>
            </div>

            {remaining >
            0 ? (
              <div
                style={
                  shippingBox
                }
              >
                Ajoutez
                encore{" "}
                <strong>
                  {formatPrice(
                    remaining
                  )}
                </strong>{" "}
                pour
                bénéficier
                de la
                livraison
                offerte
              </div>
            ) : (
              <div
                style={
                  shippingFree
                }
              >
                Livraison
                offerte
                appliquée 🎉
              </div>
            )}

            <div
              style={
                summaryBlock
              }
            >
              <div
                style={
                  row
                }
              >
                <span>
                  Sous-total
                </span>

                <span>
                  {formatPrice(
                    subtotal
                  )}
                </span>
              </div>

              <div
                style={
                  row
                }
              >
                <span>
                  Livraison
                </span>

                <span>
                  {shippingCost ===
                  0
                    ? "Offerte"
                    : formatPrice(
                        shippingCost
                      )}
                </span>
              </div>

              <hr
                style={
                  divider
                }
              />

              <div
                style={
                  totalRow
                }
              >
                <span>
                  Total
                </span>

                <span>
                  {formatPrice(
                    total
                  )}
                </span>
              </div>
            </div>

            {/* CTA */}

            <button
              onClick={
                handleCheckout
              }
              style={{
                ...cta,

                opacity:
                  loading
                    ? 0.7
                    : 1,

                cursor:
                  loading ||
                  cart.length ===
                    0
                    ? "not-allowed"
                    : "pointer",
              }}
              disabled={
                loading ||
                cart.length ===
                  0
              }
            >
              {loading
                ? "Redirection..."
                : "Payer maintenant 🔒"}
            </button>

            <div
              style={
                secureBox
              }
            >
              <p
                style={
                  secureTitle
                }
              >
                🔐 Paiement
                100%
                sécurisé
              </p>

              <p
                style={
                  secure
                }
              >
                Toutes les
                transactions
                sont
                sécurisées
                via Stripe.
              </p>
            </div>

            <div
              style={
                supportMini
              }
            >
              Besoin d’aide
              ? Contactez
              notre support
              premium.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const page: React.CSSProperties =
  {
    background:
      "#f8f5ef",

    minHeight:
      "100vh",
  };

const hero: React.CSSProperties =
  {
    position:
      "relative",

    height: "320px",

    backgroundImage:
      "url('/images/hero-vanille.jpg')",

    backgroundSize:
      "cover",

    backgroundPosition:
      "center",
  };

const heroOverlay: React.CSSProperties =
  {
    position:
      "absolute",

    inset: 0,

    background:
      "linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.55))",
  };

const heroContent: React.CSSProperties =
  {
    position:
      "relative",

    zIndex: 2,

    textAlign:
      "center",

    color: "white",

    paddingTop:
      "90px",

    maxWidth: 760,

    margin: "0 auto",

    paddingInline:
      20,
  };

const heroTag: React.CSSProperties =
  {
    color: "#d4af37",

    fontSize: 14,

    fontWeight: 900,

    letterSpacing:
      "0.35em",

    marginBottom: 16,
  };

const heroTitle: React.CSSProperties =
  {
    fontSize: 42,

    lineHeight: 1.15,

    fontWeight: 900,

    margin: 0,
  };

const heroSub: React.CSSProperties =
  {
    color: "#e5e5e5",

    marginTop: 18,

    lineHeight: 1.7,

    fontSize: 15,
  };

const container: React.CSSProperties =
  {
    maxWidth:
      "1180px",

    margin: "0 auto",

    padding:
      "40px 20px 70px",
  };

const grid: React.CSSProperties =
  {
    display: "grid",

    gridTemplateColumns:
      "2fr 1fr",

    gap: 30,

    alignItems:
      "start",
  };

const card: React.CSSProperties =
  {
    background:
      "white",

    borderRadius: 26,

    padding: 28,

    boxShadow:
      "0 10px 40px rgba(0,0,0,0.05)",
  };

const sectionHeader: React.CSSProperties =
  {
    display: "flex",

    justifyContent:
      "space-between",

    alignItems:
      "center",

    gap: 20,

    flexWrap:
      "wrap",

    marginBottom: 24,
  };

const summaryHeader: React.CSSProperties =
  {
    marginBottom: 22,
  };

const sectionEyebrow: React.CSSProperties =
  {
    color: "#a16207",

    fontWeight: 800,

    letterSpacing:
      "0.12em",

    fontSize: 12,

    marginBottom: 10,
  };

const sectionTitle: React.CSSProperties =
  {
    fontSize: 26,

    margin: 0,

    fontWeight: 900,
  };

const itemCount: React.CSSProperties =
  {
    background:
      "#111",

    color: "white",

    padding:
      "10px 16px",

    borderRadius: 999,

    fontWeight: 700,

    fontSize: 13,
  };

const emptyCart: React.CSSProperties =
  {
    textAlign:
      "center",

    padding:
      "40px 20px",
  };

const emptyText: React.CSSProperties =
  {
    color: "#666",

    marginTop: 12,

    marginBottom: 24,
  };

const continueBtn: React.CSSProperties =
  {
    display:
      "inline-block",

    background:
      "#111",

    color: "white",

    padding:
      "14px 20px",

    borderRadius: 14,

    textDecoration:
      "none",

    fontWeight: 700,
  };

const cartWrapper: React.CSSProperties =
  {
    display: "grid",

    gap: 18,
  };

const itemRow: React.CSSProperties =
  {
    display: "flex",

    gap: 16,

    alignItems:
      "center",

    paddingBottom: 18,

    borderBottom:
      "1px solid #eee",
  };

const image: React.CSSProperties =
  {
    width: 84,

    height: 84,

    borderRadius: 18,

    objectFit:
      "cover",

    background:
      "#f5f5f5",
  };

const name: React.CSSProperties =
  {
    fontWeight: 800,

    fontSize: 15,

    marginBottom: 8,
  };

const meta: React.CSSProperties =
  {
    fontSize: 13,

    color: "#666",
  };

const price: React.CSSProperties =
  {
    fontWeight: 800,

    color: "#a16207",

    fontSize: 16,
  };

const trust: React.CSSProperties =
  {
    marginTop: 22,

    background:
      "white",

    borderRadius: 22,

    padding: 24,

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(220px,1fr))",

    gap: 16,

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.04)",
  };

const trustItem: React.CSSProperties =
  {
    background:
      "#faf7f2",

    borderRadius: 16,

    padding: 16,

    fontWeight: 600,

    color: "#444",
  };

const summary: React.CSSProperties =
  {
    background:
      "white",

    borderRadius: 26,

    padding: 28,

    position:
      "sticky",

    top: 20,

    boxShadow:
      "0 10px 40px rgba(0,0,0,0.05)",
  };

const shippingBox: React.CSSProperties =
  {
    background:
      "#fff4df",

    padding: 16,

    borderRadius: 18,

    marginBottom: 22,

    color: "#8b5e14",

    lineHeight: 1.6,
  };

const shippingFree: React.CSSProperties =
  {
    background:
      "#ecfdf5",

    padding: 16,

    borderRadius: 18,

    marginBottom: 22,

    color: "#166534",

    fontWeight: 700,
  };

const summaryBlock: React.CSSProperties =
  {
    background:
      "#faf7f2",

    borderRadius: 20,

    padding: 20,
  };

const row: React.CSSProperties =
  {
    display: "flex",

    justifyContent:
      "space-between",

    marginBottom: 14,

    color: "#444",
  };

const divider: React.CSSProperties =
  {
    border: "none",

    borderTop:
      "1px solid #e5e5e5",

    margin:
      "20px 0",
  };

const totalRow: React.CSSProperties =
  {
    display: "flex",

    justifyContent:
      "space-between",

    fontWeight: 900,

    fontSize: 22,
  };

const cta: React.CSSProperties =
  {
    marginTop: 26,

    width: "100%",

    padding:
      "18px 20px",

    background:
      "linear-gradient(135deg,#b7791f,#8b5e14)",

    color: "white",

    borderRadius: 18,

    border: "none",

    fontWeight: 900,

    fontSize: 16,

    boxShadow:
      "0 12px 24px rgba(183,121,31,0.24)",
  };

const secureBox: React.CSSProperties =
  {
    marginTop: 22,

    background:
      "#f8fafc",

    borderRadius: 18,

    padding: 18,
  };

const secureTitle: React.CSSProperties =
  {
    fontWeight: 800,

    marginBottom: 8,
  };

const secure: React.CSSProperties =
  {
    fontSize: 13,

    color: "#666",

    lineHeight: 1.7,
  };

const supportMini: React.CSSProperties =
  {
    marginTop: 20,

    textAlign:
      "center",

    color: "#777",

    fontSize: 13,
  };