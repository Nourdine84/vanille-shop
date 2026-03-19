"use client";

import Link from "next/link";
import { useCart } from "../../lib/cart-store";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce(
    (acc, item) => acc + item.priceCents * item.quantity,
    0
  );

  return (
    <div className="max-w-6xl mx-auto py-20 px-6">
      <h1 style={{ fontSize: "40px", fontWeight: 800, marginBottom: "40px" }}>
        Votre panier
      </h1>

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
          {/* LISTE PRODUITS */}
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
                  <h3 style={{ fontWeight: 700 }}>{item.name}</h3>

                  <p style={{ color: "#6b7280", fontSize: "14px" }}>
                    Quantité : {item.quantity}
                  </p>

                  <p style={{ fontWeight: 700, marginTop: "6px" }}>
                    {(item.priceCents / 100).toFixed(2)} €
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{
                    border: "none",
                    background: "#fee2e2",
                    color: "#b91c1c",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>

          {/* RÉCAP */}
          <div
            style={{
              border: "1px solid #ece7df",
              borderRadius: "18px",
              padding: "24px",
              background: "#fffdf9",
              height: "fit-content",
            }}
          >
            <h2 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "20px" }}>
              Résumé
            </h2>

            <div style={{ marginBottom: "20px" }}>
              <p style={{ color: "#6b7280" }}>
                Total :
              </p>
              <p style={{ fontSize: "28px", fontWeight: 800 }}>
                {(total / 100).toFixed(2)} €
              </p>
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
                fontWeight: 600,
                marginBottom: "12px",
              }}
            >
              Passer au paiement
            </Link>

            <button
              onClick={clearCart}
              style={{
                width: "100%",
                border: "1px solid #d6d3d1",
                padding: "12px",
                borderRadius: "14px",
                background: "white",
                cursor: "pointer",
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