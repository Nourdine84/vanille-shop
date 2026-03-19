"use client";

import Link from "next/link";
import { useCart } from "../../lib/cart-store";
import { useToast } from "../../components/ui/toast";

export default function CartPage() {
  const {
    cart,
    addToCart,
    decrementFromCart,
    removeFromCart,
    clearCart,
  } = useCart();

  const { showToast } = useToast();

  const total = cart.reduce(
    (acc, item) => acc + item.priceCents * item.quantity,
    0
  );

  const formatPrice = (value: number) =>
    (value / 100).toFixed(2).replace(".", ",") + " €";

  return (
    <div className="max-w-6xl mx-auto py-20 px-6">
      <div style={{ marginBottom: "36px" }}>
        <p
          style={{
            fontSize: "12px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#a16207",
            marginBottom: "10px",
            fontWeight: 700,
          }}
        >
          Vanille Or
        </p>

        <h1 style={{ fontSize: "40px", fontWeight: 800, marginBottom: "10px" }}>
          Votre panier
        </h1>

        <p style={{ color: "#6b7280" }}>
          Finalisez votre sélection avant de passer au paiement.
        </p>
      </div>

      {cart.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            border: "1px dashed #d6d3d1",
            borderRadius: "18px",
            background: "#fafaf9",
          }}
        >
          <p style={{ color: "#6b7280", marginBottom: "20px" }}>
            Votre panier est vide
          </p>

          <Link
            href="/products"
            style={{
              background: "#111",
              color: "white",
              padding: "12px 18px",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Découvrir les produits
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 flex flex-col gap-6">
            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: "16px",
                  border: "1px solid #ece7df",
                  borderRadius: "18px",
                  padding: "16px",
                  background: "white",
                }}
              >
                <img
                  src={item.imageUrl || "/images/placeholder.jpg"}
                  alt={item.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />

                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 700, marginBottom: "6px" }}>
                    {item.name}
                  </h3>

                  <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "10px" }}>
                    Prix unitaire : {formatPrice(item.priceCents)}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "8px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        decrementFromCart(item.id);
                        showToast("Quantité réduite", "info");
                      }}
                      style={{
                        border: "1px solid #d6d3d1",
                        background: "white",
                        width: "34px",
                        height: "34px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      −
                    </button>

                    <span style={{ minWidth: "20px", textAlign: "center", fontWeight: 700 }}>
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        addToCart({
                          ...item,
                          quantity: 1,
                        });
                        showToast("Quantité augmentée", "success");
                      }}
                      style={{
                        border: "1px solid #d6d3d1",
                        background: "white",
                        width: "34px",
                        height: "34px",
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                    >
                      +
                    </button>
                  </div>

                  <p style={{ color: "#b45309", fontSize: "13px", fontWeight: 600 }}>
                    Produit premium • stock limité
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <p style={{ fontWeight: 800, marginBottom: "14px" }}>
                    {formatPrice(item.priceCents * item.quantity)}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      removeFromCart(item.id);
                      showToast("Produit supprimé du panier", "error");
                    }}
                    style={{
                      border: "none",
                      background: "#fee2e2",
                      color: "#b91c1c",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              border: "1px solid #ece7df",
              borderRadius: "18px",
              padding: "24px",
              background: "#fffdf9",
              height: "fit-content",
            }}
          >
            <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "18px" }}>
              Résumé
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
                color: "#6b7280",
              }}
            >
              <span>Sous-total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "18px",
                color: "#6b7280",
              }}
            >
              <span>Livraison</span>
              <span>Offerte</span>
            </div>

            <hr style={{ margin: "18px 0" }} />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "18px",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: "18px" }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: "24px" }}>
                {formatPrice(total)}
              </span>
            </div>

            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: "14px",
                padding: "14px",
                marginBottom: "18px",
                fontSize: "14px",
                color: "#4b5563",
                lineHeight: 1.7,
              }}
            >
              ✔ Paiement sécurisé<br />
              ✔ Livraison rapide<br />
              ✔ Qualité premium garantie
            </div>

            <Link
              href="/checkout"
              style={{
                display: "block",
                textAlign: "center",
                background: "#111",
                color: "white",
                padding: "14px",
                borderRadius: "14px",
                textDecoration: "none",
                fontWeight: 700,
                marginBottom: "12px",
              }}
            >
              Passer au paiement
            </Link>

            <button
              type="button"
              onClick={() => {
                clearCart();
                showToast("Panier vidé", "info");
              }}
              style={{
                width: "100%",
                border: "1px solid #d6d3d1",
                padding: "12px",
                borderRadius: "14px",
                background: "white",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Vider le panier
            </button>
          </div>
        </div>
      )}
    </div>
  );
}