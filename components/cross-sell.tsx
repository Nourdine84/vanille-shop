"use client";

import { useCart } from "@/lib/cart-context";

function formatPrice(price: number) {
  return (price / 100).toFixed(2).replace(".", ",") + " €";
}

export default function CrossSell() {
  const { addToCart } = useCart();

  const suggestions = [
    {
      id: "extra1",
      name: "Caviar de vanille",
      priceCents: 1900,
    },
    {
      id: "extra2",
      name: "Cannelle premium",
      priceCents: 900,
    },
  ];

  return (
    <div style={box}>
      <h3 style={title}>🔥 Complétez votre commande</h3>

      {suggestions.map((item) => (
        <div key={item.id} style={row}>
          <div>
            <p style={name}>{item.name}</p>
            <p style={price}>{formatPrice(item.priceCents)}</p>
          </div>

          <button
            onClick={() =>
              addToCart({
                ...item,
                quantity: 1,
              })
            }
            style={btn}
          >
            Ajouter
          </button>
        </div>
      ))}
    </div>
  );
}

/* STYLE */

const box = {
  marginTop: "30px",
  background: "white",
  padding: "20px",
  borderRadius: "14px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const title = {
  marginBottom: "15px",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
};

const name = {
  fontWeight: 600,
};

const price = {
  fontSize: "13px",
  color: "#666",
};

const btn = {
  background: "#111",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "8px 12px",
  cursor: "pointer",
};