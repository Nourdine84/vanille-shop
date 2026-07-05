import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================
   GET ORDER
========================= */

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: {
      id: string;
    };
  }
) {
  try {
    const orderId =
      params.id?.trim();

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          code: "MISSING_ORDER_ID",
          message:
            "Identifiant de commande manquant.",
        },
        {
          status: 400,
        }
      );
    }

    /* =========================
       FIND ORDER
    ========================= */

    const order =
      await prisma.order.findUnique({
        where: {
          id: orderId,
        },
      });

    /* =========================
       ORDER NOT READY YET
    ========================= */

    if (!order) {
      return NextResponse.json(
        {
          success: false,

          code: "ORDER_PROCESSING",

          message:
            "Votre commande est en cours de confirmation. Merci de patienter quelques instants.",

          retryable: true,
        },
        {
          status: 404,
        }
      );
    }

    /* =========================
       CONTRÔLE D'ACCÈS (capability)
    =========================

       La preuve d'accès est le `session_id` Stripe (haute entropie) : seul
       celui qui possède l'URL de confirmation Stripe peut voir les données
       sensibles de la commande. Il doit correspondre au stripeSessionId stocké.

       - Autorisé (session_id correct) → réponse complète (email + items).
       - Sinon → sous-ensemble PUBLIC minimal : ni email, ni items (le contenu
         acheté). Suffisant pour la page de confirmation (statut, total, suivi),
         mais aucune donnée personnelle n'est exposée à un tiers qui devinerait
         un id de commande.

       Aucun changement frontend requis : la page actuelle n'utilise pas
       `items` et n'affiche `email` que de façon conditionnelle. */

    const sessionId = new URL(req.url).searchParams.get("session_id");

    const authorized =
      !!sessionId &&
      !!order.stripeSessionId &&
      sessionId === order.stripeSessionId;

    /* =========================
       SUCCESS (données publiques)
    ========================= */

    const publicOrder = {
      success: true,

      id: order.id,

      status: order.status,

      totalCents: order.totalCents,

      currency: order.currency,

      trackingNumber: order.trackingNumber,

      carrier: order.carrier,

      createdAt: order.createdAt,
    };

    if (!authorized) {
      return NextResponse.json(publicOrder);
    }

    /* =========================
       SUCCESS (données sensibles, accès prouvé)
    ========================= */

    return NextResponse.json({
      ...publicOrder,

      email: order.email,

      items: order.items,
    });

  } catch (error) {
    console.error(
      "🔥 GET ORDER ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        code: "SERVER_ERROR",

        message:
          "Une erreur est survenue lors de la récupération de votre commande.",
      },
      {
        status: 500,
      }
    );
  }
}