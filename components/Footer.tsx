"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Masqué sur l'administration (chrome dédié).
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-[#f8f5ef] border-t border-[#ece7df] mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* =========================
           TOP GRID
        ========================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* BRAND */}
          <div>
            <h2 className="text-2xl font-extrabold text-[#a16207] mb-4">
              Vanille’Or
            </h2>

            <p className="text-[#666] text-sm leading-7">
              Vanille premium de Madagascar sélectionnée avec exigence.
              Une qualité artisanale destinée aux particuliers,
              pâtissiers, restaurateurs et professionnels.
            </p>

            {/* TRUST */}
            <div className="mt-6 flex flex-col gap-2 text-sm text-[#444]">
              <span>✔ Sélection premium</span>
              <span>✔ Livraison France & Europe</span>
              <span>✔ Paiement sécurisé Stripe</span>
            </div>
          </div>

          {/* NAVIGATION */}
          <div>
            <h3 className="font-bold text-[#111] mb-5">
              Navigation
            </h3>

            <ul className="flex flex-col gap-3 text-sm text-[#666]">
              <li>
                <Link href="/" className="hover:text-[#a16207] transition">
                  Accueil
                </Link>
              </li>

              <li>
                <Link href="/products" className="hover:text-[#a16207] transition">
                  Produits
                </Link>
              </li>

              <li>
                <Link href="/collections/vanille" className="hover:text-[#a16207] transition">
                  Vanille
                </Link>
              </li>

              <li>
                <Link href="/collections/epices" className="hover:text-[#a16207] transition">
                  Épices
                </Link>
              </li>

              <li>
                <Link href="/packs" className="hover:text-[#a16207] transition">
                  Packs cadeaux
                </Link>
              </li>

              <li>
                <Link href="/blog" className="hover:text-[#a16207] transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* INFORMATIONS */}
          <div>
            <h3 className="font-bold text-[#111] mb-5">
              Informations
            </h3>

            <ul className="flex flex-col gap-3 text-sm text-[#666]">

              <li>
                <Link href="/b2b" className="hover:text-[#a16207] transition">
                  Professionnels / B2B
                </Link>
              </li>

              <li>
                <Link href="/reclamation" className="hover:text-[#a16207] transition">
                  Réclamation
                </Link>
              </li>

              <li>
                <Link href="/contact" className="hover:text-[#a16207] transition">
                  Contact
                </Link>
              </li>

              <li>
                <Link href="/login" className="hover:text-[#a16207] transition">
                  Connexion
                </Link>
              </li>

              <li>
                <Link href="/register" className="hover:text-[#a16207] transition">
                  Créer un compte
                </Link>
              </li>
            </ul>
          </div>

          {/* SEO / STORY */}
          <div>
            <h3 className="font-bold text-[#111] mb-5">
              Vanille de Madagascar
            </h3>

            <p className="text-sm text-[#666] leading-7">
              Découvrez une sélection de vanille bourbon,
              vanille pompona, épices rares et produits
              premium directement inspirés du savoir-faire
              malgache.
            </p>

            <div className="mt-6">
              <Link
                href="/products"
                className="inline-block bg-[#a16207] text-white px-5 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition"
              >
                Voir le catalogue
              </Link>
            </div>
          </div>
        </div>

        {/* =========================
           BOTTOM
        ========================= */}
        <div className="mt-14 pt-8 border-t border-[#e7dfd3]">

          <div className="flex flex-col md:flex-row items-center justify-between gap-5">

            <div className="text-sm text-[#777] text-center md:text-left">
              © {new Date().getFullYear()} Vanille’Or — Tous droits réservés
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-[#777]">

              <Link
                href="/legal/mentions-legales"
                className="hover:text-[#a16207] transition"
              >
                Mentions légales
              </Link>

              <Link
                href="/cgv"
                className="hover:text-[#a16207] transition"
              >
                CGV
              </Link>

              <Link
                href="/legal/confidentialite"
                className="hover:text-[#a16207] transition"
              >
                Confidentialité
              </Link>

              <Link
                href="/legal/cookies"
                className="hover:text-[#a16207] transition"
              >
                Politique de cookies
              </Link>

              <Link
                href="/legal/cgu"
                className="hover:text-[#a16207] transition"
              >
                CGU
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}