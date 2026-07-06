"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useUIStore } from "@/components/ui-providers";
import { getImageUrl } from "@/lib/image";
import type { CSSProperties } from "react";

type Product = {
  id: string;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl?: string | null;
  stock?: number | null;
  isPack?: boolean | null;
  category?: string | null;
};

function safeNumber(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatPrice(priceCents: number) {
  const safe = safeNumber(priceCents);
  return (safe / 100).toFixed(2).replace(".", ",") + " €";
}

const FREE_SHIPPING_CENTS = 5000;

function guessIntentFromCart(cart: Array<{ name: string }>) {
  const names = cart.map((i) => i.name.toLowerCase()).join(" ");

  const hasVanille = names.includes("vanille");
  const hasEpice =
    names.includes("cannelle") ||
    names.includes("poivre") ||
    names.includes("girofle") ||
    names.includes("cacao") ||
    names.includes("épice") ||
    names.includes("epice");

  if (hasVanille && !hasEpice) return "epices";
  if (hasEpice && !hasVanille) return "vanille";

  return "mixed";
}

export default function MiniCart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToCart,
    isReady,
  } = useCart();

  const { isCartOpen, closeCart } = useUIStore();
  const pathname = usePathname();

  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isCartOpen) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      closeRef.current?.focus();
    } else {
      previouslyFocused.current?.focus();
    }
  }, [isCartOpen]);

  useEffect(() => {
    if (!isCartOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        closeCart();
        return;
      }

      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (acc, item) =>
          acc + safeNumber(item.priceCents) * safeNumber(item.quantity),
        0
      ),
    [cart]
  );

  const remainingForFreeShipping = Math.max(
    FREE_SHIPPING_CENTS - subtotal,
    0
  );

  const progress = Math.min((subtotal / FREE_SHIPPING_CENTS) * 100, 100);

  const cartIds = useMemo(() => new Set(cart.map((item) => item.id)), [cart]);

  useEffect(() => {
    if (!isCartOpen || !isReady) return;

    let cancelled = false;

    fetch("/api/products", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;

        const all: Product[] = Array.isArray(data) ? data.filter(Boolean) : [];
        const intent = guessIntentFromCart(cart);

        const filtered = all.filter((p) => {
          if (!p || !p.id || !p.slug || p.isPack) return false;
          if ((p.stock ?? 0) <= 0) return false;
          if (cartIds.has(p.id)) return false;
          return true;
        });

        const scored = filtered
          .map((p) => {
            const haystack = `${p.name} ${p.category || ""}`.toLowerCase();

            let score = 0;

            if (intent === "epices") {
              if (
                haystack.includes("cannelle") ||
                haystack.includes("poivre") ||
                haystack.includes("girofle") ||
                haystack.includes("cacao") ||
                haystack.includes("épice") ||
                haystack.includes("epice")
              ) {
                score += 3;
              }
            }

            if (intent === "vanille") {
              if (haystack.includes("vanille")) {
                score += 3;
              }
            }

            if (intent === "mixed") {
              score += 1;
            }

            score += Math.max(0, 100000 - safeNumber(p.priceCents)) / 100000;

            return { product: p, score };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map((item) => item.product);

        setRecommendations(scored);
      })
      .catch(() => {
        if (!cancelled) {
          setRecommendations([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isCartOpen, isReady, cart, cartIds]);

  function handleGoToCheckout() {
    if (!cart.length || isRedirecting) return;

    setIsRedirecting(true);
    closeCart();
    window.location.href = "/checkout";
  }

  if (!isReady) return null;

  // Le panier storefront ne s'affiche pas dans l'administration.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <div
        data-testid="cart-overlay"
        data-overlay
        aria-hidden={!isCartOpen}
        onClick={closeCart}
        style={{
          ...overlay,
          display: isCartOpen ? "block" : "none",
          opacity: isCartOpen ? 1 : 0,
          pointerEvents: isCartOpen ? "auto" : "none",
        }}
      />

      <aside
        ref={panelRef}
        data-panel
        data-testid="mini-cart"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mini-cart-title"
        aria-hidden={!isCartOpen}
        style={{
          ...panel,
          display: isCartOpen ? "flex" : "none",
          transform: isCartOpen ? "translateX(0)" : "translateX(100%)",
          pointerEvents: isCartOpen ? "auto" : "none",
        }}
      >
        <div style={header}>
          <div>
            <h3 id="mini-cart-title" style={title}>Votre panier</h3>
            <p style={subtitle}>
              {cart.length === 0
                ? "Aucun article sélectionné"
                : `${cart.length} article${cart.length > 1 ? "s" : ""} dans votre panier`}
            </p>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            style={closeBtn}
            aria-label="Fermer le panier"
          >
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <div style={emptyBox}>
            <p data-testid="cart-empty" style={emptyText}>
              Votre panier est vide
            </p>

            <p data-testid="empty-cart" style={{ display: "none" }}>
              Votre panier est vide
            </p>

            {recommendations.length > 0 && (
              <div style={suggestionsBlock}>
                <h4 style={suggestionsTitle}>Idées à découvrir</h4>

                <div style={suggestionsList}>
                  {recommendations.map((product) => (
                    <div key={product.id} style={suggestionCard}>
                      <img
                        src={getImageUrl(product.imageUrl)}
                        alt={product.name}
                        style={suggestionImg}
                        onError={(e) => {
                          e.currentTarget.src = "/images/default.jpg";
                        }}
                      />

                      <div style={suggestionContent}>
                        <p style={suggestionName}>{product.name}</p>
                        <p style={suggestionPrice}>
                          {formatPrice(product.priceCents)}
                        </p>

                        <Link
                          href={`/products/${product.slug}`}
                          onClick={closeCart}
                          style={suggestionLink}
                        >
                          Voir
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div style={shippingBox}>
              {subtotal >= FREE_SHIPPING_CENTS ? (
                <p style={free}>🎉 Livraison offerte</p>
              ) : (
                <p style={shippingText}>
                  Plus que{" "}
                  <strong>{formatPrice(remainingForFreeShipping)}</strong> pour
                  la livraison offerte
                </p>
              )}

              <div style={bar}>
                <div style={{ ...fill, width: `${progress}%` }} />
              </div>
            </div>

            <div style={items} data-testid="cart-items">
              {cart.map((item, index) => (
                <div key={item.id} data-testid="cart-item" style={itemRow}>
                  <img
                    src={getImageUrl(item.imageUrl)}
                    alt={item.name}
                    style={img}
                    onError={(e) => {
                      e.currentTarget.src = "/images/default.jpg";
                    }}
                  />

                  <div data-testid={`cart-item-${index}`} style={itemContent}>
                    <p style={name}>{item.name}</p>

                    <p style={unitPrice}>{formatPrice(item.priceCents)}</p>

                    <div style={qtyPriceRow}>
                      <div style={qtyRow}>
                        <button
                          type="button"
                          data-testid="decrease-qty"
                          style={qtyBtn}
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              Math.max(1, safeNumber(item.quantity) - 1)
                            )
                          }
                          aria-label="Diminuer la quantité"
                        >
                          -
                        </button>

                        <span data-testid="item-quantity" style={qtyValue}>
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          data-testid="increase-qty"
                          style={qtyBtn}
                          onClick={() =>
                            updateQuantity(item.id, safeNumber(item.quantity) + 1)
                          }
                          aria-label="Augmenter la quantité"
                        >
                          +
                        </button>
                      </div>

                      <p style={price}>
                        {formatPrice(
                          safeNumber(item.priceCents) * safeNumber(item.quantity)
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      data-testid="remove-item"
                      style={removeBtn}
                      onClick={() => removeFromCart(item.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}

              {recommendations.length > 0 && (
                <div style={crossSellBlock}>
                  <div style={crossSellHeader}>
                    <h4 style={crossSellTitle}>Complétez votre sélection</h4>
                    <p style={crossSellText}>
                      Des suggestions pensées pour augmenter la valeur de votre panier.
                    </p>
                  </div>

                  <div style={crossSellGrid}>
                    {recommendations.map((product) => (
                      <div key={product.id} style={crossSellCard}>
                        <Link
                          href={`/products/${product.slug}`}
                          onClick={closeCart}
                          style={crossSellMedia}
                        >
                          <img
                            src={getImageUrl(product.imageUrl)}
                            alt={product.name}
                            style={crossSellImg}
                            onError={(e) => {
                              e.currentTarget.src = "/images/default.jpg";
                            }}
                          />
                        </Link>

                        <div style={crossSellContent}>
                          <p style={crossSellName}>{product.name}</p>
                          <p style={crossSellPrice}>
                            {formatPrice(product.priceCents)}
                          </p>

                          <div style={crossSellActions}>
                            <Link
                              href={`/products/${product.slug}`}
                              onClick={closeCart}
                              style={crossSellViewBtn}
                            >
                              Voir
                            </Link>

                            <button
                              type="button"
                              style={crossSellAddBtn}
                              onClick={() =>
                                addToCart({
                                  id: product.id,
                                  name: product.name,
                                  priceCents: product.priceCents,
                                  imageUrl: product.imageUrl ?? undefined,
                                  quantity: 1,
                                })
                              }
                            >
                              Ajouter
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={footer}>
              <div style={total} data-testid="cart-total">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <p style={trustText}>
                Paiement sécurisé • Expédition rapide • Qualité premium
              </p>

              <button
                type="button"
                style={{
                  ...checkoutBtn,
                  opacity: isRedirecting ? 0.75 : 1,
                  cursor: isRedirecting ? "wait" : "pointer",
                }}
                data-testid="checkout-button"
                onClick={handleGoToCheckout}
                disabled={isRedirecting}
              >
                {isRedirecting ? "Ouverture..." : "Commander maintenant"}
              </button>

              <button
                type="button"
                onClick={clearCart}
                style={clearBtn}
                data-testid="clear-cart"
              >
                Vider le panier
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

const overlay: CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  backdropFilter: "blur(4px)",
  zIndex: 9998,
  transition: "opacity 0.2s ease",
};

const panel: CSSProperties = {
  position: "fixed",
  top: 0,
  right: 0,
  width: "100%",
  maxWidth: "430px",
  height: "100vh",
  background: "linear-gradient(180deg,#fff,#fbf8f3)",
  padding: "20px",
  flexDirection: "column",
  borderTopLeftRadius: 20,
  borderBottomLeftRadius: 20,
  boxShadow: "-20px 0 50px rgba(0,0,0,0.2)",
  transition: "transform 0.25s ease",
  zIndex: 9999,
};

const header: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "10px",
};

const title: CSSProperties = {
  fontSize: "22px",
  fontWeight: 800,
  margin: 0,
};

const subtitle: CSSProperties = {
  margin: "4px 0 0 0",
  fontSize: "12px",
  color: "#777",
};

const closeBtn: CSSProperties = {
  border: "none",
  background: "#f3f4f6",
  borderRadius: "50%",
  width: "34px",
  height: "34px",
  cursor: "pointer",
  fontSize: "16px",
};

const emptyBox: CSSProperties = {
  textAlign: "center",
  padding: "24px 0",
};

const emptyText: CSSProperties = {
  color: "#666",
  margin: 0,
};

const shippingBox: CSSProperties = {
  marginBottom: "12px",
  padding: "12px",
  background: "#fff7ed",
  borderRadius: "12px",
  border: "1px solid #f3dfc1",
};

const shippingText: CSSProperties = {
  fontSize: "13px",
  marginBottom: "6px",
};

const free: CSSProperties = {
  fontWeight: 700,
  color: "#065f46",
  margin: 0,
};

const bar: CSSProperties = {
  height: "6px",
  background: "#eee",
  borderRadius: "999px",
  overflow: "hidden",
};

const fill: CSSProperties = {
  height: "100%",
  background: "#a16207",
  transition: "width 0.25s ease",
};

const items: CSSProperties = {
  flex: 1,
  overflowY: "auto",
  paddingRight: "4px",
};

const itemRow: CSSProperties = {
  display: "flex",
  gap: "10px",
  marginBottom: "12px",
  padding: "10px",
  borderRadius: "14px",
  background: "white",
};

const img: CSSProperties = {
  width: "70px",
  height: "70px",
  borderRadius: "10px",
  objectFit: "cover",
  flexShrink: 0,
};

const itemContent: CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const name: CSSProperties = {
  fontWeight: 700,
  margin: "0 0 4px",
};

const unitPrice: CSSProperties = {
  fontSize: "12px",
  color: "#777",
  margin: "0 0 8px",
};

const qtyPriceRow: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
};

const qtyRow: CSSProperties = {
  display: "flex",
  gap: "6px",
  alignItems: "center",
};

const qtyBtn: CSSProperties = {
  border: "none",
  background: "#f3f4f6",
  borderRadius: "50%",
  width: "24px",
  height: "24px",
  cursor: "pointer",
};

const qtyValue: CSSProperties = {
  fontWeight: 700,
  minWidth: "18px",
  textAlign: "center",
};

const price: CSSProperties = {
  fontWeight: 800,
  margin: 0,
};

const removeBtn: CSSProperties = {
  marginTop: "8px",
  fontSize: "12px",
  color: "#dc2626",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  padding: 0,
};

const crossSellBlock: CSSProperties = {
  marginTop: "16px",
  paddingTop: "12px",
  borderTop: "1px solid #eee",
};

const crossSellHeader: CSSProperties = {
  marginBottom: "10px",
};

const crossSellTitle: CSSProperties = {
  margin: 0,
  fontSize: "16px",
  fontWeight: 800,
};

const crossSellText: CSSProperties = {
  margin: "4px 0 0 0",
  fontSize: "12px",
  color: "#777",
};

const crossSellGrid: CSSProperties = {
  display: "grid",
  gap: "10px",
};

const crossSellCard: CSSProperties = {
  display: "flex",
  gap: "10px",
  background: "white",
  borderRadius: "14px",
  padding: "10px",
};

const crossSellMedia: CSSProperties = {
  flexShrink: 0,
};

const crossSellImg: CSSProperties = {
  width: "70px",
  height: "70px",
  borderRadius: "10px",
  objectFit: "cover",
  display: "block",
};

const crossSellContent: CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const crossSellName: CSSProperties = {
  margin: "0 0 4px 0",
  fontWeight: 700,
  fontSize: "14px",
};

const crossSellPrice: CSSProperties = {
  margin: "0 0 8px 0",
  color: "#a16207",
  fontWeight: 700,
  fontSize: "13px",
};

const crossSellActions: CSSProperties = {
  display: "flex",
  gap: "8px",
};

const crossSellViewBtn: CSSProperties = {
  flex: 1,
  background: "#111",
  color: "white",
  textDecoration: "none",
  textAlign: "center",
  padding: "8px 10px",
  borderRadius: "8px",
  fontSize: "12px",
  fontWeight: 600,
};

const crossSellAddBtn: CSSProperties = {
  flex: 1,
  background: "#a16207",
  color: "white",
  border: "none",
  padding: "8px 10px",
  borderRadius: "8px",
  fontSize: "12px",
  fontWeight: 700,
  cursor: "pointer",
};

const suggestionsBlock: CSSProperties = {
  marginTop: "18px",
  textAlign: "left",
};

const suggestionsTitle: CSSProperties = {
  fontSize: "16px",
  fontWeight: 800,
  marginBottom: "10px",
};

const suggestionsList: CSSProperties = {
  display: "grid",
  gap: "10px",
};

const suggestionCard: CSSProperties = {
  display: "flex",
  gap: "10px",
  background: "white",
  borderRadius: "12px",
  padding: "10px",
};

const suggestionImg: CSSProperties = {
  width: "60px",
  height: "60px",
  borderRadius: "10px",
  objectFit: "cover",
};

const suggestionContent: CSSProperties = {
  flex: 1,
};

const suggestionName: CSSProperties = {
  margin: "0 0 4px 0",
  fontSize: "14px",
  fontWeight: 700,
};

const suggestionPrice: CSSProperties = {
  margin: "0 0 8px 0",
  color: "#a16207",
  fontWeight: 700,
  fontSize: "13px",
};

const suggestionLink: CSSProperties = {
  color: "#111",
  fontSize: "13px",
  fontWeight: 600,
  textDecoration: "none",
};

const footer: CSSProperties = {
  borderTop: "1px solid #eee",
  paddingTop: "12px",
  marginTop: "10px",
};

const total: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  fontWeight: 800,
  marginBottom: "8px",
};

const trustText: CSSProperties = {
  fontSize: "12px",
  color: "#777",
  textAlign: "center",
  marginBottom: "10px",
};

const checkoutBtn: CSSProperties = {
  display: "block",
  textAlign: "center",
  background: "#a16207",
  color: "white",
  padding: "14px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: 800,
  border: "none",
  width: "100%",
};

const clearBtn: CSSProperties = {
  marginTop: "8px",
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ddd",
  background: "white",
  cursor: "pointer",
};