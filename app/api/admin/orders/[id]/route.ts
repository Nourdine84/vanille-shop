import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* =========================
   GET ADMIN ORDER DETAIL
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
    const cookie =
      req.headers.get("cookie") || "";

    const isAdmin =
      cookie.includes("admin=true");

    if (!isAdmin) {
      return NextResponse.json(
        {
          error: "Accès admin refusé",
        },
        {
          status: 401,
        }
      );
    }

    const orderId =
      params.id?.trim();

    if (!orderId) {
      return NextResponse.json(
        {
          error: "ID commande manquant",
        },
        {
          status: 400,
        }
      );
    }

    const order =
      await prisma.order.findUnique({
        where: {
          id: orderId,
        },

        include: {
          user: true,
        },
      });

    if (!order) {
      return NextResponse.json(
        {
          error: "Commande introuvable",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      id: order.id,
      status: order.status,
      email:
        order.email ||
        order.user?.email ||
        null,
      userId: order.userId,
      totalCents: order.totalCents,
      currency: order.currency,
      items: order.items,
      stripeSessionId:
        order.stripeSessionId,
      stripePaymentId:
        order.stripePaymentId,
      trackingNumber:
        order.trackingNumber,
      carrier: order.carrier,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      user: order.user
        ? {
            id: order.user.id,
            email: order.user.email,
            name: order.user.name,
          }
        : null,
    });
  } catch (error) {
    console.error(
      "🔥 ADMIN GET ORDER ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erreur récupération commande admin",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================
   PATCH ADMIN ORDER
========================= */

export async function PATCH(
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
    const cookie =
      req.headers.get("cookie") || "";

    const isAdmin =
      cookie.includes("admin=true");

    if (!isAdmin) {
      return NextResponse.json(
        {
          error: "Accès admin refusé",
        },
        {
          status: 401,
        }
      );
    }

    const orderId =
      params.id?.trim();

    if (!orderId) {
      return NextResponse.json(
        {
          error: "ID commande manquant",
        },
        {
          status: 400,
        }
      );
    }

    const body =
      await req.json();

    const status =
      body?.status;

    const trackingNumber =
      body?.trackingNumber
        ? String(
            body.trackingNumber
          ).trim()
        : null;

    const carrier =
      body?.carrier
        ? String(body.carrier).trim()
        : null;

    const updateData: any = {};

    if (status) {
      updateData.status = status;
    }

    if (
      trackingNumber !== undefined
    ) {
      updateData.trackingNumber =
        trackingNumber || null;
    }

    if (carrier !== undefined) {
      updateData.carrier =
        carrier || null;
    }

    const order =
      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: updateData,
      });

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(
      "🔥 ADMIN PATCH ORDER ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erreur mise à jour commande admin",
      },
      {
        status: 500,
      }
    );
  }
}