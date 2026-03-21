"use client";

import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-[#faf7f2]">
      
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-lg p-10 text-center">
        
        {/* ICON */}
        <div className="text-5xl mb-6">🎉</div>

        {/* TITLE */}
        <h1 className="text-3xl font-bold mb-4">
          Merci pour votre commande
        </h1>

        {/* TEXT */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          Votre paiement a été confirmé avec succès.  
          Nous préparons votre commande avec soin afin de vous offrir une
          expérience à la hauteur de Vanille’Or.
        </p>

        {/* TRUST */}
        <div className="bg-[#faf7f2] rounded-xl p-4 mb-6 text-sm text-gray-700">
          ✔ Préparation rapide  
          <br />
          ✔ Expédition sous 48h  
          <br />
          ✔ Qualité premium garantie
        </div>

        {/* CTA */}
        <Link
          href="/products"
          className="block bg-[#a16207] hover:bg-[#854d0e] text-white py-4 rounded-xl font-semibold transition"
        >
          Continuer mes achats
        </Link>

        {/* BRAND */}
        <p className="mt-6 text-xs text-gray-400">
          Vanille’Or — L’alliance entre authenticité et excellence
        </p>
      </div>

    </div>
  );
}