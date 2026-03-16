"use client";

import { useCartStore } from "../../lib/cart-store";

export default function CheckoutClient() {

  const cart = useCartStore((state) => state.cart);

  return (
    <div>
      Checkout Client – {cart.length} articles
    </div>
  );
}