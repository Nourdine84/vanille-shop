"use client";

import Link from "next/link";
import Button from "../ui/Button";

export default function Header() {
  return (
    <header className="border-b border-amber-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-3xl font-serif font-bold text-amber-900">Vanille’Or</span>
            <span className="text-xs italic text-amber-700">L'essence précieuse de Madagascar</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-amber-800 transition">
              Nos Produits
            </Link>
            <Link href="/b2b" className="text-gray-700 hover:text-amber-800 transition">
              Professionnels
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-amber-800 transition">
              Notre Histoire
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-amber-800 transition">
              Contact
            </Link>
          </nav>

          {/* Contact et panier */}
          <div className="flex items-center space-x-4">
            <a href="tel:+33622111375" className="hidden lg:flex items-center text-amber-800">
              <span className="text-sm">06 22 11 13 75</span>
            </a>
            <Link href="/cart" className="relative">
              <span className="text-2xl">🛒</span>
            </Link>
            <Button href="/products" variant="primary" className="hidden lg:inline-block">
              DÉCOUVRIR NOS PRODUITS
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}