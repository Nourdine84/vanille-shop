"use client";

import { useCart } from "@/lib/cart-store";

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
      <h3>Vous pourriez aussi aimer</h3>

      {suggestions.map((item) => (
        <div key={item.id} style={row}>
          <span>{item.name}</span>
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

const box = {
  marginTop: "30px",
  background: "white",
  padding: "20px",
  borderRadius: "12px",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
};

const btn = {
  background: "#a16207",
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "6px 10px",
};