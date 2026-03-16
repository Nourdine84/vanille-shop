"use client";

import { useCartStore } from "../../lib/cart-store";

export default function CheckoutPage() {

  const cart = useCartStore((state) => state.cart);

  const total = cart.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0
  );

  async function handleCheckout() {

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ cart })
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }

  }

  return (

    <div className="max-w-5xl mx-auto py-24 px-6">

      <h1 className="text-3xl font-bold mb-10">
        Paiement
      </h1>

      {cart.length === 0 ? (

        <p className="text-gray-500">
          Votre panier est vide.
        </p>

      ) : (

        <>
          <div className="space-y-6 mb-10">

            {cart.map((item) => (

              <div
                key={item.id}
                className="flex justify-between border-b pb-4"
              >

                <div>

                  <p className="font-semibold">
                    {item.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    Quantité : {item.quantity}
                  </p>

                </div>

                <p className="font-medium">
                  {(item.priceCents * item.quantity / 100).toFixed(2)} €
                </p>

              </div>

            ))}

          </div>

          <div className="flex justify-between items-center mb-10">

            <p className="text-xl font-bold">
              Total
            </p>

            <p className="text-xl font-bold">
              {(total / 100).toFixed(2)} €
            </p>

          </div>

          <button
            onClick={handleCheckout}
            className="bg-amber-700 text-white px-8 py-4 rounded-lg hover:bg-amber-800 transition"
          >
            Payer avec Stripe
          </button>

        </>

      )}

    </div>

  );
}


