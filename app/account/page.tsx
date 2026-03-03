import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="container mx-auto py-16">
      <h1 className="text-3xl font-bold mb-10">Mon Compte</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Carte Informations personnelles */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
          <p className="text-gray-600 mb-4">
            Gérez vos informations personnelles et votre mot de passe.
          </p>
          <Link href="/account/profile" className="text-amber-600 hover:underline">
            Modifier mon profil →
          </Link>
        </div>

        {/* Carte Commandes - NOUVEAU LIEN */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Mes commandes</h2>
          <p className="text-gray-600 mb-4">
            Consultez l'historique de vos commandes.
          </p>
          <Link href="/account/orders" className="text-amber-600 hover:underline">
            Voir mes commandes →
          </Link>
        </div>

        {/* Carte Déconnexion */}
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Déconnexion</h2>
          <p className="text-gray-600 mb-4">
            Vous souhaitez vous déconnecter ?
          </p>
          <button className="text-red-600 hover:underline">
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}