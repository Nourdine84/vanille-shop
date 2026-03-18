"use client";

import { useEffect } from "react";
import { useCartStore } from "../../lib/cart-store";
import { useToast } from "../../components/ui/toast";

export default function SuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart);
  const { showToast } = useToast();

  useEffect(() => {
    clearCart();
    showToast("Commande confirmée 🎉", "success");
  }, []);

  return (
    <div className="container py-10 text-center">
      <h1 className="text-3xl font-bold mb-4">
        Merci pour votre commande 🙏
      </h1>

      <p className="text-gray-600">
        Vous recevrez un email de confirmation.
      </p>
    </div>
  );
}