"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-20 border-t">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-10">

          {/* LOGO / BRAND */}
          <div>
            <h2 className="text-xl font-bold mb-4">Vanille Or</h2>
            <p className="text-gray-600 text-sm">
              Vanille premium de Madagascar sélectionnée avec exigence.
              Qualité artisanale pour sublimer vos créations.
            </p>
          </div>

          {/* NAVIGATION */}
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="flex flex-col gap-2 text-gray-600 text-sm">
              <li>
                <Link href="/">Accueil</Link>
              </li>
              <li>
                <Link href="/products">Produits</Link>
              </li>
              <li>
                <Link href="/cart">Panier</Link>
              </li>
              <li>
                <Link href="/account">Mon compte</Link>
              </li>
            </ul>
          </div>

          {/* INFOS */}
          <div>
            <h3 className="font-semibold mb-4">Informations</h3>
            <ul className="flex flex-col gap-2 text-gray-600 text-sm">
              <li>Livraison 3 à 5 jours</li>
              <li>Paiement sécurisé</li>
              <li>Support client réactif</li>
              <li>France & Europe</li>
            </ul>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="mt-10 pt-6 border-t text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Vanille Or — Tous droits réservés
          <br />
          <span className="block mt-2">
            Site réalisé par <strong>AKM.Consulting</strong>
          </span>
        </div>

      </div>
    </footer>
  );
}