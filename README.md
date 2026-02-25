# Vanille Shop - E-commerce de Vanilles

Un site e-commerce moderne pour la vente de vanilles, construit avec Next.js 14, TypeScript, Tailwind CSS et Stripe.

## 🚀 Fonctionnalités

- ✅ Catalogue de produits (vanilles)
- ✅ Panier d'achat
- ✅ Système de paiement avec Stripe
- ✅ Authentification utilisateur
- ✅ Gestion des commandes
- ✅ Design responsive avec Tailwind CSS
- ✅ API RESTful

## 📋 Stack Technique

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Payment**: Stripe
- **Database**: (À configurer - PostgreSQL recommandé)
- **Deployment**: Vercel (recommandé)

## 🛠️ Installation

1. **Cloner le repository**
```bash
git clone https://github.com/Nourdine84/vanille-shop.git
cd vanille-shop
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
Créer un fichier `.env.local` à la racine du projet:
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key
STRIPE_SECRET_KEY=your_key
DATABASE_URL=your_database_url
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur.

## 📁 Structure du Projet

```
vanille-shop/
├── app/                    # App Router (Next.js 14)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── products/
│   ├── cart/
│   ├── checkout/
│   └── api/
├── components/             # Composants React
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   ├── Cart.tsx
│   └── Footer.tsx
├── lib/                    # Fonctions utilitaires
│   ├── stripe.ts
│   └── db.ts
├── public/                 # Assets statiques
├── styles/                 # Styles globaux
└── package.json
```

## 🔐 Configuration Stripe

1. Créer un compte sur [Stripe](https://stripe.com)
2. Récupérer vos clés API
3. Les ajouter à `.env.local`

## 📦 Scripts Disponibles

- `npm run dev` - Lancer le serveur de développement
- `npm run build` - Builder pour la production
- `npm start` - Démarrer le serveur de production
- `npm run lint` - Lancer ESLint

## 🚀 Déploiement

Ce projet est optimisé pour Vercel:

```bash
npm i -g vercel
vercel
```

## 📝 License

MIT

## 👨‍💻 Auteur

Nourdine84