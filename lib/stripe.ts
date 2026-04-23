import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY manquante");
}

declare global {
  // eslint-disable-next-line no-var
  var __stripe__: Stripe | undefined;
}

export const stripe =
  global.__stripe__ ||
  new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20" as any,
  });

if (process.env.NODE_ENV !== "production") {
  global.__stripe__ = stripe;
}