import React from "react";
import Link from "next/link";
import { getCurrentUser } from "../../lib/auth";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-4">Mon compte</h1>

      <p className="mb-2">
        <strong>Nom :</strong> {user.name || "Non renseigné"}
      </p>

      <p className="mb-6">
        <strong>Email :</strong> {user.email}
      </p>

      <div style={{ display: "flex", gap: "12px" }}>
        <Link href="/account/orders" className="btn-primary">
          Voir mes commandes
        </Link>
      </div>
    </div>
  );
}
