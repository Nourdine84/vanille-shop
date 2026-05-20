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
       SUCCESS
    ========================= */

    return NextResponse.json({
      success: true,

      id: order.id,

      email: order.email,

      status: order.status,

      totalCents:
        order.totalCents,

      currency:
        order.currency,

      trackingNumber:
        order.trackingNumber,

      carrier:
        order.carrier,

      createdAt:
        order.createdAt,

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