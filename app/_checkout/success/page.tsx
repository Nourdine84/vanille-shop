"use client";

import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="container mx-auto py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Merci pour votre commande !</h1>
      <p className="text-gray-600 mb-8">Votre paiement a bien été accepté.</p>
      <Link href="/products" className="btn-primary">
        Continuer mes achats
      </Link>
    </div>
  );
}