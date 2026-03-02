"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className="flex justify-between p-6 border-b">
      <Link href="/">Accueil</Link>
      <Link href="/products">Produits</Link>
      <Link href="/cart">
        Panier ({totalItems})
      </Link>
    </nav>
  );
}