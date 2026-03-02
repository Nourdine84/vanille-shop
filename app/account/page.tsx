import Link from "next/link";

export default function AccountPage() {
  return (
    <div className="container mx-auto py-16">
      <h1 className="text-3xl font-bold mb-10">Mon Compte</h1>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
        <p className="text-yellow-700">
          ⚠️ Fonctionnalité en cours de développement
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Connexion</h2>
          <p className="text-gray-600 mb-4">
            Connectez-vous pour voir votre historique de commandes.
          </p>
          <Link href="/api/auth/signin" className="btn-primary">
            Se connecter
          </Link>
        </div>

        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Créer un compte</h2>
          <p className="text-gray-600 mb-4">
            Inscrivez-vous pour faciliter vos achats.
          </p>
          <Link href="/api/auth/signup" className="btn-secondary">
            S'inscrire
          </Link>
        </div>
      </div>

      <div className="mt-12">
        <Link href="/products" className="text-amber-600 hover:underline">
          ← Retour aux produits
        </Link>
      </div>
    </div>
  );
}