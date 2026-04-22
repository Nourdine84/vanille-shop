# 🛒 Vanille'Or Shop — E-commerce Premium

[![E2E Tests](https://github.com/Nourdine84/vanille-shop/actions/workflows/playwright.yml/badge.svg)](https://github.com/Nourdine84/vanille-shop/actions/workflows/playwright.yml)

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Playwright](https://img.shields.io/badge/Playwright-E2E-green?logo=playwright)
![Stripe](https://img.shields.io/badge/Stripe-Payments-purple?logo=stripe)
![Prisma](https://img.shields.io/badge/Prisma-ORM-blue?logo=prisma)
![Status](https://img.shields.io/badge/status-production_ready-brightgreen)

---

## 🚀 Description

Vanille'Or Shop est un e-commerce moderne dédié à la vente de vanille et d’épices premium de Madagascar.

👉 Objectif : proposer une expérience fluide, fiable et orientée conversion, avec une approche **qualité produit + qualité technique**.

---

## 🧪 QA & Fiabilité

- ✅ Tests E2E Playwright (100% stable)
- ✅ Mock Stripe sécurisé (CI ready)
- ✅ Tests panier & checkout robustes
- ✅ Compatible CI/CD (GitHub Actions)
- ✅ Gestion des cas flaky (overlay, async, navigation)

---

## 🛒 Fonctionnalités

- Catalogue produits dynamique
- Panier intelligent (persistant)
- Checkout sécurisé Stripe
- Recommandations produits (cross-sell)
- Authentification utilisateur
- Admin panel (produits & commandes)
- UX responsive mobile / desktop

---

## 📋 Stack Technique

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: API Routes Next.js
- **Database**: Prisma (PostgreSQL)
- **Paiement**: Stripe
- **Tests**: Playwright E2E
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel

---

## 🛠️ Installation

### 1. Cloner le repo

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

🧪 Lancer les tests E2E
npx playwright test

Rapport HTML : 
npx playwright show-report

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
QA Engineer . E-commerce . Automation . AI-driven dev
