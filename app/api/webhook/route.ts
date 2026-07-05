// Ancien webhook dupliqué → désormais un simple ré-export du webhook officiel
// (app/api/stripe/webhook/route.ts). Même principe que create-checkout-session
// qui ré-exporte checkout-session. Les deux URLs résolvent le MÊME handler :
// plus aucune divergence ni double implémentation, quelle que soit l'URL
// configurée dans le Dashboard Stripe.
export { POST, runtime, dynamic } from "../stripe/webhook/route";
